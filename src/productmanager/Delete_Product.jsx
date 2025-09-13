import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Delete_Product.css";

const Delete_Product = () => {
    const [productId, setProductId] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [error, setError] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const navigate = useNavigate();

    // Fetch all products on component mount
    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/getAllProducts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const productsData = await response.json();
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products. Please try again.");
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const handleChange = (e) => {
        setProductId(e.target.value);
        // Find the selected product for confirmation
        const product = products.find(p => p.id === parseInt(e.target.value));
        setSelectedProduct(product || null);
    };

    const handleProductSelect = (product) => {
        setProductId(product.id.toString());
        setSelectedProduct(product);
    };

    const validateForm = () => {
        if (!productId.trim()) {
            setError("Please select a product or enter a Product ID");
            return false;
        }
        
        if (isNaN(productId) || Number(productId) <= 0) {
            setError("Please enter a valid Product ID");
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        // Show confirmation popup
        setShowConfirmPopup(true);
    };

    const confirmDelete = async () => {
        setShowConfirmPopup(false);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/deleteProduct?id=${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server returned ${response.status}`);
            }

            const result = await response.text();
            setSuccessMessage(result || "Product deleted successfully!");
            setShowSuccessPopup(true);
            
            // Refresh the products list
            fetchAllProducts();
            
        } catch (error) {
            console.error("Error deleting product:", error);
            setError(error.message || "Failed to delete product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDelete = () => {
        setShowConfirmPopup(false);
    };

    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        setProductId("");
        setSelectedProduct(null);
    };

    const handleRefreshProducts = () => {
        setIsLoadingProducts(true);
        setError("");
        fetchAllProducts();
    };

    return (
        <div className="delete-product-container">
            <h2 className="delete-product-title">Delete Product</h2>
            
            {/* Products List Section */}
            <div className="products-list-section">
                <div className="section-header">
                    <h3>Available Products</h3>
                    <button 
                        onClick={handleRefreshProducts} 
                        disabled={isLoadingProducts}
                        className="refresh-btn"
                    >
                        {isLoadingProducts ? "Refreshing..." : "🔄 Refresh"}
                    </button>
                </div>

                {isLoadingProducts ? (
                    <div className="loading-products">
                        <div className="spinner-small"></div>
                        <p>Loading products...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <p>No products found in the system.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <div 
                                key={product.id} 
                                className={`product-card ${productId === product.id.toString() ? 'selected' : ''}`}
                                onClick={() => handleProductSelect(product)}
                            >
                                <div className="product-info">
                                    <span className="product-id">ID: {product.id}</span>
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-price">${product.price}</span>
                                    <span className="product-category">{product.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="delete-product-alert delete-product-error">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="delete-product-form">
                <div className="delete-product-form-group">
                    <label className="delete-product-label delete-product-label-required">
                        Product ID to Delete:
                    </label>
                    <input
                        type="number"
                        name="productId"
                        value={productId}
                        onChange={handleChange}
                        disabled={isLoading}
                        min="1"
                        className="delete-product-input"
                        placeholder="Enter product ID or select from list above"
                    />
                    {selectedProduct && (
                        <div className="selected-product-preview">
                            <strong>Selected Product:</strong> {selectedProduct.name} 
                            (${selectedProduct.price}) - {selectedProduct.category}
                        </div>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading || !productId}
                    className="delete-product-button"
                >
                    {isLoading ? "Deleting Product..." : "Delete Product"}
                </button>
            </form>

            {/* Confirmation Popup */}
            {showConfirmPopup && selectedProduct && (
                <div className="delete-product-popup-overlay">
                    <div className="delete-product-popup">
                        <div className="delete-product-popup-content">
                            <h3>Confirm Deletion</h3>
                            <p>Are you sure you want to delete this product?</p>
                            <div className="product-delete-details">
                                <p><strong>ID:</strong> {selectedProduct.id}</p>
                                <p><strong>Name:</strong> {selectedProduct.name}</p>
                                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                                <p><strong>Category:</strong> {selectedProduct.category}</p>
                            </div>
                            <p className="warning-text">
                                This action cannot be undone. The product will be permanently deleted.
                            </p>
                            <div className="popup-actions">
                                <button 
                                    onClick={confirmDelete}
                                    className="delete-product-popup-button confirm-btn"
                                >
                                    Yes, Delete Product
                                </button>
                                <button 
                                    onClick={handleCancelDelete}
                                    className="delete-product-popup-button cancel-btn"
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
                <div className="delete-product-popup-overlay">
                    <div className="delete-product-popup">
                        <div className="delete-product-popup-content">
                            <h3>Success!</h3>
                            <p>{successMessage}</p>
                            <button 
                                onClick={handlePopupOk}
                                className="delete-product-popup-button"
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
                    Deleting a product is a permanent action. The product will be 
                    removed from the system and cannot be recovered. Please double-check 
                    the product information before proceeding.
                </p>
            </div>
        </div>
    );
};

export default Delete_Product;