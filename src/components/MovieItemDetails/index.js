import { Component } from "react";
import Cookies from "js-cookie";
import SimilarMovies from "../SimilarMovies";
import { SpinnerCircularFixed } from "spinners-react";
import { withRouter } from "./withRouter";
import { IoMdArrowRoundBack } from "react-icons/io";
import './index.css'

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetails: {},
    similarMovies: [],
  };

  componentDidMount() {
    this.fetchMovieDetails();
  }

  getFormattedData = (data) => ({
    adult: data.adult,
    backdropPath: data.backdrop_path,
    budget: data.budget,
    genres: data.genres.map((genre) => ({
      id: genre.id,
      name: genre.name,
    })),
    id: data.id,
    overview: data.overview,
    posterPath: data.poster_path,
    releaseDate: data.release_date,
    runtime: data.runtime,
    languages: data.spoken_languages.map((language) => ({
      languageName: language.name,
      id: language.id,
    })),
    title: data.title,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
  });

  fetchMovieDetails = async () => {
    try {
      const jwtToken = Cookies.get("jwt_token");
      const { params } = this.props;
      const { id } = params;
      console.log(id);
      this.setState({ apiStatus: apiStatusConstants.inProgress });
      const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`;
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(apiUrl, options);
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (response.ok === true) {
        const updatedData = this.getFormattedData(data.movie_details);
        const updatedSimilarMoviesData = data.similar_movies
          ? data.similar_movies.map((eachSimilarMovie) =>
              this.getFormattedData(eachSimilarMovie)
            )
          : [];
        this.setState({
          movieDetails: updatedData,
          similarMovies: updatedSimilarMoviesData,
          apiStatus: apiStatusConstants.success,
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } catch (error) {
      console.log(error);
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };
  renderLoadingView = () => (
    <div className="loading-view">
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
    this.fetchMovieDetails();
  };

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/duwjg8xwd/image/upload/v1720753620/Background-Complete_xpcgb1.png"
        alt="failure view"
        className="failure-view-image"
      />
      <p className="failure-description">
        Something went wrong. Please try again.
      </p>
      <button
        className="try-again-button"
        type="button"
        onClick={this.onClickTryAgain}
      >
        Try Again
      </button>
    </div>
  );

  onClickBackIcon = () => {
    const { navigate } = this.props;
    navigate(-1);
  };

  renderSuccessView = () => {
    const { movieDetails, similarMovies } = this.state;
    console.log(similarMovies);
    const {
      title,
      backdropPath,
      overview,
      genres,
      runtime,
      releaseDate,
      voteAverage,
      voteCount,
      languages,
    } = movieDetails;

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const runtimeString = `${hours}h ${minutes}m`;

    return (
      <div className="movie-details-container">
        <IoMdArrowRoundBack
          onClick={this.onClickBackIcon}
          className="back-icon"
        />
        <img src={backdropPath} alt={title} className="movie-backdrop" />
        <div className="movie-details-content">
          <h1 className="movie-title">{title}</h1>
          <div className="movie-info">
            <span className="movie-runtime">{runtimeString}</span>
            <span className="movie-release-date">{releaseDate}</span>
            <span className="movie-rating">U/A</span>
          </div>
          <p className="movie-overview">{overview}</p>
          <button type="button" className="play-button">
            Play
          </button>
          <div className="movie-additional-info">
            <div>
              <h4>Genres</h4>
              <p>{genres.map((genre) => genre.name).join(" ")}</p>
            </div>
            <div>
              <h4>Audio Available</h4>
              <p>
                {languages.map((language) => language.languageName).join(", ")}
              </p>
            </div>
            <div>
              <h4>Rating Count</h4>
              <p>{voteCount}</p>
              <h4>Rating Average</h4>
              <p>{voteAverage}</p>
            </div>
            <div>
              <h4>Release Date</h4>
              <p>{releaseDate}</p>
            </div>
          </div>
        </div>
        <div className="similar-movies-container">
          <h3>More like this</h3>
          <ul className="similar-movies-list">

            {similarMovies.length > 0 ? (
              similarMovies.map((movie) => (
                <SimilarMovies key={movie.id} movieDetails={movie} />
              ))
            ) : (
              <p className="no-similar-movies">No similar movies found</p>
            )}
          </ul>
        </div>
      </div>
    );
  };

  renderMovieDetailsView = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.success:
        return this.renderSuccessView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div className="movie-item-details">{this.renderMovieDetailsView()}</div>
    );
  }
}

export default withRouter(MovieItemDetails);
