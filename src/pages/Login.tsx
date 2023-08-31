import React, { ChangeEvent, FormEvent, useState, useEffect, useMemo, createContext, useContext } from 'react';
import axios from 'axios';
import '../assets/styles/styles.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login } from '../redux/reducers/usersReducer';
import { User } from '../types/User';
import useAppDispatch from '../hooks/useAppDispatch';
import LoginForm from "../components/LoginForm";


const Login = () => {
    const [loginString,setLoginString] = useState(localStorage.getItem("loginUser")) 
    const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch: AppDispatch = useAppDispatch();
    //   const [loginUser, setLoginUser] = useState<User | null>(null)
    // const { accessToken, refreshToken, setAccessToken, setRefreshToken } = useContext(AuthContext);

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async (event: FormEvent) => {
        //localStorage.clear()
        localStorage.setItem("loginUser","")
        console.log("user: "+ email + " pass: " +password)
        dispatch(login({ email, password })).then((action) => {
            if (action.payload && typeof action.payload !== "string") {
                setLoginString(localStorage.getItem("loginUser"))
                setLoginUser(loginString && loginString !=='' ? JSON.parse(loginString) : null)
                console.log("user: "+ JSON.stringify(loginUser))
                // localStorage.setItem("loginUser",JSON.stringify(loginUser))
                // loginUser = action.payload as User
                // navigate("/profile") // Redirect to profile page
            } else
                setError('Login Error: ' + action.payload + '. Please login again');
        })
    };
    const handleLogout = () => {
        localStorage.setItem("loginUser","")
    }

    return (
        <div style={{marginTop:100}}>
            {
                loginUser &&
                <div>
                    <h2>Profile</h2>
                    <button className='loginButton' onClick={handleLogout}>Logout</button>
                    <p>Name: {loginUser ? loginUser.name : ""}</p>
                    <p>Email: {loginUser ? loginUser.email : ""}</p>
                    <img src={loginUser?.avatar} alt="" />
                </div>
            }
            {
                !loginUser &&
                // <div  className='loginContainer'>
                //     <div className='loginDiv'>
                //         <h2>Login Page</h2>
                //         <label className='formLabel'>Username:</label>
                //         <input className='formControl'
                //             type="text"
                //             value={email}
                //             onChange={handleUsernameChange}
                //         />
                //     </div>
                //     <div className='loginDiv'>
                //         <label className='formLabel'>Password:</label>
                //         <input className='formControl'
                //             type="password"
                //             value={password}
                //             onChange={handlePasswordChange}
                //         />
                //     </div>
                //     {error && <div>{error}</div>}
                //     <button className='loginButton' onClick={handleLogin}>Login</button>
                // </div>
                <div className="form__wrapper">
                <h2 className="page__header">Login</h2>
                <LoginForm />
                <Link to="/register">Not have an account yet? Create one!</Link>
                </div>
            }
        </div>
    );
}

export default Login;
export { };