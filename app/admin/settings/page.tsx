'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Edit,
  Loader2,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

export default function SettingsPage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<'personal' | 'password'>('personal');
  const [loading, setLoading] = useState(true);

  const [personalError, setPersonalError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Personal info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(''); // display-only (backend allowed fields doesn't include email)
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState(''); // backend expects currentPassword
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const adminUser = useMemo(() => {
    if (!session) return {};
    return ((session as any).rawUser || session.user || {}) as any;
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const nameArray = (adminUser.name || '').split(' ');
    setFirstName(nameArray[0] || '');
    setLastName(nameArray.slice(1).join(' ') || '');
    setEmail(adminUser.email || '');
    setPhone(adminUser.phone || '');
    setBio(adminUser.bio || '');

    // optional: if you store avatar url in session
    if (adminUser.profileImage?.url) setAvatarPreview(adminUser.profileImage.url);

    setLoading(false);
  }, [session, adminUser]);

  // cleanup object url preview
  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handlePickAvatar = (file: File | null) => {
    if (!file) return;
    setAvatarFile(file);

    // preview
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const resetPersonalFromSession = () => {
    const nameArray = (adminUser.name || '').split(' ');
    setFirstName(nameArray[0] || '');
    setLastName(nameArray.slice(1).join(' ') || '');
    setEmail(adminUser.email || '');
    setPhone(adminUser.phone || '');
    setBio(adminUser.bio || '');
    setAvatarFile(null);
    setPersonalError('');
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalError('');

    if (!firstName || !lastName) {
      setPersonalError('Please fill in all required fields');
      return;
    }

    // Backend allowed fields include: name, phone, bio, address, serviceArea, ...
    // Email is NOT in allowed, so we keep it display-only.
    const fullName = `${firstName} ${lastName}`.trim();

    try {
      setIsUpdatingPersonal(true);

      const form = new FormData();
      form.append('name', fullName);
      if (phone) form.append('phone', phone);
      if (bio) form.append('bio', bio);

      // avatar field name must match upload.single("avatar")
      if (avatarFile) form.append('avatar', avatarFile);

      // IMPORTANT: route from your backend
      await api.put('/api/v1/users/update-profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Profile updated successfully');
      setIsEditingPersonal(false);
      setAvatarFile(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to update profile';
      setPersonalError(message);
      toast.error(message);
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);

      // backend expects: currentPassword, newPassword, confirmPassword
      await api.put('/api/v1/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || 'Failed to change password';
      setPasswordError(message);
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'personal'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'password'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Profile Card */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-2xl font-bold text-purple-600 overflow-hidden">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {firstName.charAt(0)}
                      {lastName.charAt(0)}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-sm text-gray-600">@admin</p>
                </div>
              </div>

              <Button
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>

            {/* Form */}
            {isEditingPersonal && (
              <form onSubmit={handleUpdatePersonal} className="space-y-5">
                {personalError && (
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{personalError}</p>
                  </div>
                )}

                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={isUpdatingPersonal}
                      onChange={(e) => handlePickAvatar(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      JPG/PNG
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Mr"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isUpdatingPersonal}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Raja"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isUpdatingPersonal}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="raja1234@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email change is disabled here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      placeholder="(307) 555-0133"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isUpdatingPersonal}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={isUpdatingPersonal}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isUpdatingPersonal}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isUpdatingPersonal ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditingPersonal(false);
                      resetPersonalFromSession();
                    }}
                    disabled={isUpdatingPersonal}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleChangePassword} className="max-w-md space-y-5">
              {passwordError && (
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{passwordError}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
