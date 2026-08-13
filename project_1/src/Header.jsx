import { Link } from "react-router-dom";
import { useCart } from "./Cart";
import './Header.css'
import searchlcon from "../search.png"
//import cartIcon from "../cart.png"

function Header({ search, setSearch }) {
  const { hasNewItem } = useCart();

  return (
    <header>
    <div className='hedtop'>
        <div className="search-box">
          <img className='search-icon' src={searchlcon} alt="search" />
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        </div>

        <div className='nameshop'>
        <h2 className='nametaepe'>shop</h2>
        <img className='imgshop' src="" alt="img-web" />
      </div>

      <Link to="/cart" className="cart-icon-wrapper">
        <img className="cart-icon" src="" alt="cart" />
        {hasNewItem && <span className="cart-badge"></span>}
      </Link>
    </div>
    </header>
  );
}

export default Header;