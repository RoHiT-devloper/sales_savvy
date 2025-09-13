import React, { useState, useEffect } from "react";
import "./Show_All_Product.css";

const Show_All_Product = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const productsData = await response.json();
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredProducts(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleRetry = () => {
        setIsLoading(true);
        setError("");
        fetchProducts();
    };

    // Get unique categories for filter dropdown
    const categories = ["all", ...new Set(products.map(product => product.category).filter(Boolean))];

    if (isLoading) {
        return (
            <div className="products-container">
                <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-container">
                <div className="products-error">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h1 className="products-title">All Products</h1>
            
            <div className="products-controls">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
                
                <div className="filter-box">
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="category-filter"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === "all" ? "All Categories" : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="products-summary">
                <p>Showing {filteredProducts.length} of {products.length} products</p>
            </div>

           {filteredProducts.length === 0 ? (
  <div className="products-empty">
    <p>No products found{searchTerm || selectedCategory !== "all" ? " matching your criteria" : ""}.</p>
  </div>
) : (
  // NEW WRAPPER ADDED
  <div className="products-contains">
    <div className="products-grids">
      {filteredProducts.map(product => (
        <div key={product.id} className="product-card">
          {product.photo ? (
            <div className="product-image">
              <img 
                src={product.photo} 
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            </div>
          ) : (
            <div className="product-image">
              <div className="image-placeholder">No Image</div>
            </div>
          )}

          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            
            {product.reviews && product.reviews.length > 0 && (
              <div className="product-reviews">
                <h4>Reviews ({product.reviews.length})</h4>
                <ul>
                  {product.reviews.slice(0, 2).map((review, index) => (
                    <li key={index} className="review-item">
                      "{review}"
                    </li>
                  ))}
                  {product.reviews.length > 2 && (
                    <li className="review-more">
                      +{product.reviews.length - 2} more reviews
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
    );
};

export default Show_All_Product;