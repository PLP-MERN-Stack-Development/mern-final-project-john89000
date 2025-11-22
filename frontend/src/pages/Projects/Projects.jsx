import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { FiPlus, FiSearch, FiFolder, FiUsers, FiCalendar } from 'react-icons/fi';
import CreateProjectModal from './CreateProjectModal';
import './Projects.css';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['projects', statusFilter],
    queryFn: async () => {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await projectsAPI.getAll(params);
      return response.data.data.projects;
    },
  });

  const filteredProjects = data?.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      planning: 'badge',
      active: 'badge badge-primary',
      'on-hold': 'badge badge-warning',
      completed: 'badge badge-success',
      archived: 'badge',
    };
    return badges[status] || 'badge';
  };

  return (
    <div className="projects-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-description">Manage and organize your projects</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus /> Create Project
        </button>
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="empty-state-large">
          <FiFolder size={64} color="var(--gray-400)" />
          <h3>No projects found</h3>
          <p>Create your first project to get started!</p>
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <FiPlus /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects?.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="project-card"
            >
              <div
                className="project-card-header"
                style={{ backgroundColor: project.color || '#3b82f6' }}
              >
                <FiFolder size={32} color="white" />
              </div>
              
              <div className="project-card-body">
                <div className="project-card-title-row">
                  <h3 className="project-card-title">{project.name}</h3>
                  <span className={getStatusBadge(project.status)}>
                    {project.status}
                  </span>
                </div>
                
                <p className="project-card-description">
                  {project.description}
                </p>
                
                <div className="project-card-footer">
                  <div className="project-card-meta">
                    <span title="Team members">
                      <FiUsers size={16} />
                      {project.members?.length || 0}
                    </span>
                    {project.dueDate && (
                      <span title="Due date">
                        <FiCalendar size={16} />
                        {new Date(project.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="project-tags">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="tag">+{project.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Projects;
