import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onSubmitProfile = async (data) => {
    setIsLoadingProfile(true);
    try {
      const response = await authAPI.updateProfile(data);
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setIsLoadingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPassword();
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">Profile Settings</h1>
        <p className="page-description">Manage your account settings and preferences</p>
      </div>

      <div className="profile-grid">
        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name} />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2>{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <span className="profile-role badge badge-primary">{user?.role}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member Since</span>
              <span className="stat-value">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last Login</span>
              <span className="stat-value">
                {user?.lastLogin 
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="settings-section">
          <div className="section-header">
            <h3>
              <FiUser /> Profile Information
            </h3>
            {!isEditingProfile && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  {...registerProfile('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                />
                {profileErrors.name && (
                  <span className="form-error">{profileErrors.name.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-input"
                  rows="4"
                  {...registerProfile('bio')}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isLoadingProfile}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoadingProfile}
                >
                  {isLoadingProfile ? (
                    <>
                      <span className="loading-spinner"></span> Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Bio</span>
                <span className="info-value">
                  {user?.bio || 'No bio provided'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="settings-section">
          <div className="section-header">
            <h3>
              <FiLock /> Change Password
            </h3>
            {!isChangingPassword && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                />
                {passwordErrors.currentPassword && (
                  <span className="form-error">
                    {passwordErrors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                {passwordErrors.newPassword && (
                  <span className="form-error">
                    {passwordErrors.newPassword.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <span className="form-error">
                    {passwordErrors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsChangingPassword(false);
                    resetPassword();
                  }}
                  disabled={isLoadingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoadingPassword}
                >
                  {isLoadingPassword ? (
                    <>
                      <span className="loading-spinner"></span> Changing...
                    </>
                  ) : (
                    <>
                      <FiSave /> Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="password-info">
              Click "Change Password" to update your password. Make sure to use a
              strong password with at least 6 characters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
