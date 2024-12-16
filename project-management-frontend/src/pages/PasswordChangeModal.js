import React, { useState } from 'react';
import axios from 'axios';

const PasswordChangeModal = ({ isOpen, onClose, userId, token }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
  const [passwordChangeError, setPasswordChangeError] = useState(null);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New password and confirm password do not match');
      return;
    }
    
    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/${userId}/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPasswordChangeSuccess('Password updated successfully.');
      setPasswordChangeError(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordChangeSuccess(null);
      setPasswordChangeError('Failed to update password. Please try again.');
    }
  };

  if (!isOpen) return null; // If the modal is closed, do not render

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>

        <div className="mb-4">
          <label className="block">Current Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block">New Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block">Confirm New Password</label>
          <input
            type="password"
            className="border p-2 w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {passwordChangeSuccess && (
          <div className="text-green-500 mb-4">{passwordChangeSuccess}</div>
        )}
        {passwordChangeError && (
          <div className="text-red-500 mb-4">{passwordChangeError}</div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handlePasswordChange}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Change Password
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
