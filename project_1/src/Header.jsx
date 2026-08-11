import './Header.css'
import searchlcon from "../search.png"


function Header({ search, setSearch }) {

  return (
    <header>

        <div className="search-box">
          <img className='search-icon' src={searchlcon} alt="search" />
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        </div>

        <div>
        <h1>shop</h1>
      </div>

    </header>
  );
}

export default Header;