import './index.css';
import { Link } from 'react-router-dom';

const TrendingMovies = props => {
    const { trendingMoviesDetails } = props;
    const { id,posterUrl, title } = trendingMoviesDetails;

    return (
        <li className='movie-item'>
            <Link to={`/movies/${id}`} className='link-item'>
                <img className='poster-image' src={posterUrl} alt={title} />
                <h1 className='movie-title'>{title}</h1>
            </Link>
        </li>
    );
}

export default TrendingMovies;
