import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function CartPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const removeFromCart = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1); // remove 1 item at index
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>

            {cart.length === 0 ? (
                <p className="cart-empty">No books in cart.</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((book, index) => (
                        <li key={index} className="cart-item">
                            <img
                                src={book.cover || "https://via.placeholder.com/80x100?text=No+Image"}
                                alt={book.title}
                                className="cart-cover"
                            />
                            <div className="cart-info">
                                <h4>{book.title}</h4>
                                <p>{book.author}</p>
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => removeFromCart(index)}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {cart.length > 0 && (
                <div className="cart-actions">
                    <button
                        onClick={() => navigate("/checkout")}
                        className="cart-button"
                    >
                        Checkout
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="home-button"
                    >
                        Back to Home
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
