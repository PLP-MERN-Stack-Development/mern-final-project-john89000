import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tasksAPI } from '../../services/api';
import { FiArrowLeft, FiEdit, FiUser, FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import './Tasks.css';

const TaskDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await tasksAPI.getById(id);
      return response.data.data.task;
    },
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  const task = data;

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
    <div className="task-details">
      <Link to="/tasks" className="back-link">
        <FiArrowLeft /> Back to Tasks
      </Link>

      <div className="task-header">
        <div className="task-title-row">
          <h1 className="page-title">{task?.title}</h1>
          <button className="btn btn-secondary">
            <FiEdit /> Edit Task
          </button>
        </div>

        <div className="task-badges">
          <span className={getStatusBadge(task?.status)}>
            {task?.status}
          </span>
          <span className={getPriorityBadge(task?.priority)}>
            {task?.priority} priority
          </span>
          {task?.tags?.map((tag, index) => (
            <span key={index} className="badge">
              <FiTag size={12} /> {tag}
            </span>
          ))}
        </div>

        <div className="task-meta-grid">
          <div className="task-meta-item">
            <span className="task-meta-label">Project</span>
            <Link 
              to={`/projects/${task?.project?._id}`}
              className="task-meta-value"
              style={{ color: 'var(--primary)' }}
            >
              {task?.project?.name}
            </Link>
          </div>

          <div className="task-meta-item">
            <span className="task-meta-label">Assigned To</span>
            <span className="task-meta-value">
              {task?.assignedTo?.name || 'Unassigned'}
            </span>
          </div>

          <div className="task-meta-item">
            <span className="task-meta-label">Created By</span>
            <span className="task-meta-value">
              {task?.createdBy?.name}
            </span>
          </div>

          <div className="task-meta-item">
            <span className="task-meta-label">Due Date</span>
            <span className="task-meta-value">
              {task?.dueDate 
                ? new Date(task.dueDate).toLocaleDateString()
                : 'Not set'}
            </span>
          </div>

          {task?.estimatedHours && (
            <div className="task-meta-item">
              <span className="task-meta-label">Estimated Hours</span>
              <span className="task-meta-value">{task.estimatedHours}h</span>
            </div>
          )}

          {task?.actualHours && (
            <div className="task-meta-item">
              <span className="task-meta-label">Actual Hours</span>
              <span className="task-meta-value">{task.actualHours}h</span>
            </div>
          )}
        </div>
      </div>

      <div className="task-content-grid">
        <div className="task-main">
          <div className="task-section">
            <h3>Description</h3>
            <p className="task-description">
              {task?.description || 'No description provided.'}
            </p>
          </div>

          <div className="task-section">
            <h3>Comments ({task?.comments?.length || 0})</h3>
            {task?.comments && task.comments.length > 0 ? (
              <div className="comments-list">
                {task.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-header">
                      <div className="user-avatar-small">
                        {comment.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="comment-author">{comment.user?.name}</span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No comments yet.</p>
            )}
          </div>
        </div>

        <div className="task-sidebar">
          {task?.subtasks && task.subtasks.length > 0 && (
            <div className="task-section">
              <h3>Subtasks</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {task.subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--border-radius)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      readOnly
                      style={{ cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        textDecoration: subtask.completed ? 'line-through' : 'none',
                        color: subtask.completed ? 'var(--gray-500)' : 'var(--gray-900)',
                      }}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task?.attachments && task.attachments.length > 0 && (
            <div className="task-section">
              <h3>Attachments</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {task.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                    style={{
                      padding: '0.75rem',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--border-radius)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--primary)',
                    }}
                  >
                    📎 {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
