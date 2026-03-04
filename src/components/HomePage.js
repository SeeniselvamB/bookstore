import React, { useCallback, useRef, useState } from "react";
import "../styles/home.css";

function HomePage({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  addedIds,
  setAddedIds,
}) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, title: "" });
  const toastTimer = useRef(null);

  const showToast = (title) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, title });
    toastTimer.current = setTimeout(
      () => setToast({ visible: false, title: "" }),
      3000
    );
  };

  const searchBooks = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=20`
      );
      const data = await res.json();
      setSearchResults(data.items || []);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, setSearchResults]);

  // Clear results only when input is fully emptied
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === "") {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") searchBooks();
  };

  const addToCart = (bookData) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    storedCart.push(bookData);
    localStorage.setItem("cart", JSON.stringify(storedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedIds((prev) => new Set([...prev, bookData.id]));
    showToast(bookData.title);
  };

  const showResults = searchResults.length > 0 || loading;

  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero">
        {/* <div className="hero-eyebrow">Curated Digital Library</div> */}
        <h1>
          Discover your next
          <br />
          <span>great read</span>
        </h1>
        <p>
          Search millions of books, preview chapters, and have download links
          delivered straight to your inbox.
        </p>

        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Title, author, or subject…"
            aria-label="Search books"
          />
          <button onClick={searchBooks} disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </section>

      {/* Results */}
      {showResults && (
        <section className="books-section">
          <div className="section-header">
            <h2>Results</h2>
            {searchResults.length > 0 && (
              <span className="result-count">
                {searchResults.length} books found
              </span>
            )}
          </div>

          <div className="book-grid">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                Searching the library…
              </div>
            ) : (
              searchResults.map((book) => {
                const info = book.volumeInfo || {};
                const bookData = {
                  id: book.id,
                  title: info.title || "Untitled",
                  author: info.authors?.join(", ") || "Unknown Author",
                  cover: info.imageLinks?.thumbnail || "",
                  pdf: info.previewLink || "",
                };
                const isAdded = addedIds.has(bookData.id);
                return (
                  <div key={book.id} className="book-card">
                    <div className="book-cover-wrap">
                      {bookData.cover ? (
                        <img
                          src={bookData.cover}
                          alt={bookData.title}
                          className="book-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="book-cover-placeholder">📚</div>
                      )}
                    </div>
                    <div className="book-card-body">
                      <h3>{bookData.title}</h3>
                      <p>{bookData.author}</p>
                      <button
                        className={`add-to-cart-btn${isAdded ? " added" : ""}`}
                        onClick={() => !isAdded && addToCart(bookData)}
                      >
                        {isAdded ? "✓ Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Initial empty state */}
      {!loading && searchResults.length === 0 && searchQuery === "" && (
        <section className="books-section">
          <div className="book-grid">
            <div className="no-books">
              <span className="no-books-icon">📖</span>
              <p>Begin your search above</p>
              <span>Explore millions of titles from Google Books</span>
            </div>
          </div>
        </section>
      )}

      {/* Toast */}
      <div className={`toast${toast.visible ? " show" : ""}`}>
        <strong>Added to cart</strong>
        {toast.title}
      </div>
    </div>
  );
}

export default HomePage;
