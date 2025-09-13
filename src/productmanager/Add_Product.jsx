import React, { useState } from "react";
import "./Add_Product.css"; // Import the external CSS file

const Add_Product = ({ onToggleAuth, onProductAdded }) => {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        photo: "",
        category: "",
        reviews: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!product.name.trim()) {
            setError("Product name is required");
            return false;
        }
        
        if (!product.price || isNaN(product.price) || Number(product.price) <= 0) {
            setError("Please enter a valid price");
            return false;
        }
        
        if (!product.description.trim()) {
            setError("Description is required");
            return false;
        }
        
        if (!product.category.trim()) {
            setError("Category is required");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        const productData = {
            ...product,
            price: parseFloat(product.price),
            reviews: product.reviews 
                ? product.reviews.split(",").map(r => r.trim()).filter(r => r)
                : []
        };

        try {
            const response = await fetch('http://localhost:8080/addProduct', {
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

            setSuccess("Product added successfully!");
            setProduct({ 
                name: "", 
                price: "", 
                description: "", 
                photo: "", 
                category: "", 
                reviews: "" 
            });
            
            // Call optional callback functions if provided
            if (onToggleAuth) onToggleAuth();
            if (onProductAdded) onProductAdded();
            
        } catch (error) {
            console.error("Error adding product:", error);
            setError(error.message || "Failed to add product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <h2 className="add-product-title">Add New Product</h2>
            
            {error && (
                <div className="add-product-alert add-product-error">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="add-product-alert add-product-success">
                    {success}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="add-product-form">
                <div className="add-product-form-group">
                    <label className="add-product-label add-product-label-required">
                        Product Name:
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="add-product-input"
                    />
                </div>
                
                <div className="add-product-form-group">
                    <label className="add-product-label add-product-label-required">
                        Price:
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className="add-product-input"
                    />
                </div>
                
                <div className="add-product-form-group">
                    <label className="add-product-label add-product-label-required">
                        Description:
                    </label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="add-product-textarea"
                    />
                </div>
                
                <div className="add-product-form-group">
                    <label className="add-product-label">
                        Photo URL:
                    </label>
                    <input
                        type="url"
                        name="photo"
                        value={product.photo}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="https://example.com/image.jpg"
                        className="add-product-input"
                    />
                </div>
                
                <div className="add-product-form-group">
                    <label className="add-product-label add-product-label-required">
                        Category:
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="add-product-input"
                    />
                </div>
                
                <div className="add-product-form-group">
                    <label className="add-product-label">
                        Reviews (comma separated):
                    </label>
                    <input
                        type="text"
                        name="reviews"
                        value={product.reviews}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Great product, Fast shipping, ..."
                        className="add-product-input"
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="add-product-button"
                >
                    {isLoading ? "Adding Product..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default Add_Product;