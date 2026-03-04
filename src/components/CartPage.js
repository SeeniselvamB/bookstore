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
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="cart">
      <div className="cart-container">
        <h1 className="page-heading">Your Cart</h1>
        <p className="page-subheading">
          {cart.length === 0
            ? "Your reading list is empty"
            : `${cart.length} book${cart.length !== 1 ? "s" : ""} ready for checkout`}
        </p>
        <div className="divider"></div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Nothing here yet</p>
            <span>Search for books and add them to your cart</span>
            <br /><br />
            <button className="btn-browse" onClick={() => navigate("/")}>
              Browse Books
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((book, index) => (
                <li key={index} className="cart-item">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="cart-cover"
                    />
                  ) : (
                    <div className="cart-cover-placeholder">📚</div>
                  )}
                  <div className="cart-info">
                    <div className="cart-item-number">Vol. {String(index + 1).padStart(2, "0")}</div>
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(index)}
                    aria-label={`Remove ${book.title}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <div className="cart-summary">
                <strong>{cart.length}</strong> title{cart.length !== 1 ? "s" : ""} selected
              </div>
              <div className="cart-actions">
                <button className="home-button" onClick={() => navigate("/")}>
                  ← Keep Browsing
                </button>
                <button className="cart-button" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
