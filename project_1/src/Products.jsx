import { useEffect, useState } from "react";
import "./Products.css";


function Products({ search, cart, setCart }) {
  if (search === ""){
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

  // اضافه کردن یک عدد محصول به سبد
  const addToCart = (product) => {

    setCart((prevCart) => {

      const existingProduct = prevCart.find(
        (item) => item.id === product.id
      );

      // اگر محصول قبلاً داخل سبد باشد
      if (existingProduct) {

        // اگر تعداد به موجودی رسیده باشد
        if (existingProduct.quantity >= product.stock) {
          return prevCart;
        }

        return prevCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );
      }

      // اگر محصول هنوز داخل سبد نیست
      return [
        ...prevCart,
        {
          ...product,
          quantity: 1
        }
      ];

    });
  };

  const allProducts = [...fakeProducts];

  const filteredProducts = allProducts.filter((product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="products">

      {filteredProducts.map((p) => {

        const cartProduct = cart.find(
          (item) => item.id === p.id
        );

        const cartQuantity = cartProduct
          ? cartProduct.quantity
          : 0;

        return (
          <div className="product" key={p.id}>

            <img
              src={p.image}
              alt={p.name}
            />

            <h2>{p.name}</h2>

            <h3>
               {p.price.toLocaleString()}
            </h3>

            {/* موجودی زیر قیمت */}
         {  // <p>
            //  موجودی: {p.stock} عدد
           // </p>
            }

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