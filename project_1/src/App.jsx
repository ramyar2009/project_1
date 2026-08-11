import { useState } from "react";
import Header from "./Header";
import Products from "./Products";

function App() {
  const [search, setSearch] = useState("");

  return (
    <>
      <Header
        search={search}
        setSearch={setSearch}
      />

      <Products search={search} />
    </>
  );
}

export default App;
