import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './index.css';
import Header from '../Header';
import Footer from '../Footer';
import TrendingMovies from '../TrendingMovies';
import OriginalsMovies from '../OriginalsMovies';
import { SpinnerCircularFixed } from 'spinners-react';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const apiTrendingStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
};

const apiOriginalsStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS'
};

class Home extends Component {
    state = {
        apiTrendingStatus: apiTrendingStatusConstants.initial,
        apiOriginalsStatus: apiOriginalsStatusConstants.initial,
        trendingMovies: [],
        originalsMovies: [],
        randomMovie: null,
    };

    componentDidMount() {
        this.fetchTrendingMoviesData();
        this.fetchOriginalsMoviesData();
    }

    fetchTrendingMoviesData = async () => {
        this.setState({ apiTrendingStatus: apiTrendingStatusConstants.inProgress });
        const {apiTrendingStatus} = this.state
        const jwtToken = Cookies.get('jwt_token');
        const trendingApiUrl = 'https://apis.ccbp.in/movies-app/trending-movies';
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        }
            const trendingMoviesResponse = await fetch(trendingApiUrl, options);
            if (trendingMoviesResponse.ok) {
                const trendingMoviesData = await trendingMoviesResponse.json();
                const updatedTrendingMovies = trendingMoviesData.results.map((eachMovie) => ({
                    id: eachMovie.id,
                    title: eachMovie.title,
                    posterUrl: eachMovie.poster_path,
                }));
                this.setState({ trendingMovies: updatedTrendingMovies, apiTrendingStatus: apiTrendingStatusConstants.success });
            } else {
                this.setState({apiOriginalsStatusConstants:apiTrendingStatus.failure})
            }
    };

    fetchOriginalsMoviesData = async () => {
        this.setState({ apiOriginalsStatus: apiOriginalsStatusConstants.inProgress });
        const {apiOriginalsStatus} = this.state
        const jwtToken = Cookies.get('jwt_token');
        const originalsApiUrl = 'https://apis.ccbp.in/movies-app/originals';
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        };
            const originalsMoviesResponse = await fetch(originalsApiUrl, options);
            if (originalsMoviesResponse.ok) {
                const originalsMoviesData = await originalsMoviesResponse.json();
                const updatedOriginalsMovies = originalsMoviesData.results.map((eachMovie) => ({
                    id: eachMovie.id,
                    title: eachMovie.title,
                    posterUrl: eachMovie.poster_path,
                }));
                const randomMovie = updatedOriginalsMovies[Math.floor(Math.random() * updatedOriginalsMovies.length)];
                this.setState({ originalsMovies: updatedOriginalsMovies, randomMovie, apiOriginalsStatus: apiOriginalsStatusConstants.success });
            } else {
                this.setState({apiOriginalsStatusConstants:apiOriginalsStatus.failure})
            }
    };

    scrollLeft = (containerId) => {
        const container = document.getElementById(containerId);
        container.scrollBy({left: -500, behavior:'smooth'})
    };

    scrollRight = (containerId) => {
        const container = document.getElementById(containerId);
        container.scrollBy({left: 500, behavior:'smooth'})

    };

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
        this.fetchTrendingMoviesData();
        this.fetchOriginalsMoviesData();
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

    renderTrendingSuccessView = () => {
        const { trendingMovies } = this.state;
        return (
            <div className='movie-section'>
                <h1 className='trending-heading'>Trending Now</h1>
                <div className='movie-list-container'>
                    <button className='scroll-left-button' onClick={() => this.scrollLeft('trendingMovies')}>
                        <MdArrowBackIos />
                    </button>
                    <ul className='movie-list' id='trendingMovies'>
                        {trendingMovies.map((eachMovie) => (
                            <TrendingMovies key={eachMovie.id} trendingMoviesDetails={eachMovie} />
                        ))}
                    </ul>
                    <button className='scroll-right-button' onClick={() => this.scrollRight('trendingMovies')}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        );
    };

    renderOriginalsSuccessView = () => {
        const { originalsMovies } = this.state;
        return (
            <div className='movie-section'>
                <h1 className='originals-heading'>Originals</h1>
                <div className='movie-list-container'>
                    <button className='scroll-left-button' onClick={() => this.scrollLeft('originalsMovies')}>
                        <MdArrowBackIos />
                    </button>
                    <ul className='movie-list' id='originalsMovies'>
                        {originalsMovies.map((eachMovie) => (
                            <OriginalsMovies key={eachMovie.id} originalsMoviesDetails={eachMovie} />
                        ))}
                    </ul>
                    <button className='scroll-right-button' onClick={() => this.scrollRight('originalsMovies')}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
        );
    };

    renderAllTrendingMovies = () => {
        const { apiTrendingStatus } = this.state;
        switch (apiTrendingStatus) {
            case apiTrendingStatusConstants.inProgress:
                return this.renderLoadingView();
            case apiTrendingStatusConstants.success:
                return this.renderTrendingSuccessView();
            case apiTrendingStatusConstants.failure:
                return this.renderFailureView();
            default:
                return null;
        }
    };

    renderAllOriginalsMovies = () => {
        const { apiOriginalsStatus } = this.state;
        switch (apiOriginalsStatus) {
            case apiOriginalsStatusConstants.inProgress:
                return this.renderLoadingView();
            case apiOriginalsStatusConstants.success:
                return this.renderOriginalsSuccessView();
            case apiOriginalsStatusConstants.failure:
                return this.renderFailureView();
            default:
                return null;
        }
    };

    render() {
        const { randomMovie } = this.state;

        return (
            <div className='app-container'>
                <Header />
                {randomMovie && (
                    <div
                        className='main-banner'
                        style={{ backgroundImage: `url(${randomMovie.posterUrl})` }}
                    >
                        <div className='banner-content'>
                            <h1>{randomMovie.title}</h1>
                            <p>{randomMovie.description}</p>
                            <button className='play-button'>Play</button>
                        </div>
                    </div>
                )}
                {this.renderAllTrendingMovies()}
                {this.renderAllOriginalsMovies()}
                <Footer />
            </div>
        );
    }
}

export default Home;
