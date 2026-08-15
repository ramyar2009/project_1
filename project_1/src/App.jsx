import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider , Cart } from "./Cart";
import Header from "./Header";
import Products from "./Products";
import AuthPage from "./AuthPage";

function App() {
  const [search, setSearch] = useState("");

  return (
    <CartProvider>
      <BrowserRouter>
        <Header search={search} setSearch={setSearch} />

        <Routes>
          <Route
            path="/"
            element={<Products search={search} />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthPage/>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;