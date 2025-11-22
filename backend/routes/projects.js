const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

// @route   GET /api/projects
// @desc    Get all projects for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {
      $or: [
        { owner: req.user.id },
        { 'members.user': req.user.id }
      ]
    };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: { projects }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access to this project
    const hasAccess = project.owner._id.toString() === req.user.id ||
      project.members.some(member => member.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Get task statistics
    const tasks = await Task.find({ project: project._id });
    const taskStats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      completed: tasks.filter(t => t.status === 'completed').length
    };

    res.json({
      success: true,
      data: { 
        project,
        taskStats
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], handleValidationErrors, async (req, res) => {
  try {
    const { name, description, status, priority, dueDate, tags, color } = req.body;

    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      status,
      priority,
      dueDate,
      tags,
      color,
      members: [{
        user: req.user.id,
        role: 'owner'
      }]
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.emit('project-created', { project: populatedProject });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: populatedProject }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or admin
    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    if (project.owner.toString() !== req.user.id && (!userMember || userMember.role === 'viewer')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const { name, description, status, priority, dueDate, tags, color } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = dueDate;
    if (tags) updateData.tags = tags;
    if (color) updateData.color = color;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'name email avatar')
     .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('project-updated', { project });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private
router.post('/:id/members', protect, [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').optional().isIn(['admin', 'member', 'viewer']).withMessage('Invalid role')
], handleValidationErrors, async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;
    
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or admin
    const userMember = project.members.find(m => m.user.toString() === req.user.id);
    if (project.owner.toString() !== req.user.id && (!userMember || userMember.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add members'
      });
    }

    // Check if user is already a member
    const existingMember = project.members.find(m => m.user.toString() === userId);
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project'
      });
    }

    project.members.push({ user: userId, role });
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('member-added', { project: populatedProject });

    res.json({
      success: true,
      message: 'Member added successfully',
      data: { project: populatedProject }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding member',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove member from project
// @access  Private
router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can remove members'
      });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('member-removed', { project: populatedProject });

    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { project: populatedProject }
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing member',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete the project'
      });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ project: req.params.id });
    
    await project.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.emit('project-deleted', { projectId: req.params.id });

    res.json({
      success: true,
      message: 'Project and associated tasks deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message
    });
  }
});

module.exports = router;
