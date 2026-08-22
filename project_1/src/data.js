

export const products = [
  {
    id: 101,
    name: "iPhone 15 Pro",
    price: 1200,
    stock: 10,
    image: "https://picsum.photos/300/200?random=1",
    images: [
      "https://picsum.photos/600/600?random=1",
      "https://picsum.photos/600/600?random=11",
      "https://picsum.photos/600/600?random=12",
    ],
    description:
      "Product description goes here. This is placeholder text and should be replaced with data from the real API.",
    // placeholder rows — this table will be populated from the admin panel later
    specs: [
      { label: "Description", value: "—" },
      { label: "Material", value: "—" },
      { label: "Size", value: "—" },
      { label: "Color", value: "—" },
    ],
  },
  {
    id: 102,
    name: "MacBook Air M3",
    price: 1500,
    stock: 5,
    image: "https://picsum.photos/300/200?random=2",
    images: [
      "https://picsum.photos/600/600?random=2",
      "https://picsum.photos/600/600?random=21",
      "https://picsum.photos/600/600?random=22",
    ],
    description:
      "Product description goes here. This is placeholder text and should be replaced with data from the real API.",
    specs: [
      { label: "Description", value: "—" },
      { label: "Material", value: "—" },
      { label: "Size", value: "—" },
      { label: "Color", value: "—" },
    ],
  },
  {
    id: 103,
    name: "Samsung Galaxy S24",
    price: 900,
    stock: 8,
    image: "https://picsum.photos/300/200?random=3",
    images: [
      "https://picsum.photos/600/600?random=3",
      "https://picsum.photos/600/600?random=31",
      "https://picsum.photos/600/600?random=32",
    ],
    description:
      "Product description goes here. This is placeholder text and should be replaced with data from the real API.",
    specs: [
      { label: "Description", value: "—" },
      { label: "Material", value: "—" },
      { label: "Size", value: "—" },
      { label: "Color", value: "—" },
    ],
  },
];

export const reviews = [
  {
    id: 1,
    productId: 101,
    userName: "Sample User",
    userAvatar: "/images/avatar-placeholder.png",
    text: "Sample review for this product.",
  },
  {
    id: 2,
    productId: 101,
    userName: "Another User",
    userAvatar: "/images/avatar-placeholder.png",
    text: "Another sample review for this product.",
  },
];

// String() on both sides so it doesn't matter whether the id came from a
// route param (always a string) or straight from the products array (number)
export function getProductById(id) {
  return products.find((product) => String(product.id) === String(id)) || null;
}

export function getReviewsByProductId(id) {
  return reviews.filter((review) => String(review.productId) === String(id));
}
