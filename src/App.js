import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";

function App() {
  // Cart count — reactive via custom event
  const [cartCount, setCartCount] = useState(
    () => (JSON.parse(localStorage.getItem("cart")) || []).length
  );

  // Search state lifted here so it survives page navigation
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());

  const refreshCartCount = useCallback(() => {
    const count = (JSON.parse(localStorage.getItem("cart")) || []).length;
    setCartCount(count);
  }, []);

  useEffect(() => {
    window.addEventListener("cartUpdated", refreshCartCount);
    return () => window.removeEventListener("cartUpdated", refreshCartCount);
  }, [refreshCartCount]);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              addedIds={addedIds}
              setAddedIds={setAddedIds}
            />
          }
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
