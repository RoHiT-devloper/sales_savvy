import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartIcon.css";

const CartIcon = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItemCount = async () => {
      const username = localStorage.getItem("username");
      if (!username) return;

      try {
        const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
        if (response.ok) {
          const cartData = await response.json();
          const count = cartData.items ? cartData.items.length : 0;
          setCartItemCount(count);
        }
      } catch (error) {
        console.error('Error fetching cart item count:', error);
      }
    };

    fetchCartItemCount();
    
    // Refresh cart count every 10 seconds
    const interval = setInterval(fetchCartItemCount, 10000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only on mount and unmount

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <div className="cart-icon-container" onClick={handleCartClick}>
      <svg className="cart-icon" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      {cartItemCount > 0 && (
        <span className="cart-count">{cartItemCount}</span>
      )}
    </div>
  );
};

export default CartIcon;