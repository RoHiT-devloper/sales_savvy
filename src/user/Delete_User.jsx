import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Delete_User.css';

const Delete_User = () => {
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [error, setError] = useState("");
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    // Fetch all users on component mount
    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const usersData = await response.json();
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to load users. Please try again.");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        // Find the selected user for confirmation message
        const user = users.find(u => u.id === parseInt(e.target.value));
        setSelectedUser(user || null);
    };

    const handleUserSelect = (user) => {
        setUserId(user.id.toString());
        setSelectedUser(user);
    };

    const validateForm = () => {
        if (!userId.trim()) {
            setError("Please select a user or enter a User ID");
            return false;
        }
        
        if (isNaN(userId) || Number(userId) <= 0) {
            setError("Please enter a valid User ID");
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        // Show confirmation popup instead of directly deleting
        setShowConfirmPopup(true);
    };

    const confirmDelete = async () => {
        setShowConfirmPopup(false);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/deleteUser?id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server returned ${response.status}`);
            }

            const result = await response.text();
            setSuccessMessage(result || "User deleted successfully!");
            setShowSuccessPopup(true);
            
            // Refresh the users list
            fetchAllUsers();
            
        } catch (error) {
            console.error("Error deleting user:", error);
            setError(error.message || "Failed to delete user. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        setUserId("");
        setSelectedUser(null);
    };

    const handleCancel = () => {
        setUserId("");
        setSelectedUser(null);
        setError("");
    };

    const handleRefreshUsers = () => {
        setIsLoadingUsers(true);
        setError("");
        fetchAllUsers();
    };

    return (
        <div className="delete-user-container">
            <div className="delete-user-header">
                <h1>Delete User</h1>
                <p>Remove a user account from the system</p>
            </div>

            {/* Users List */}
            <div className="users-list-section">
                <div className="section-header">
                    <h2>Select User to Delete</h2>
                    <button 
                        onClick={handleRefreshUsers} 
                        disabled={isLoadingUsers}
                        className="refresh-btn"
                    >
                        {isLoadingUsers ? "Refreshing..." : "🔄 Refresh List"}
                    </button>
                </div>

                {isLoadingUsers ? (
                    <div className="loading-users">
                        <div className="spinner-small"></div>
                        <p>Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="no-users">
                        <p>No users found in the system.</p>
                    </div>
                ) : (
                    <div className="users-grid">
                        {users.map(user => (
                            <div 
                                key={user.id} 
                                className={`user-card ${userId === user.id.toString() ? 'selected' : ''}`}
                                onClick={() => handleUserSelect(user)}
                            >
                                <div className="user-info">
                                    <span className="user-id">ID: {user.id}</span>
                                    <span className="user-name">{user.username}</span>
                                    <span className="user-email">{user.email}</span>
                                    <span className={`user-role ${user.role}`}>{user.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Delete Form */}
            <form onSubmit={handleSubmit} className="delete-user-form">
                <div className="form-group">
                    <label className="form-label required">
                        User ID to Delete:
                    </label>
                    <input
                        type="number"
                        name="userId"
                        value={userId}
                        onChange={handleUserIdChange}
                        disabled={isLoading}
                        min="1"
                        className="form-input"
                        placeholder="Enter user ID or select from list above"
                    />
                    {selectedUser && (
                        <div className="selected-user-preview">
                            <strong>Selected User:</strong> {selectedUser.username} 
                            ({selectedUser.email}) - {selectedUser.role}
                        </div>
                    )}
                </div>
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={isLoading || !userId}
                        className="btn btn-danger"
                    >
                        {isLoading ? "Deleting..." : "Delete User"}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {error && (
                <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    {error}
                </div>
            )}

            {/* Confirmation Popup */}
            {showConfirmPopup && selectedUser && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-content">
                            <span className="popup-icon warning">⚠️</span>
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete this user?</p>
                            <div className="user-delete-details">
                                <p><strong>ID:</strong> {selectedUser.id}</p>
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Role:</strong> {selectedUser.role}</p>
                            </div>
                            <p className="warning-text">
                                This action cannot be undone. All user data will be permanently deleted.
                            </p>
                            <div className="popup-actions">
                                <button 
                                    onClick={confirmDelete}
                                    className="btn btn-danger"
                                >
                                    Yes, Delete User
                                </button>
                                <button 
                                    onClick={handleCancelDelete}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-content">
                            <span className="popup-icon success">✅</span>
                            <h3>Success!</h3>
                            <p>{successMessage}</p>
                            <button 
                                onClick={handlePopupOk}
                                className="btn btn-primary"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Safety Warning */}
            <div className="safety-warning">
                <h3>⚠️ Important Notice</h3>
                <p>
                    Deleting a user is a permanent action. All user data will be 
                    removed from the system and cannot be recovered. Please double-check 
                    the user information before proceeding with deletion.
                </p>
            </div>
        </div>
    );
};

export default Delete_User;