import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "./Cart"; // path to the file where CartContext lives
import { products as allProducts } from "./data";
import "./Products.css";

function Products({ search }) {
  const { cartItems, addToCart } = useCart();

  // TODO: replace allProducts (from data.js) with a real API call once the
  // backend is ready — keep the same shape (id, name, price, stock, image)
  useEffect(() => {
    // fetch("API").then(res => res.json()).then(setProducts) ...
  }, []);

  if (search === "") {
    return null;
  }

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products">
      {filteredProducts.map((p) => {
        const cartProduct = cartItems.find((item) => item.id === p.id);
        const cartQuantity = cartProduct ? cartProduct.quantity : 0;

        return (
          <div className="product" key={p.id}>
            <Link to={`/product/${p.id}`} className="product-link">
              <img src={p.image} alt={p.name} />
              <h2>{p.name}</h2>
              <h3>{p.price.toLocaleString()}</h3>
            </Link>

            <div className="product-actions">
              <button
                className="cart-button"
                onClick={() => addToCart(p)}
                disabled={cartQuantity >= p.stock}
              >
                add to cart
              </button>

              {cartQuantity > 0 && (
                <span className="added-count">
                  {cartQuantity} Add
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Products;
