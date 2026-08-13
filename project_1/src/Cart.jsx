import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ۱. Context باید ساخته بشه
const CartContext = createContext();

// ۲. Provider — این باید بالای App یا هرجا Cart استفاده میشه بپیچه
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

// ۳. هوک برای دسترسی راحت به context
export const useCart = () => useContext(CartContext);

// ۴. کامپوننت صفحه‌ی سبد خرید (همون چیزی که در روت /cart نشون داده میشه)
export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    clearNewItemFlag
  } = useCart();

  // به محض ورود کاربر به صفحه سبد، نقطه قرمز محو میشه
  useEffect(() => {
    clearNewItemFlag();
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <button className="back-button" onClick={() => navigate("/")}>
        ← 
      </button>
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p>The shopping cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                {/* سمت راست */}
                <div className="cart-product">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* سمت چپ */}
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
            ))}
          </div>

          {/* پایین سبد */}
          <div className="cart-bottom">
            <div className="cart-total">
              <span>Total:</span>
              <strong>{totalPrice.toLocaleString()} USD</strong>
            </div>

            <button className="checkout-button">ادامه پرداخت</button>
          </div>
        </>
      )}
    </div>
  );
}