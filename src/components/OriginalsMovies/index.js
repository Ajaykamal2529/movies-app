import './index.css';
import { Link } from 'react-router-dom';

const OriginalsMovies = props => {
    const { originalsMoviesDetails } = props;
    const { id,posterUrl, title } = originalsMoviesDetails;

    return (
        <li className='movie-item'>
            <Link to={`/movies/${id}`} className='link-item'>
                <img className='poster-image' src={posterUrl} alt={title} />
                <h1 className='movie-title'>{title}</h1>
            </Link>

        </li>
    );
}

export default OriginalsMovies;
