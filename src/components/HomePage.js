import React, { useState } from "react";
import "../styles/home.css";

const localBooks = [
    {
        id: "local-1",
        title: "Java Notes",
        author: "Patrick Naughton",
        cover:
            "https://books.google.com/books/content?id=x8BvqSRbR3cC&printsec=frontcover&img=1&zoom=1",
        pdf: "https://www.iitk.ac.in/esc101/share/downloads/javanotes5.pdf",
    },
    {
        id: "local-2",
        title: "Python Basics",
        author: "Guido van Rossum",
        cover:
            "https://m.media-amazon.com/images/I/41Y6OqYqgLL._SX379_BO1,204,203,200_.jpg",
        pdf: "https://example.com/python-basics.pdf",
    },
    {
        id: "local-3",
        title: "C Programming",
        author: "Dennis Ritchie",
        cover:
            "https://m.media-amazon.com/images/I/51Zymoq7UnL._SX379_BO1,204,203,200_.jpg",
        pdf: "https://example.com/c-programming.pdf",
    },
    {
        id: "local-4",
        title: "JavaScript Guide",
        author: "Brendan Eich",
        cover: "https://m.media-amazon.com/images/I/51sZW87xHnL.jpg",
        pdf: "https://example.com/javascript-guide.pdf",
    },
    {
        id: "local-5",
        title: "React Handbook",
        author: "Dan Abramov",
        cover:
            "https://m.media-amazon.com/images/I/41CjvQX8kLL._SX379_BO1,204,203,200_.jpg",
        pdf: "https://example.com/react-handbook.pdf",
    },
];

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

            {/* Local Books */}
            <h2>Available Books</h2>
            <div className="book-grid">
                {localBooks.map((book) => (
                    <div key={book.id} className="book-card">
                        <img src={book.cover} alt={book.title} className="book-cover" />
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        {/* Removed View PDF button */}
                        <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(book)}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Online Books */}
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
                            // Add a placeholder PDF link or leave blank for online books
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
