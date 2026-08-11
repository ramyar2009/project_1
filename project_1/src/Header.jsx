function Header({ search, setSearch }) {
  return (
    <header>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </header>
  );
}

export default Header;