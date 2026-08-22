import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Cart.css"

// 1. Create the context
const CartContext = createContext();

// 2. Provider — wraps App (or wherever Cart is used)
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hasNewItem, setHasNewItem] = useState(false);

  const addToCart = (products) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === products.id);
      if (exists) {
        return prev.map((item) =>
          item.id === products.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...products, quantity: 1 }];
    });
    setHasNewItem(true);
  };

  const clearNewItemFlag = () => setHasNewItem(false);

  const increaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity < item.stock
                  ? item.quantity + 1
                  : item.quantity
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        hasNewItem,
        clearNewItemFlag,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Hook for easy access to the context
export const useCart = () => useContext(CartContext);

// 4. The Cart page component (rendered at the /cart route)
export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    clearNewItemFlag
  } = useCart();

  // clear the red-dot badge as soon as the user opens the cart
  useEffect(() => {
    clearNewItemFlag();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="carts">

      <div className="nameclick">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Back
      </button>
      <h1 className="name-Cart">Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <p>The shopping cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>

                  <div className="asle-cart">
                <Link to={`/product/${item.id}`} className="cart-product">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h2>{item.name}</h2>
                    <h3>{item.price.toLocaleString()}</h3>
                  </div>
                </Link>


                <div className="cart-quantity">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              </div>
            ))}
          </div>


          <div className="cart-bottom">
            <div className="cart-total">
              <span className="total">Total:</span>
              <strong className="USD">{totalPrice.toLocaleString()} USD</strong>
            </div>

            <button className="checkout-button">Continue to payment</button>
          </div>
        </>
      )}
    </div>
  );
}
