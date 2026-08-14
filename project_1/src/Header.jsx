import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./Cart";
import "./Header.css"
import searchlcon from "../search.png";
import shopimg from "../shop.png";
import carticon from "../cart-icon.png"

//import cartIcon from "../cart.png"

function Header({ search, setSearch }) {
  const { hasNewItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

     
    if (value !== "" && location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header>
    <div className='hedtop'>
        <div className="search-box">
          <img className='search-icon' src={searchlcon} alt="search" />
      <input 
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={handleSearchChange}
      />
        </div>

        <div className='nameshop'>
        <h2 className='nametaepe'>shop</h2>
        <img className='imgshop' src={shopimg} alt="img-web" />
      </div>

      <Link to="/cart" className="cart-icon-wrapper">
        <img className="cart-icon" src={carticon} alt="cart" />
        {hasNewItem && <span className="cart-badge"></span>}
      </Link>
    </div>
    </header>
  );
}

export default Header;