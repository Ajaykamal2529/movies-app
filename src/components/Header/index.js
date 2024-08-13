import { Link } from "react-router-dom";
import { HiOutlineSearch } from "react-icons/hi";
import "./index.css";

const Header = (props) => {
  const onChangeSearchInput = (event) => {
    const { changeSearchInput, fetchSearchData } = props;
    const searchInput = event.target.value;
    changeSearchInput(searchInput);
    fetchSearchData(searchInput);
  };

  const renderSearchInput = () => {
    const { searchInput } = props;
    return (
      <div>
        <input
          className="search-bar"
          type="text"
          value={searchInput}
          onChange={onChangeSearchInput}
          placeholder="Search"
        />
        <button type="submit" className="search-button">
          <HiOutlineSearch />
        </button>
      </div>
    );
  };
  return (
    <nav className="nav-bar">
        <div className="nav-bar-container">
          <div className="nav-logo-heading">
            <Link to="/" className="nav-link">
              <h1 className="title">MOVIE BUDDY</h1>
            </Link>
          </div>
          <div className="nav-menu">
            <Link to="/" className="nav-link">
              <h1 className="nav-menu-item">Home</h1>
            </Link>
            <Link to="/popular" className="nav-link">
              <h1 className="nav-menu-item">Popular</h1>
            </Link>
              <Link to="/search" className="nav-link">
                {renderSearchInput()}
              </Link>
            <Link to="/profile" className="nav-link">
              <h1 className="nav-menu-item">Profile</h1>
            </Link>
          </div>
        </div>
    </nav>
  );
};

export default Header;
