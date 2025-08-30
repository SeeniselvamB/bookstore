import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../styles/checkout.css";

function CheckoutPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [confirmationList, setConfirmationList] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

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
        } catch (error) {
            console.error("Error fetching Google Books link:", error);
            return null;
        }
    };

    const handleCheckout = async () => {
        if (!email) {
            setStatus("⚠️ Please enter your email");
            return;
        }

        if (cart.length === 0) {
            setStatus("⚠️ Your cart is empty");
            return;
        }

        setStatus("⏳ Preparing your books...");

        
        const confirmationData = await Promise.all(
            cart.map(async (b) => {
                if (b.pdf) {
                    return { title: b.title, pdfLink: b.pdf, googleLink: null };
                } else {
                    const googleLink = await fetchGoogleBookLink(b.title);
                    return { title: b.title, pdfLink: null, googleLink };
                }
            })
        );

        setConfirmationList(confirmationData);

        const hasUnavailable = confirmationData.some((b) => !b.pdfLink);
        if (hasUnavailable) {
            setShowConfirm(true);
        } else {
            sendEmail(confirmationData);
        }
    };

    const sendEmail = (bookList) => {
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
                    download_link: downloadLinks.join("\n")
                },
                "3XYNWB0B3lELZA4_a" 
            )
            .then(
                () => {
                    setStatus("✅ Email sent successfully! Check your inbox.");
                    localStorage.removeItem("cart"); 
                    setShowConfirm(false);
                },
                (err) => setStatus("❌ Error sending email: " + err.text)
            );
    };

    const handleConfirmYes = () => {
        sendEmail(confirmationList);
    };

    const handleConfirmNo = () => {
        setShowConfirm(false);
        setStatus("❌ Order cancelled. You can try again.");
    };

    return (
        <div className="checkout">
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-form">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleCheckout}>Confirm Order</button>
            </div>

            {status && <p className="checkout-status">{status}</p>}

            {showConfirm && (
                <div className="confirmation-dialog">
                    <h3>Some PDFs are not available</h3>
                    <ul>
                        {confirmationList.map((b, i) => (
                            <li key={i}>
                                {b.title}:{" "}
                                {b.pdfLink ? (
                                    <span>✅ PDF available</span>
                                ) : (
                                    <a href={b.googleLink} target="_blank" rel="noreferrer">
                                        ❌ PDF not available – View on Google Books
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                    <p>Do you want to send Google Books links for unavailable PDFs?</p>
                    <button onClick={handleConfirmYes}>Yes, send email</button>
                    <button onClick={handleConfirmNo}>No, cancel</button>
                </div>
            )}
            <div className="checkout-navigation">
                <button onClick={() => (window.location.href = "/")}>Back to Home</button>
                <button onClick={() => (window.location.href = "/cart")}>Back to Cart</button>
            </div>
        </div>
        </div>
    );
}

export default CheckoutPage;
