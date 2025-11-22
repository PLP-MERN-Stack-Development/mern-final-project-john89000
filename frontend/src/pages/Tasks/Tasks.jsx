import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { tasksAPI, projectsAPI } from '../../services/api';
import { FiPlus, FiSearch, FiCheckSquare } from 'react-icons/fi';
import './Tasks.css';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', statusFilter, priorityFilter, projectFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (projectFilter) params.project = projectFilter;
      
      const response = await tasksAPI.getAll(params);
      return response.data.data.tasks;
    },
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll();
      return response.data.data.projects;
    },
  });

  const filteredTasks = tasksData?.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      'todo': 'badge',
      'in-progress': 'badge badge-warning',
      'review': 'badge badge-primary',
      'completed': 'badge badge-success',
    };
    return badges[status] || 'badge';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge badge-success',
      medium: 'badge badge-warning',
      high: 'badge badge-danger',
      critical: 'badge badge-danger',
    };
    return badges[priority] || 'badge';
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-description">Manage and track your tasks</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="filter-select"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="">All Projects</option>
          {projectsData?.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>
        
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : filteredTasks?.length === 0 ? (
        <div className="empty-state-large">
          <FiCheckSquare size={64} color="var(--gray-400)" />
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or create a new task!</p>
        </div>
      ) : (
        <div className="tasks-table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks?.map((task) => (
                <tr key={task._id}>
                  <td>
                    <Link to={`/tasks/${task._id}`} className="task-link">
                      <div className="task-cell">
                        <h4 className="task-cell-title">{task.title}</h4>
                        {task.description && (
                          <p className="task-cell-description">
                            {task.description.substring(0, 60)}
                            {task.description.length > 60 && '...'}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/projects/${task.project?._id}`} className="project-link">
                      <span 
                        className="project-dot" 
                        style={{ backgroundColor: task.project?.color }}
                      />
                      {task.project?.name}
                    </Link>
                  </td>
                  <td>
                    {task.assignedTo ? (
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {task.assignedTo.name?.charAt(0).toUpperCase()}
                        </div>
                        {task.assignedTo.name}
                      </div>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <span className={getPriorityBadge(task.priority)}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadge(task.status)}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    {task.dueDate ? (
                      <span className="date-cell">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted">No due date</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tasks;
