import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./Cart";
import "./Header.css";
import searchlcon from "../search.png";
import shopimg from "../shop.png";
import carticon from "../cart-icon.png";
import { Laptop, Smartphone, Watch, Headphones, User } from "lucide-react";

const categories = [
  { name: "لپتاپ", icon: Laptop },
  { name: "موبایل", icon: Smartphone },
  { name: "ساعت هوشمند", icon: Watch },
  { name: "لوازم جانبی", icon: Headphones },
];

function Header({ search, setSearch }) {
  const { hasNewItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value !== "" && location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header>
      <div className="hedtop">
        <div className="search-box">
          <img className="search-icon" src={searchlcon} alt="search" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="nameshop">
          <h2 className="nametaepe">shop</h2>
          <img className="imgshop" src={shopimg} alt="img-web" />
        </div>

        <Link to="/cart" className="cart-icon-wrapper">
          <img className="cart-icon" src={carticon} alt="cart" />
          {hasNewItem && <span className="cart-badge"></span>}
        </Link>
      </div>

      <div className="auth-hed">
        <Link to="/auth" className="auth-btn">
          <User size={25} />
          <span></span>
        </Link>

        <div className="header-right">
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <ul className="header-badges">
            <li>leaveacomment</li>
            <li>about</li>
            <li>rules</li>
            <li>broducts</li>
            <li>blog</li>
          </ul>
        </div>

        <ul className={`category-dropdown ${menuOpen ? "show" : ""}`}>
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <li key={i}>
                <Icon size={18} />
                <span>{cat.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default Header;