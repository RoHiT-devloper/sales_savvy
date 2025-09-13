// UserManagement.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./User_Management.css"; // external CSS file

const User_Management = () => {
  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      <ul className="user-links">
        <li>
          <Link to="/show-users" className="user-link">
            Show All Users
          </Link>
        </li>
        <li>
          <Link to="/delete-users" className="user-link delete">
            Delete Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default User_Management;
