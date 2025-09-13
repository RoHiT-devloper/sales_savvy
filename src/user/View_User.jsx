import React, { useState, useEffect } from 'react';
import './View_User.css';

const View_User = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const usersData = await response.json();
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please check if the server is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id?.toString().includes(searchTerm)
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(user =>
                user.role?.toLowerCase() === roleFilter.toLowerCase()
            );
        }

        setFilteredUsers(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setError('');
        fetchUsers();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            // Handle different date formats
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString; // Return original if invalid date
            }
            return date.toLocaleDateString('en-GB'); // dd/mm/yyyy format
        } catch (error) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="view-users-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="view-users-container">
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="refresh-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="view-users-container">
            <div className="view-users-header">
                <h1>User Management</h1>
                <p>View and manage all registered users</p>
            </div>

            {/* Controls */}
            <div className="users-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search users by name, email, or ID..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
                
                <div className="filter-box">
                    <select
                        value={roleFilter}
                        onChange={handleRoleFilterChange}
                        className="role-filter"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                </div>

                <button onClick={handleRefresh} className="refresh-btn">
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="users-summary">
                <p>Showing {filteredUsers.length} of {users.length} users</p>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Date of Birth</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-users">
                                    No users found{searchTerm || roleFilter !== 'all' ? ' matching your criteria' : ''}.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="user-row">
                                    <td className="user-id">{user.id || 'N/A'}</td>
                                    <td className="user-username">{user.username || 'N/A'}</td>
                                    <td className="user-email">{user.email || 'N/A'}</td>
                                    <td className="user-gender">
                                        <span className={`gender-badge ${user.gender?.toLowerCase()}`}>
                                            {user.gender || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="user-dob">{formatDate(user.dob)}</td>
                                    <td className="user-role">
                                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                                            {user.role || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default View_User;