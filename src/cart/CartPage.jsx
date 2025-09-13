import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      alert("Please log in to view your cart.");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.items || []);
        setTotalPrice(cartData.totalPrice || 0);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove?productId=${productId}&username=${username}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCartItems();
        alert("Item removed from cart!");
      } else {
        const errorText = await response.text();
        alert(errorText || "Failed to remove item from cart.");
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert("Something went wrong while removing the item.");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const response = await fetch("http://localhost:8080/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          username: username,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        fetchCartItems();
      } else {
        const errorText = await response.text();
        alert(errorText || "Failed to update quantity.");
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert("Something went wrong while updating quantity.");
    }
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout! Total amount: Rs." + totalPrice);
  };

  if (loading) {
    return <div className="cart-container">Loading your cart...</div>;
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/customer")} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="item-image">
                  {item.product.photo ? (
                    <img src={item.product.photo} alt={item.product.name} />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product.name}</h3>
                  <p className="item-category">{item.product.category}</p>
                  <p className="item-price">Rs.{item.product.price} each</p>
                  <p className="item-description">{item.product.description}</p>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}>
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  
                  <p className="item-total">Rs.{item.itemTotal}</p>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-details">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rs.{totalPrice}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Rs.{(totalPrice > 0 ? 50 : 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rs.{(totalPrice > 0 ? totalPrice + 50 : 0)}</span>
              </div>
              
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              
              <button onClick={() => navigate("/customer")} className="continue-shopping-btn">
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;