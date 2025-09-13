import React, { useState } from "react";
import "./Search_Product.css";

const Search_Product = () => {
    const [productName, setProductName] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleChange = (e) => {
        setProductName(e.target.value);
    };

    const validateForm = () => {
        if (!productName.trim()) {
            setError("Product name is required");
            return false;
        }
        
        if (productName.trim().length < 2) {
            setError("Please enter at least 2 characters");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setProducts([]);
        setSearched(false);
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            // First, get all products
            const response = await fetch(`http://localhost:8080/getAllProducts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const allProducts = await response.json();
            
            // Filter products by name (case-insensitive)
            const filteredProducts = allProducts.filter(p => 
                p.name.toLowerCase().includes(productName.toLowerCase())
            );
            
            setProducts(filteredProducts);
            setSearched(true);
            
        } catch (error) {
            console.error("Error searching product:", error);
            setError("Error fetching products. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setProductName("");
        setProducts([]);
        setError("");
        setSearched(false);
    };

    return (
        <div className="search-product-container">
            <h2 className="search-product-title">Search Product by Name</h2>
            
            <form onSubmit={handleSubmit} className="search-product-form">
                <div className="search-product-form-group">
                    <label className="search-product-label search-product-label-required">
                        Product Name:
                    </label>
                    <input
                        type="text"
                        name="productName"
                        value={productName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="search-product-input"
                        placeholder="Enter product name"
                    />
                </div>
                
                <div className="search-product-button-group">
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="search-product-button search-product-button-primary"
                    >
                        {isLoading ? "Searching..." : "Search Product"}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleReset}
                        className="search-product-button search-product-button-secondary"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {error && (
                <div className="search-product-alert search-product-error">
                    {error}
                </div>
            )}

            {searched && products.length === 0 && !error && (
                <div className="search-product-alert search-product-info">
                    No products found with name containing: "{productName}"
                </div>
            )}

            {products.length > 0 && (
                <div className="search-product-result">
                    <h3 className="search-product-result-title">
                        Found {products.length} product{products.length !== 1 ? 's' : ''} matching "{productName}"
                    </h3>
                    
                    <div className="search-product-grid">
                        {products.map(product => (
                            <div key={product.id} className="search-product-card">
                                <div className="search-product-card-content">
                                    <div className="search-product-detail-row">
                                        <div className="search-product-detail-label">ID:</div>
                                        <div className="search-product-detail-value">{product.id}</div>
                                    </div>
                                    
                                    <div className="search-product-detail-row">
                                        <div className="search-product-detail-label">Name:</div>
                                        <div className="search-product-detail-value">{product.name}</div>
                                    </div>
                                    
                                    <div className="search-product-detail-row">
                                        <div className="search-product-detail-label">Description:</div>
                                        <div className="search-product-detail-value">{product.description}</div>
                                    </div>
                                    
                                    <div className="search-product-detail-row">
                                        <div className="search-product-detail-label">Price:</div>
                                        <div className="search-product-detail-value">Rs.{product.price}</div>
                                    </div>
                                    
                                    <div className="search-product-detail-row">
                                        <div className="search-product-detail-label">Category:</div>
                                        <div className="search-product-detail-value">{product.category}</div>
                                    </div>
                                    
                                    {product.photo && (
                                        <div className="search-product-detail-row">
                                            <div className="search-product-detail-label">Photo:</div>
                                            <div className="search-product-detail-value">
                                                <img 
                                                    src={product.photo} 
                                                    alt={product.name} 
                                                    className="search-product-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <div className="search-product-photo-url">
                                                    <a href={product.photo} target="_blank" rel="noopener noreferrer">
                                                        View Image
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {product.reviews && product.reviews.length > 0 && (
                                        <div className="search-product-detail-row">
                                            <div className="search-product-detail-label">Reviews:</div>
                                            <div className="search-product-detail-value">
                                                <ul className="search-product-reviews">
                                                    {product.reviews.map((review, index) => (
                                                        <li key={index} className="search-product-review-item">
                                                            {review}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
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

export default Search_Product;