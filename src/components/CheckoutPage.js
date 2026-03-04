import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [confirmationList, setConfirmationList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const fetchGoogleBookLink = async (title) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`
      );
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].volumeInfo.infoLink;
      }
      return null;
    } catch (err) {
      console.error("Error fetching Google Books link:", err);
      return null;
    }
  };

  const handleCheckout = async () => {
    if (!email) {
      setStatus({ message: "Please enter your email address.", type: "error" });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus({ message: "Please enter a valid email address.", type: "error" });
      return;
    }
    if (cart.length === 0) {
      setStatus({ message: "Your cart is empty. Add some books first.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "Preparing your books…", type: "" });

    const confirmationData = await Promise.all(
      cart.map(async (b) => {
        if (b.pdf) {
          return { title: b.title, author: b.author, cover: b.cover, pdfLink: b.pdf, googleLink: null };
        } else {
          const googleLink = await fetchGoogleBookLink(b.title);
          return { title: b.title, author: b.author, cover: b.cover, pdfLink: null, googleLink };
        }
      })
    );

    setConfirmationList(confirmationData);
    setLoading(false);

    const hasUnavailable = confirmationData.some((b) => !b.pdfLink);
    if (hasUnavailable) {
      setShowConfirm(true);
      setStatus({ message: "", type: "" });
    } else {
      sendEmail(confirmationData);
    }
  };

  const sendEmail = (bookList) => {
    setLoading(true);
    const downloadLinks = bookList.map((b) =>
      b.pdfLink
        ? `${b.title}: ${b.pdfLink}`
        : `${b.title}: ${b.googleLink || "No link available"}`
    );

    emailjs
      .send(
        "service_zxeryon",
        "template_m5k5p8s",
        {
          to_email: email,
          books: bookList.map((b) => b.title).join(", "),
          download_link: downloadLinks.join("\n"),
        },
        "3XYNWB0B3lELZA4_a"
      )
      .then(
        () => {
          setStatus({
            message: "✓ Email sent successfully! Check your inbox for your book links.",
            type: "success",
          });
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));
          setShowConfirm(false);
          setLoading(false);
        },
        (err) => {
          setStatus({ message: `Failed to send email: ${err.text}`, type: "error" });
          setLoading(false);
        }
      );
  };

  const handleConfirmYes = () => sendEmail(confirmationList);
  const handleConfirmNo = () => {
    setShowConfirm(false);
    setStatus({ message: "Order cancelled. You can refine your cart and try again.", type: "error" });
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="page-heading">Checkout</h1>
        <p className="page-subheading">
          We'll send your book links directly to your email
        </p>
        <div className="divider"></div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p className="order-empty">No books in cart</p>
          ) : (
            cart.map((book, i) => (
              <div key={i} className="order-item">
                {book.cover ? (
                  <img src={book.cover} alt={book.title} className="order-item-thumb" />
                ) : (
                  <div className="order-item-thumb-placeholder">📚</div>
                )}
                <div>
                  <div className="order-item-title">{book.title}</div>
                  <div className="order-item-author">{book.author}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <div className="checkout-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Delivery Email
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleCheckout()}
              disabled={loading}
            />
          </div>
          <button
            className="confirm-btn"
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
          >
            {loading && <span className="btn-spinner"></span>}
            {loading ? "Processing…" : "Confirm Order & Send Email"}
          </button>
        </div>

        {/* Status */}
        {status.message && (
          <div className={`checkout-status ${status.type}`}>
            {status.message}
          </div>
        )}

        {/* Confirmation dialog */}
        {showConfirm && (
          <div className="confirmation-dialog">
            <h3>Some previews are limited</h3>
            <ul>
              {confirmationList.map((b, i) => (
                <li key={i}>
                  <span>
                    {b.pdfLink ? "✓" : "⚠"} {b.title}
                  </span>
                  {!b.pdfLink && b.googleLink && (
                    <a href={b.googleLink} target="_blank" rel="noreferrer">
                      View on Google Books ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p>
              Some books don't have direct PDF links. We can still send Google Books preview links for those titles — would you like to proceed?
            </p>
            <div className="confirm-actions">
              <button className="btn-yes" onClick={handleConfirmYes} disabled={loading}>
                {loading ? "Sending…" : "Yes, Send Email"}
              </button>
              <button className="btn-no" onClick={handleConfirmNo} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="checkout-navigation">
          <button className="nav-btn" onClick={() => navigate("/")}>
            ← Back to Discover
          </button>
          <button className="nav-btn" onClick={() => navigate("/cart")}>
            ← Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
