import {Component} from 'react'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import { SpinnerCircularFixed } from 'spinners-react'
import './index.css'

const apiSearchStatusConstant = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
}

class Search extends Component {
    state={
        searchInput: '',
        apiSearchStatus: apiSearchStatusConstant.initial,
        SearchMoviesList: [],
        searchAttempted: false,
    }

    componentDidMount() {
        const {searchInput} = this.state
        this.fetchSearchData(searchInput);
      }

    fetchSearchData = async (query) => {
        this.setState({ apiSearchStatus: apiSearchStatusConstant.inProgress, searchAttempted:true });
        const jwtToken = Cookies.get('jwt_token');    
        try {
            const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${query}`;
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            };
    
            const response = await fetch(apiUrl, options);
            console.log(response);
    
            if (response.ok) {
                const searchMoviesData = await response.json();
    
                if (searchMoviesData.results.length === 0) {
                    this.setState({ apiSearchStatus: apiSearchStatusConstant.failure });
                } else {
                    const updatedSearchMoviesData = searchMoviesData.results.map(eachMovie => ({
                        id: eachMovie.id,
                        posterUrl: eachMovie.poster_path,
                        movieName: eachMovie.title,
                    }));    
                    this.setState({
                        SearchMoviesList: updatedSearchMoviesData,
                        apiSearchStatus: apiSearchStatusConstant.success
                    });
                }
            } else {
                this.setState({ apiSearchStatus: apiSearchStatusConstant.failure });
            }
        } catch (error) {
            console.error(error);
            this.setState({ apiSearchStatus: apiSearchStatusConstant.failure });
        }
    }
    

    changeSearchInput = searchInput => {
        this.setState({searchInput})
    }

    renderLoadingView = () => (
        <div className='loading-view'>
            <SpinnerCircularFixed
                size={50}
                thickness={100}
                speed={100}
                color="rgba(172, 57, 59, 1)"
                secondaryColor="rgba(0, 0, 0, 0.44)"
            />
        </div>
    );
    
    renderNoResultsView = () => {
        const {searchInput} = this.state 
        return(
        <div className='no-results-view'>
            <img
                src='https://res.cloudinary.com/duwjg8xwd/image/upload/v1721021365/Group_7394_hoptn5.png'
                alt='no results view'
                className='no-results-view-image'
            />
            <p className='no-results-description'>Your search for {searchInput} did not find any matches</p>
        </div>
        )
    }

    renderSearchSuccessView = () => {
        const {SearchMoviesList} = this.state
        return(
            <div className='search-success-view'>
                <div className='search-success-view-container'>
                <ul className='search-movies-list'>
                    {SearchMoviesList.map(movie => (
                        <li key={movie.id} className='search-movie-item'>                                        
                            <Link to={`/movies/${movie.id}`} className='link-item'>
                                <img src={movie.posterUrl} alt={movie.movieName} className='movie-poster' />
                                <p className='movie-name'>{movie.movieName}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
                </div>
            </div>
        )
    }

    renderAllSearchView = () =>{
        const {apiSearchStatus, searchAttempted} = this.state 
        if(!searchAttempted) {
            return null
        }
        switch (apiSearchStatus) {
            case apiSearchStatusConstant.inProgress:
                return this.renderLoadingView()
            case apiSearchStatusConstant.success:
                return this.renderSearchSuccessView()
            case apiSearchStatusConstant.failure:
                return this.renderNoResultsView()
            default:
                return null
        }
    }
    
    render() {
        const {searchInput} = this.state
        return(
            <div className='search-container'>
                <Header
                searchInput={searchInput}
                changeSearchInput={this.changeSearchInput}
                fetchSearchData={this.fetchSearchData}
                />
                {this.renderAllSearchView()}
                <Footer />
            </div>
        )
    }
}

export default Search