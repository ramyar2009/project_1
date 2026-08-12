import { useState } from "react";
import Header from "./Header";
import Products from "./Products";
import Cart from "./Cart";

function App() {
  const [search, setSearch] = useState("");
  const [cart,setCart]= useState([]);

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
      />

      <Products search={search}
      cart={cart} 
      setCart={setCart}/>

      <Cart 
      cart={cart}
      setCart={setCart}/>
    </>
  );
}

export default App;
