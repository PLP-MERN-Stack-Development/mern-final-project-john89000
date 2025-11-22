import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI, tasksAPI } from '../../services/api';
import { FiArrowLeft, FiEdit, FiUsers, FiCalendar, FiCheckSquare } from 'react-icons/fi';
import './Projects.css';

const ProjectDetails = () => {
  const { id } = useParams();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await projectsAPI.getById(id);
      return response.data.data;
    },
  });

  const { data: tasksData } = useQuery({
    queryKey: ['project-tasks', id],
    queryFn: async () => {
      const response = await tasksAPI.getAll({ project: id });
      return response.data.data.tasks;
    },
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading project details...</p>
      </div>
    );
  }

  const project = projectData?.project;
  const taskStats = projectData?.taskStats || {};
  const tasks = tasksData || [];

  return (
    <div className="project-details">
      <Link to="/projects" className="back-link">
        <FiArrowLeft /> Back to Projects
      </Link>

      <div className="project-header">
        <div 
          className="project-banner" 
          style={{ backgroundColor: project?.color }}
        />
        <div className="project-header-content">
          <div>
            <h1 className="page-title">{project?.name}</h1>
            <p className="page-description">{project?.description}</p>
          </div>
          <button className="btn btn-secondary">
            <FiEdit /> Edit Project
          </button>
        </div>
      </div>

      <div className="project-info-grid">
        <div className="info-card">
          <FiUsers className="info-icon" />
          <div>
            <p className="info-label">Team Members</p>
            <p className="info-value">{project?.members?.length || 0}</p>
          </div>
        </div>

        <div className="info-card">
          <FiCheckSquare className="info-icon" />
          <div>
            <p className="info-label">Total Tasks</p>
            <p className="info-value">{taskStats.total || 0}</p>
          </div>
        </div>

        <div className="info-card">
          <FiCalendar className="info-icon" />
          <div>
            <p className="info-label">Due Date</p>
            <p className="info-value">
              {project?.dueDate 
                ? new Date(project.dueDate).toLocaleDateString()
                : 'Not set'}
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon" style={{ background: 'var(--success)', color: 'white' }}>
            ✓
          </div>
          <div>
            <p className="info-label">Completed Tasks</p>
            <p className="info-value">{taskStats.completed || 0}</p>
          </div>
        </div>
      </div>

      <div className="project-content">
        <div className="project-section">
          <h2 className="section-title">Tasks</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Create your first task!</p>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="task-item"
                >
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta">
                      <span className={`badge badge-${task.status === 'completed' ? 'success' : 'primary'}`}>
                        {task.status}
                      </span>
                      <span className={`badge badge-${task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'success'}`}>
                        {task.priority}
                      </span>
                      {task.assignedTo && (
                        <span className="task-assignee">
                          Assigned to: {task.assignedTo.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="project-sidebar">
          <div className="project-section">
            <h3 className="section-title">Team Members</h3>
            <div className="members-list">
              {project?.members?.map((member) => (
                <div key={member._id} className="member-item">
                  <div className="member-avatar">
                    {member.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="member-name">{member.user?.name}</p>
                    <p className="member-role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {project?.tags && project.tags.length > 0 && (
            <div className="project-section">
              <h3 className="section-title">Tags</h3>
              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
