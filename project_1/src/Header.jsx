import './Header.css'
import searchlcon from "./assets/search.png"


function Header({ search, setSearch }) {

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
    </div>
    </header>
  );
}

export default Header;