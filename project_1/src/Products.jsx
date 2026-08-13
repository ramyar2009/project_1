import { useEffect, useState } from "react";
import { useCart } from "./Cart"; // مسیر فایلی که CartContext توشه
import "./Products.css";

function Products({ search }) {
  const { cartItems, addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const response = await fetch("API");
      const data = await response.json();
      setProducts(data);
    }
    // وقتی API آماده شد این قسمت استفاده می‌شود
    // getProducts();
  }, []);

  if (search === "") {
    return null;
  }

  const fakeProducts = [
    {
      id: 101,
      name: "iPhone 15 Pro",
      price: 1200,
      stock: 10,
      image: "https://picsum.photos/300/200?random=1"
    },
    {
      id: 102,
      name: "MacBook Air M3",
      price: 1500,
      stock: 5,
      image: "https://picsum.photos/300/200?random=2"
    },
    {
      id: 103,
      name: "Samsung Galaxy S24",
      price: 900,
      stock: 8,
      image: "https://picsum.photos/300/200?random=3"
    }
  ];

  const allProducts = [...fakeProducts];

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
            <img src={p.image} alt={p.name} />
            <h2>{p.name}</h2>
            <h3>{p.price.toLocaleString()}</h3>

            <div className="product-actions">
              <button
                className="cart-button"
                onClick={() => addToCart(p)}
                disabled={cartQuantity >= p.stock}
              >
                🛒
              </button>

              {cartQuantity > 0 && (
                <span className="added-count">
                  {cartQuantity} عدد در سبد
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