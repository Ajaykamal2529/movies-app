import {Component} from 'react'
import { SpinnerCircularFixed } from 'spinners-react'
import { Link } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import Cookies from 'js-cookie'
import './index.css'

const apiPopularStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
}

class Popular extends Component {
    state ={
        popularMovies:[],
        apiPopularStatus: apiPopularStatusConstants.initial
    }

    componentDidMount() {
        this.fetchPopularMovies()
    }

    fetchPopularMovies = async () => {
        this.setState({apiPopularStatus: apiPopularStatusConstants.inProgress})
        const jwtToken = Cookies.get('jwt_token')
        const PopularApiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
        const options ={
            method:'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        }
        try{
            const response = await fetch(PopularApiUrl, options)
        console.log(response)
        if(response.ok === true ){
            const fetchedPopularMoviesData = await response.json()
            console.log(fetchedPopularMoviesData)
            const updatedPopularMovies = fetchedPopularMoviesData.results.map((eachMovie) => ({
                id: eachMovie.id,
                posterPath: eachMovie.poster_path,
                title: eachMovie.title,
            }))
            this.setState({popularMovies: updatedPopularMovies, apiPopularStatus: apiPopularStatusConstants.success})
        }else{
            this.setState({apiPopularStatus: apiPopularStatusConstants.failure})
        }
        }catch(error){
            this.setState({apiPopularStatus: apiPopularStatusConstants.failure})
        }
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

    onClickTryAgain = () => {
        this.fetchPopularMovies()
    };

    renderFailureView = () => (
        <div className='failure-view'>
            <img
                src='https://res.cloudinary.com/duwjg8xwd/image/upload/v1720753620/Background-Complete_xpcgb1.png'
                alt='failure view'
                className='failure-view-image'
            />
            <p className='failure-description'>Something went wrong. Please try again.</p>
            <button className='try-again-button' type='button' onClick={this.onClickTryAgain}>
                Try Again
            </button>
        </div>
    );
    renderSuccessView = () => {
        const {popularMovies} = this.state
        return (
            <div className='popular-movies-view'>
                <ul className='popular-movies-list'>
                    {popularMovies.map(eachMovie => (
                        <li className='popular-movie-item' key={eachMovie.id}>
                            <Link to={`/movies/${eachMovie.id}`} className='link-item'>
                                <img src={eachMovie.posterPath} alt='poster path' className='poster-image' />
                                <p className='movie-title'>{eachMovie.title}</p>
                            </Link>
                        </li>
                    )) }
                </ul>
            </div>
        )
    }

    renderAllPopularMovies = () => {
        const {apiPopularStatus} = this.state 
        switch (apiPopularStatus) {
            case apiPopularStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiPopularStatusConstants.success:
                return this.renderSuccessView()
            case apiPopularStatusConstants.failure:
                return this.renderFailureView()
            default:
                return null
        } 
    }
    render() {
        return(
            <div>
                <Header />
                {this.renderAllPopularMovies()}
                <Footer />
            </div>
        )
    }
}

export default Popular