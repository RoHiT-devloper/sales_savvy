import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sign_in from "./pages/Sign_in";
import Sign_up from "./pages/Sign_up";
import Customer_home from "./customer_page/CustomerPage";
import Welcome from "./pages/Welcome";
import Add_Product from './productmanager/Add_Product';
import Delete_Product from "./productmanager/Delete_Product";
import Update_Product from './productmanager/Update_Product';
import View_User from './user/View_User';
import Show_All_Product from './productmanager/Show_All_Product';
import Search_Product from './productmanager/Search_Product';
import Product_Manager from './admin/Product_Manager';
import Admin_home from './admin/Admin_Home';
import Delete_User from './user/Delete_User';
import Header from './header/header';
import './App.css';
import User_Management from './user/User_Management';
import CartPage from './cart/CartPage';

function App() {
  
  return (
    <div className="app">
      {/* Show header on all pages except Welcome, SignIn, and SignUp */}
      {!['/', '/signin', '/signup'].includes(window.location.pathname) && <Header />}
      
      <div className="app-content">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signin" element={<Sign_in />} />
        <Route path="/signup" element={<Sign_up />} />
        <Route path="/customer" element={<Customer_home />} />
        <Route path="/addProduct" element={<Add_Product />} />
        <Route path="/deleteProduct" element={<Delete_Product />} />
        <Route path="/searchProduct" element={<Search_Product />} />
        
        <Route path="/updateProduct" element={<Update_Product />} />
        <Route path="/show-users" element={<View_User />} />
        <Route path="/productManager" element={<Product_Manager />} />
        <Route path="/showAllProducts" element={<Show_All_Product />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/delete-users" element={<Delete_User />} />
        <Route path="/userManagement" element={<User_Management />} />
        <Route path="/admin" element={<Admin_home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </div>
  );
}

export default App;
