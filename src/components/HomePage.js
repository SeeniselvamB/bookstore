import React, { useState } from "react";
import "../styles/home.css";

function HomePage() {
    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);

    const searchBooks = async () => {
        if (!query) return;
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${query}`
        );
        const data = await res.json();
        setBooks(data.items || []);
    };

    const addToCart = (book) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        storedCart.push(book);
        localStorage.setItem("cart", JSON.stringify(storedCart));
        alert(`${book.title} added to cart!`);
    };

    return (
        <div className="home-container">
            <h2>Online Books</h2>
            <div className="search-bar">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search books..."
                />
                <button onClick={searchBooks}>Search</button>
            </div>

            <div className="book-grid">
                {books.length > 0 ? (
                    books.map((book) => {
                        const bookData = {
                            id: book.id,
                            title: book.volumeInfo.title,
                            author: book.volumeInfo.authors?.join(", ") || "Unknown",
                            cover: book.volumeInfo.imageLinks?.thumbnail || "",
                            pdf: book.volumeInfo.previewLink || "",
                        };
                        return (
                            <div key={book.id} className="book-card">
                                {bookData.cover && (
                                    <img
                                        src={bookData.cover}
                                        alt={bookData.title}
                                        className="book-cover"
                                    />
                                )}
                                <h3>{bookData.title}</h3>
                                <p>{bookData.author}</p>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(bookData)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-books">Try searching!</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;





