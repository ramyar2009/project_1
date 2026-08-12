

function Cart({ cart, setCart }) {

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
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
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">

      <h1>سبد خرید</h1>

      {cart.length === 0 ? (
        <p>سبد خرید خالی است</p>
      ) : (

        <>

          <div className="cart-items">

            {cart.map((item) => (

              <div className="cart-item" key={item.id}>

                {/* سمت راست */}
                <div className="cart-product">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                       {item.price.toLocaleString()} 
                    </p>
                  </div>

                </div>

                {/* سمت چپ */}
                <div className="cart-quantity">

                  <button
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

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
              <span>مجموع:</span>

              <strong>
                {totalPrice.toLocaleString()} USD
              </strong>
            </div>

            <button className="checkout-button">
              ادامه پرداخت
            </button>

          </div>

        </>
      )}

    </div>
  );
}

export default Cart;