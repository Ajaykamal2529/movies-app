import "./index.css";
import { Link } from "react-router-dom";

const SimilarMovies = (props) => {
  const { movieDetails } = props;
  const { id, posterPath, title } = movieDetails;

  return (
    <li className="similar-movie-item">
      <Link to={`/movies/${id}`} className="link-item">
        <img src={posterPath} alt={title} className="similar-movie-poster" />
        <p className="similar-movie-title">{title}</p>
      </Link>
    </li>
  );
};

export default SimilarMovies;
