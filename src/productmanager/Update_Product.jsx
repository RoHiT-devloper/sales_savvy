import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Update_Product.css";

const Update_Product = () => {
    const [productId, setProductId] = useState("");
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        price: "",
        photo: "",
        category: "",
        reviews: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
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

    const handleIdChange = (e) => {
        setProductId(e.target.value);
        setError("");
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleProductSelect = (product) => {
        setProductId(product.id.toString());
        // Load the product immediately when selected
        loadProduct(product.id.toString());
    };

    const validateId = (id) => {
        if (!id.trim()) {
            setError("Product ID is required");
            return false;
        }
        
        if (isNaN(id) || Number(id) <= 0) {
            setError("Please enter a valid Product ID");
            return false;
        }
        
        return true;
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Product name is required");
            return false;
        }
        
        if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
            setError("Please enter a valid price");
            return false;
        }
        
        if (!formData.description.trim()) {
            setError("Description is required");
            return false;
        }
        
        if (!formData.category.trim()) {
            setError("Category is required");
            return false;
        }
        
        return true;
    };

    const loadProduct = async (id) => {
        setError("");
        
        if (!validateId(id)) return;
        
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/searchProduct?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Product not found");
                }
                throw new Error(`Server returned ${response.status}`);
            }

            const productData = await response.json();
            
            if (!productData || !productData.id) {
                throw new Error("Invalid product data received");
            }
            
            setProduct(productData);
            
            // Pre-fill the form with existing data
            setFormData({
                id: productData.id,
                name: productData.name || "",
                description: productData.description || "",
                price: productData.price || "",
                photo: productData.photo || "",
                category: productData.category || "",
                reviews: productData.reviews ? productData.reviews.join(", ") : ""
            });
            
        } catch (error) {
            console.error("Error searching product:", error);
            setError(error.message || "Product not found or error fetching product details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        loadProduct(productId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsUpdating(true);

        const productData = {
            id: formData.id,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            photo: formData.photo,
            category: formData.category,
            reviews: formData.reviews ? formData.reviews.split(",").map(r => r.trim()).filter(r => r) : []
        };

        try {
            const response = await fetch('http://localhost:8080/updateProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Server returned ${response.status}`);
            }

            const result = await response.text();
            setSuccessMessage(result || "Product updated successfully!");
            setShowSuccessPopup(true);
            
            // Refresh the products list
            fetchAllProducts();
            
        } catch (error) {
            console.error("Error updating product:", error);
            setError(error.message || "Failed to update product. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePopupOk = () => {
        setShowSuccessPopup(false);
        navigate("/updateProduct");
    };

    const handleReset = () => {
        setProductId("");
        setProduct(null);
        setFormData({
            id: "",
            name: "",
            description: "",
            price: "",
            photo: "",
            category: "",
            reviews: ""
        });
        setError("");
    };

    const handleRefreshProducts = () => {
        setIsLoadingProducts(true);
        setError("");
        fetchAllProducts();
    };

    return (
        <div className="update-product-container">
            <h2 className="update-product-title">Update Product</h2>
            
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
                <div className="update-product-alert update-product-error">
                    {error}
                </div>
            )}
            
            {!product ? (
                <>
                    <form onSubmit={handleSearch} className="update-product-form">
                        <div className="update-product-form-group">
                            <label className="update-product-label update-product-label-required">
                                Enter Product ID to Update:
                            </label>
                            <input
                                type="number"
                                name="productId"
                                value={productId}
                                onChange={handleIdChange}
                                disabled={isLoading}
                                min="1"
                                className="update-product-input"
                                placeholder="Enter product ID or select from list above"
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="update-product-button update-product-button-primary"
                        >
                            {isLoading ? "Loading..." : "Load Product"}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <div className="update-product-loaded-info">
                        <p>Editing Product ID: <strong>{product.id}</strong></p>
                        <button 
                            onClick={handleReset}
                            className="update-product-button update-product-button-secondary"
                        >
                            Load Different Product
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="update-product-form">
                        <div className="update-product-form-group">
                            <label className="update-product-label update-product-label-required">
                                Product Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                className="update-product-input"
                                required
                            />
                        </div>
                        
                        <div className="update-product-form-group">
                            <label className="update-product-label update-product-label-required">
                                Price:
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                min="0"
                                step="0.01"
                                className="update-product-input"
                                required
                            />
                        </div>
                        
                        <div className="update-product-form-group">
                            <label className="update-product-label update-product-label-required">
                                Description:
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                className="update-product-textarea"
                                required
                            />
                        </div>
                        
                        <div className="update-product-form-group">
                            <label className="update-product-label">
                                Photo URL:
                            </label>
                            <input
                                type="url"
                                name="photo"
                                value={formData.photo}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                className="update-product-input"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        
                        <div className="update-product-form-group">
                            <label className="update-product-label update-product-label-required">
                                Category:
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                className="update-product-input"
                                required
                            />
                        </div>
                        
                        <div className="update-product-form-group">
                            <label className="update-product-label">
                                Reviews (comma separated):
                            </label>
                            <input
                                type="text"
                                name="reviews"
                                value={formData.reviews}
                                onChange={handleFormChange}
                                disabled={isUpdating}
                                className="update-product-input"
                                placeholder="Great product, Fast shipping, ..."
                            />
                        </div>
                        
                        <div className="update-product-button-group">
                            <button 
                                type="submit" 
                                disabled={isUpdating}
                                className="update-product-button update-product-button-primary"
                            >
                                {isUpdating ? "Updating..." : "Update Product"}
                            </button>
                            
                            <button 
                                type="button" 
                                onClick={handleReset}
                                className="update-product-button update-product-button-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="update-product-popup-overlay">
                    <div className="update-product-popup">
                        <div className="update-product-popup-content">
                            <h3>Success!</h3>
                            <p>{successMessage}</p>
                            <button 
                                onClick={handlePopupOk}
                                className="update-product-popup-button"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Update_Product;