import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import * as authAPI from '../api/auth';
import './Settings.css';

export const Settings = () => {
  const { user, fetchCurrentUser, storageInfo, fetchStorageInfo } = useAuth();
  const { addToast } = useUIStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSavingProfile, setSavingProfile] = useState(false);
  const [isSavingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchStorageInfo();
  }, [fetchCurrentUser, fetchStorageInfo]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = useCallback(async () => {
    setSavingProfile(true);
    try {
      const updated = await authAPI.updateCurrentUser({ full_name: fullName, email });
      if (updated) {
        addToast('Profile updated successfully', 'success');
        await fetchCurrentUser();
      }
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  }, [fullName, email, addToast, fetchCurrentUser]);

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword) {
      addToast('Please enter current and new password', 'warning');
      return;
    }

    setSavingPassword(true);
    try {
      await authAPI.changePasswordByPayload({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      addToast('Password changed successfully', 'success');
    } catch {
      addToast('Failed to change password', 'error');
    } finally {
      setSavingPassword(false);
    }
  }, [currentPassword, newPassword, addToast]);

  return (
    <DashboardLayout>
      <div className="settings-page">
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Profile, password, and storage details.</p>
        </header>

        <section className="settings-card">
          <h2>Profile</h2>
          <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleUpdateProfile} isLoading={isSavingProfile}>Save Profile</Button>
        </section>

        <section className="settings-card">
          <h2>Password</h2>
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleChangePassword} isLoading={isSavingPassword}>Change Password</Button>
        </section>

        <section className="settings-card">
          <h2>Storage</h2>
          <p>Used: {storageInfo?.storage_used ?? user?.storage_used ?? 0} bytes</p>
          <p>Limit: {storageInfo?.storage_limit ?? user?.storage_limit ?? 0} bytes</p>
          <p>Available: {storageInfo?.storage_available ?? 0} bytes</p>
          <p>Usage: {storageInfo?.usage_percentage ?? 0}%</p>
        </section>
      </div>
    </DashboardLayout>
  );
};
