import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { 
  FiFolder, 
  FiCheckSquare, 
  FiClock, 
  FiTrendingUp,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.getAll();
      return response.data.data.projects;
    },
  });

  const { data: tasksData } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await tasksAPI.getAll();
      return response.data.data.tasks;
    },
  });

  const myTasks = tasksData?.filter(task => 
    task.assignedTo?._id === user?.id || task.createdBy?._id === user?.id
  ) || [];

  const stats = [
    {
      label: 'Total Projects',
      value: projectsData?.length || 0,
      icon: FiFolder,
      color: '#3b82f6',
      link: '/projects',
    },
    {
      label: 'Total Tasks',
      value: myTasks.length,
      icon: FiCheckSquare,
      color: '#8b5cf6',
      link: '/tasks',
    },
    {
      label: 'In Progress',
      value: myTasks.filter(t => t.status === 'in-progress').length,
      icon: FiActivity,
      color: '#f59e0b',
    },
    {
      label: 'Completed',
      value: myTasks.filter(t => t.status === 'completed').length,
      icon: FiTrendingUp,
      color: '#10b981',
    },
  ];

  const recentProjects = projectsData?.slice(0, 5) || [];
  const urgentTasks = myTasks
    .filter(task => {
      if (!task.dueDate) return false;
      const daysUntilDue = Math.ceil(
        (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDue <= 3 && task.status !== 'completed';
    })
    .slice(0, 5);

  const getPriorityBadge = (priority) => {
    const badges = {
      low: 'badge badge-success',
      medium: 'badge badge-warning',
      high: 'badge badge-danger',
      critical: 'badge badge-danger',
    };
    return badges[priority] || 'badge';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'todo': 'badge',
      'in-progress': 'badge badge-warning',
      'review': 'badge badge-primary',
      'completed': 'badge badge-success',
    };
    return badges[status] || 'badge';
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name}! 👋</h1>
        <p className="page-description">
          Here's what's happening with your projects and tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link || '#'}
            className="stat-card"
            style={{ borderLeftColor: stat.color }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color + '15', color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Recent Projects */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiFolder /> Recent Projects
            </h2>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          <div className="projects-list">
            {recentProjects.length === 0 ? (
              <p className="empty-state">No projects yet. Create your first project!</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className="project-item"
                >
                  <div 
                    className="project-color" 
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="project-info">
                    <h4 className="project-name">{project.name}</h4>
                    <p className="project-description">{project.description}</p>
                  </div>
                  <span className={getStatusBadge(project.status)}>
                    {project.status}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiAlertCircle /> Urgent Tasks
            </h2>
            <Link to="/tasks" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>
          <div className="tasks-list">
            {urgentTasks.length === 0 ? (
              <p className="empty-state">No urgent tasks at the moment!</p>
            ) : (
              urgentTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="task-item"
                >
                  <div className="task-info">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-meta">
                      <span className={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </span>
                      <span className="task-project">
                        {task.project?.name}
                      </span>
                      {task.dueDate && (
                        <span className="task-due">
                          <FiClock size={14} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
