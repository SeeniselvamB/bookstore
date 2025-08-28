import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => [...prev, book]);
  };

  return (
    <Router>
      <Navbar cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
      </Routes>
    </Router>
  );
}

export default App;
