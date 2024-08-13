import './index.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

function withRouter(Component) {
    return function ComponentWithRouterProp(props) {
        let navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
}

const Account = (props) => {
    const { navigate } = props;

    const onClickLogOut = () => {
        Cookies.remove('jwt_token');
        navigate('/login');
    };

    return (
        <div className="account-container">
            <Header />
            <div className="account-details">
                <h1 className="account-heading">Account</h1>
                <hr />
                <div className="profile-details">
                    <p className="username">Username: </p>
                    <p className="password">Password: </p>
                </div>
                <hr />
                <div className="plan-details">
                    <p className="plan-heading">Plan Details</p>
                    <p className="plan">Premium</p>
                    <p className="ultra-hd">Ultra HD</p>
                </div>
                <hr />
                <button className="logout-button" type="button" onClick={onClickLogOut}>
                    Logout
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default withRouter(Account);
