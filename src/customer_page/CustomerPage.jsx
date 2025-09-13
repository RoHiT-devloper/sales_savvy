import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CustomerPage.css";
import CartIcon from "../cart/CartIcon";

const CustomerPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
    } else {
      fetchProductsFromAPI();
    }
    
    fetchCartItems();
  }, [location.state]);

  const fetchProductsFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:8080/getAllProducts');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080/api/cart/getCart?username=${username}`);
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.items || []);
        
        // Reset all quantities to 1 when loading the page
        const initialQuantities = {};
        products.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const changeQuantity = (productId, change) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(currentQty + change, 1);
      return { ...prev, [productId]: newQty };
    });
  };

// In your handleAddToCart function, add a callback for payment integration
const handleAddToCart = async (product) => {
  const username = localStorage.getItem("username");
  const qty = quantities[product.id] || 1;

  if (!username) {
    alert("Please log in to add products to your cart.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/addToCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        username: username,
        quantity: qty,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    } else {
      alert(
        `Product "${product.name}" (x${qty}) added to cart successfully!`
      );
      
      // Reset quantity to 1 after adding to cart
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
      
      fetchCartItems();
      
      // If you want to redirect to cart page after adding
      // navigate("/cart");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong while adding to cart!");
  }
};

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(item => item.product && item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return <div className="customer-container">Loading...</div>;
  }

  return (
    <div className="customer-container">
      <CartIcon /> 
      <h1 className="customer-title">Welcome Customer!</h1>

      <div className="customer-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="customer-search"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="customer-category"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="customer-summary">
        <p>
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="customer-empty">
          <p>
            No products found
            {searchTerm || selectedCategory !== "all"
              ? " matching your criteria"
              : ""}
            .
          </p>
        </div>
      ) : (
        <div className="customer-products-grid">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const total = qty * product.price;
            const cartQty = getCartQuantity(product.id);

            return (
              <div key={product.id} className="customer-card">
                <div className="customer-image">
                  {product.photo ? (
                    <img
                      src={product.photo}
                      alt={product.name}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>

                <div className="customer-details">
                  <p className="product-category">{product.category}</p>
                  <div className="product-name-price">
                    <h3>{product.name}</h3>
                    <span className="price">Rs.{product.price}</span>
                  </div>
                  <p className="product-description">{product.description}</p>

                  {cartQty > 0 && (
                    <p className="cart-quantity-info">
                      Already in cart: {cartQty}
                    </p>
                  )}

                  <div className="customer-quantity">
                    <button onClick={() => changeQuantity(product.id, -1)}>
                      -
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => changeQuantity(product.id, 1)}>
                      +
                    </button>
                  </div>

                  <p className="product-total">Total: Rs.{total}</p>
                </div>

                <button
                  className="customer-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  {cartQty > 0 ? 'Update Cart' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerPage;