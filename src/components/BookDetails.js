import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookDetails.css";

function BookDetails({ addedIds, setAddedIds }) {
    const navigate = useNavigate();
    const location = useLocation();
    const book = location.state?.book;
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);
    // If user refreshes the page or navigates directly without state
    if (!book) {
        return (
            <div className="book-details-page">
                <div className="book-not-found">
                    <div className="book-not-found-icon">📕</div>
                    <h2>Book Not Found</h2>
                    <p>The requested book information is unavailable.</p>
                    <button className="back-btn" onClick={() => navigate("/")}>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const info = book.volumeInfo || {};
    const access = book.accessInfo || {};
    const pdfDownload = access.pdf?.downloadLink ?? null;
    const bookData = {
        id: book.id,
        title: info.title || "Untitled",
        author: info.authors?.join(", ") || "Unknown Author",
        cover:
            info.imageLinks?.thumbnail ||
            info.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/300x450?text=No+Cover",
        preview: info.previewLink || "",

        pdfDownload: access.pdf?.downloadLink || "",
    };

    const isbn10 =
        info.industryIdentifiers?.find((id) => id.type === "ISBN_10")
            ?.identifier || "Not Available";
    const isbn13 =
        info.industryIdentifiers?.find((id) => id.type === "ISBN_13")
            ?.identifier || "Not Available";

    const isPreviewAvailable = access.viewability
        ? access.viewability !== "NO_PAGES"
        : Boolean(info.previewLink);
    const isEpubAvailable = Boolean(access.epub?.isAvailable);

    const estimatedReadingTime = info.pageCount
        ? `${Math.max(1, Math.ceil(info.pageCount / 30))} hr${Math.ceil(info.pageCount / 30) > 1 ? "s" : ""
        }`
        : "Unknown";

    const roundedRating = Math.round(info.averageRating || 0);

    const isAdded = addedIds?.has(book.id);

    const addToCart = () => {
        if (isAdded) return;

        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

        const alreadyExists = storedCart.some((item) => item.id === bookData.id);
        if (alreadyExists) {
            setAddedIds((prev) => new Set([...prev, book.id]));
            return;
        }

        storedCart.push(bookData);
        localStorage.setItem("cart", JSON.stringify(storedCart));

        window.dispatchEvent(new Event("cartUpdated"));

        setAddedIds((prev) => new Set([...prev, book.id]));
    };

   
    const handlePreview = () => {
        if (!bookData.preview) return;

        window.open(
            bookData.preview,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="book-details-page">
            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                Back
            </button>

            {/* Main Card */}
            <div className="details-card">
                {/* LEFT */}
                <div className="details-left">
                    <div className="details-cover-wrap">
                        <img
                            src={bookData.cover}
                            alt={bookData.title}
                            className="details-cover"
                        />
                    </div>

                    <button
                        className="preview-btn"
                        onClick={handlePreview}
                        disabled={!bookData.preview}
                    >
                        Read Preview
                    </button>
                    {pdfDownload ? (
                        <button
                            className="download-btn"
                            onClick={() => window.open(pdfDownload, "_blank")}
                        >
                            Download PDF
                        </button>
                    ) : (
                        <button className="download-btn disabled" disabled>
                            PDF Not Available
                        </button>
                    )}
                    <button
                        className={`add-cart-btn${isAdded ? " added" : ""}`}
                        onClick={addToCart}
                        disabled={isAdded}
                    >
                        {isAdded ? "Added to Cart" : "Add to Cart"}
                    </button>
                </div>

                {/* RIGHT */}
                <div className="details-right">
                    <h1 className="book-title">{bookData.title}</h1>
                    <h3 className="book-author">{bookData.author}</h3>

                    {/* Rating */}
                    <div className="rating-row">
                        <span className="rating-stars">
                            {"★".repeat(roundedRating)}
                            {"☆".repeat(5 - roundedRating)}
                        </span>
                        <span className="rating-text">
                            {info.averageRating ? info.averageRating.toFixed(1) : "No Rating"}
                            {info.ratingsCount ? ` (${info.ratingsCount} Reviews)` : ""}
                        </span>
                    </div>

                    {/* Information Grid */}
                    <div className="info-grid">
                        <div className="info-card">
                            <span>Publisher</span>
                            <p>{info.publisher || "Not Available"}</p>
                        </div>

                        <div className="info-card">
                            <span>Published</span>
                            <p>{info.publishedDate || "Not Available"}</p>
                        </div>

                        <div className="info-card">
                            <span>Language</span>
                            <p>{(info.language || "N/A").toUpperCase()}</p>
                        </div>

                        <div className="info-card">
                            <span>Pages</span>
                            <p>{info.pageCount || "Unknown"}</p>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="categories-section">
                        <h2>Categories</h2>
                        <div className="categories">
                            {info.categories && info.categories.length > 0 ? (
                                info.categories.map((cat, index) => (
                                    <span key={index} className="category-chip">
                                        {cat}
                                    </span>
                                ))
                            ) : (
                                <span className="category-chip">General</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="description-section">
                        <h2>Description</h2>
                        <div
                            className="book-description"
                            dangerouslySetInnerHTML={{
                                __html:
                                    info.description ||
                                    "No description available for this book.",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Book Information */}
            <div className="extra-section">
                <h2>Book Information</h2>

                <div className="info-grid">
                    <div className="info-card">
                        <span>ISBN-10</span>
                        <p>{isbn10}</p>
                    </div>

                    <div className="info-card">
                        <span>ISBN-13</span>
                        <p>{isbn13}</p>
                    </div>

                    <div className="info-card">
                        <span>Preview</span>
                        <p>{isPreviewAvailable ? "Available" : "Not Available"}</p>
                    </div>

                    <div className="info-card">
                        <span>PDF</span>
                        <p>{pdfDownload ? "Download Available" : "Download Not Available"}</p>
                    </div>

                    <div className="info-card">
                        <span>EPUB</span>
                        <p>{isEpubAvailable ? "Available" : "Not Available"}</p>
                    </div>

                    <div className="info-card">
                        <span>Reading Time</span>
                        <p>{estimatedReadingTime}</p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-section">
                <div className="stat-box">
                    <h3>{info.pageCount || "--"}</h3>
                    <span>Pages</span>
                </div>

                <div className="stat-box">
                    <h3>{info.averageRating ? info.averageRating.toFixed(1) : "--"}</h3>
                    <span>Rating</span>
                </div>

                <div className="stat-box">
                    <h3>{info.ratingsCount || "--"}</h3>
                    <span>Reviews</span>
                </div>
            </div>
        </div>
    );
}

export default BookDetails;