import { useEffect, useState } from "react";
import './Products.css'

function Products({ search }) {

  const fakeProducts= [
  {
    id: 101,
    name: "iPhone 15 Pro",
    description: "A powerful smartphone with a great camera.",
    image: "https://picsum.photos/300/200?random=1"
  },
  {
    id: 102,
    name: "MacBook Air M3",
    description: "A lightweight and powerful laptop.",
    image: "https://picsum.photos/300/200?random=2"
  },
  {
    id: 103,
    name: "Samsung Galaxy S24",
    description: "A modern Android smartphone.",
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

   getProducts();
  }, []);

  const allProducts=[...fakeProducts];
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products">

      {
      filteredProducts.map((p) => (
        <div className="product" key={p.id}>
          <img src={p.image} alt={p.name} />
          <h2>{p.name}</h2>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;