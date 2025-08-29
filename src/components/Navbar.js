import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <NavLink to="/" className="logo" onClick={closeMenu}>
        BookStore
      </NavLink>

      {/* Mobile toggle button */}
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
        <div className={`bar ${isOpen ? "open" : ""}`}></div>
      </div>

      {/* Navigation links */}
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <NavLink 
          to="/" 
          onClick={closeMenu} 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Home
        </NavLink>

        {/* Cart with badge */}
        <NavLink 
          to="/cart" 
          onClick={closeMenu} 
          className={({ isActive }) => `cart-link ${isActive ? "active-link" : ""}`}
        >
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>

        <NavLink 
          to="/checkout" 
          onClick={closeMenu} 
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Checkout
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;


