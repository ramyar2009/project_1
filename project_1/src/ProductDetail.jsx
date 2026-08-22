import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "./Cart";
import { getProductById, getReviewsByProductId } from "./data";
import "./ProductDetail.css";

// data.js is the mock source for now — swap these two calls for real
// API requests once the backend is ready, keeping the same return shape
async function fetchProductById(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getProductById(id);
}

async function fetchReviewsByProductId(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getReviewsByProductId(id);
}

function formatPrice(value) {
  return "$" + new Intl.NumberFormat("en-US").format(value);
}

// The grid is 4 cards wide. On page 0 the first slot is the "write a
// review" card, so page 0 holds 3 reviews and every page after that
// holds 4.
const REVIEWS_ON_FIRST_PAGE = 3;
const REVIEWS_PER_PAGE = 4;

function getTotalReviewPages(reviewCount) {
  if (reviewCount <= REVIEWS_ON_FIRST_PAGE) return 1;
  const remaining = reviewCount - REVIEWS_ON_FIRST_PAGE;
  return 1 + Math.ceil(remaining / REVIEWS_PER_PAGE);
}

function getReviewsForPage(reviews, page) {
  if (page === 0) return reviews.slice(0, REVIEWS_ON_FIRST_PAGE);
  const start =
    REVIEWS_ON_FIRST_PAGE + (page - 1) * REVIEWS_PER_PAGE;
  return reviews.slice(start, start + REVIEWS_PER_PAGE);
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isPriceBarStuck, setIsPriceBarStuck] = useState(false);

  const priceBarSentinelRef = useRef(null);
  const priceBarEndRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    fetchProductById(productId).then((data) => {
      if (!isCancelled) setProduct(data);
    });
    fetchReviewsByProductId(productId).then((data) => {
      if (!isCancelled) setReviews(data);
    });

    return () => {
      isCancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    setReviewPage(0);
  }, [productId]);

  // price bar sticks to the top while scrolling through the page, and
  // stops being sticky once the page reaches its end (near reviews/footer)
  useEffect(() => {
    const topSentinel = priceBarSentinelRef.current;
    const endSentinel = priceBarEndRef.current;
    if (!topSentinel || !endSentinel) return;

    let pastTop = false;
    let pastEnd = false;

    const updateStuckState = () => {
      setIsPriceBarStuck(pastTop && !pastEnd);
    };

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        pastTop = !entry.isIntersecting;
        updateStuckState();
      },
      { threshold: 0 }
    );

    const endObserver = new IntersectionObserver(
      ([entry]) => {
        pastEnd = entry.isIntersecting;
        updateStuckState();
      },
      { threshold: 0 }
    );

    topObserver.observe(topSentinel);
    endObserver.observe(endSentinel);

    return () => {
      topObserver.disconnect();
      endObserver.disconnect();
    };
  }, [product]);

  if (!product) {
    return <div className="product-detail-loading">Loading...</div>;
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    // TODO: POST to the real API once the backend is ready
    await new Promise((resolve) => setTimeout(resolve, 300));

    setReviews((prev) => [
      {
        id: Date.now(),
        userName: "You",
        userAvatar: "/images/avatar-placeholder.png",
        text: reviewText.trim(),
      },
      ...prev,
    ]);
    setReviewText("");
    setReviewPage(0);
    setIsSubmittingReview(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  const totalReviewPages = getTotalReviewPages(reviews.length);
  const visibleReviews = getReviewsForPage(reviews, reviewPage);

  const showPrevReviewPage = () => {
    setReviewPage((prev) => Math.max(0, prev - 1));
  };

  const showNextReviewPage = () => {
    setReviewPage((prev) => Math.min(totalReviewPages - 1, prev + 1));
  };

  return (
    <div className="product-detail-page">
      {/* page bar: name on the right, back button on the left — same pattern used elsewhere */}
      <div className="product-detail-pagebar">
        <button
          className="product-detail-back"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          &larr; Back
        </button>
        <span className="product-detail-pagebar-title">{product.name}</span>
      </div>

      <div ref={priceBarSentinelRef} />

      <div className="product-detail-main">
        <div className="product-detail-gallery">
          <div className="product-detail-gallery-frame">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              className="product-detail-gallery-image"
            />
            {product.images.length > 1 && (
              <div className="product-detail-gallery-dots">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={
                      "product-detail-gallery-dot" +
                      (index === activeImage ? " is-active" : "")
                    }
                    onClick={() => setActiveImage(index)}
                    aria-label={`Image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>
        </div>

        {/* info table — placeholder rows, will be filled from the admin panel */}
        <div className="product-detail-specs">
          <table className="product-detail-specs-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {product.specs.map((row, index) => (
                <tr key={index}>
                  <td>{row.label}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="product-detail-reviews">
        <div className="product-detail-reviews-header">
          <h2 className="product-detail-reviews-title">Reviews</h2>
          {totalReviewPages > 1 && (
            <div className="product-detail-reviews-nav">
              <button
                className="product-detail-review-arrow"
                onClick={showPrevReviewPage}
                aria-label="Previous reviews"
                disabled={reviewPage === 0}
              >
                &larr;
              </button>
              <span className="product-detail-review-position">
                {reviewPage + 1} / {totalReviewPages}
              </span>
              <button
                className="product-detail-review-arrow"
                onClick={showNextReviewPage}
                aria-label="Next reviews"
                disabled={reviewPage === totalReviewPages - 1}
              >
                &rarr;
              </button>
            </div>
          )}
        </div>

        <div className="product-detail-review-grid">
          {reviewPage === 0 && (
            <form
              className="product-detail-review-form-card"
              onSubmit={handleSubmitReview}
            >
              <textarea
                className="product-detail-review-input"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button
                type="submit"
                className="product-detail-review-submit"
                disabled={isSubmittingReview || !reviewText.trim()}
              >
                {isSubmittingReview ? "Submitting..." : "Submit review"}
              </button>
            </form>
          )}

          {visibleReviews.map((review) => (
            <div key={review.id} className="product-detail-review-item">
              <div className="product-detail-review-header">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="product-detail-review-avatar"
                />
                <span className="product-detail-review-username">
                  {review.userName}
                </span>
              </div>
              <p className="product-detail-review-text">{review.text}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="product-detail-review-empty">No reviews yet.</p>
          )}
        </div>
      </div>

      <div ref={priceBarEndRef} />

      <div
        className={
          "product-detail-pricebar" +
          (isPriceBarStuck ? " is-stuck" : "")
        }
      >
        <button className="product-detail-add-to-cart" onClick={handleAddToCart}>
          Add to cart
        </button>
        <span className="product-detail-price">{formatPrice(product.price)}</span>
      </div>
    </div>
  );
}
