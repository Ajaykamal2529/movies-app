import {Component} from 'react'
import Cookies from 'js-cookie'
import {useNavigate, Navigate} from 'react-router-dom'
import './index.css'
function withRouter(Component) {
    return function ComponentWithRouterProp(props) {
      let navigate = useNavigate();
      return <Component {...props} navigate={navigate} />;
    };
  }

class Login extends Component {
    state ={
        username: '',
        password: '',
        isCheckedPassword: false,
        errorMsg: '',
        showErrorMsg: false
    } 

    onChangeUsername = event => {
        this.setState({username: event.target.value})
    }

    onChangePassword = event => {
        this.setState({password: event.target.value})
    }

    onSubmitSuccess = jwtToken => {
        Cookies.set('jwt_token', jwtToken, {expires:1})
        this.props.navigate('/')
    }

    onSubmitFailure = errorMsg => {
        this.setState({showErrorMsg: true, errorMsg})
    }

    submitForm = async event  => {
        event.preventDefault()
        const {username, password} = this.state 
        const UserDetails = {username, password}
        const url = 'https://apis.ccbp.in/login'
        const options  = {
            method: 'POST',
            body: JSON.stringify(UserDetails)
        } 
        const response = await fetch(url, options)
        const data = await response.json()
        if (response.ok === true){
            this.onSubmitSuccess(data.jwt_token)
        }else{
            this.onSubmitFailure(data.error_msg)
        }
    }

    onShowPassword = () => {
        this.setState(prevState => ({isCheckedPassword: !prevState.isCheckedPassword}))
    }

    render() {
        const {username, password, isCheckedPassword, showErrorMsg, errorMsg} = this.state || {} 
        const jwtToken = Cookies.get('jwt_token')
        if( jwtToken !== undefined){
            return <Navigate to='/' />
        }
        return (
            <div className='login-form-container'>
                <form className='form-container' onSubmit={this.submitForm}>
                <h1 className='login-heading'>Login</h1>
                    <div className='input-container'>
                        <label htmlFor='username' className='input-label'>
                            Username
                        </label>
                        <input 
                        type='text'
                        id='username'
                        className='input-field'
                        placeholder='Username'
                        value={username}
                        onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className='input-container'>
                        <label htmlFor='password' className='input-label'>
                            Password
                        </label>
                        <input 
                        type= {isCheckedPassword ? 'text' : 'password'}
                        id='password'
                        className='input-field'
                        placeholder='Password'
                        value={password}
                        onChange={this.onChangePassword}
                        />
                    </div>
                    <div className='show-hide-container'>
                        <input className='show-password-checkbox'
                        id='showPassword'
                        type='checkbox'
                        checked={isCheckedPassword}
                        onChange={this.onShowPassword} />
                        <label htmlFor='showPassword' className='show-password-label'>
                            Show Password
                        </label>
                    </div>
                    <button className='login-button' type='submit'>
                        Login
                    </button>
                    {showErrorMsg && <p className='error-msg'>* {errorMsg}</p>}
                </form>
            </div>
        )
    }
}

export default withRouter(Login)