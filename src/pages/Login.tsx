import React, { ChangeEvent, FormEvent, useState, useEffect, useMemo, createContext, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import '../assets/styles/styles.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { login, logout } from '../redux/reducers/usersReducer';
import { User } from '../types/User';
import useAppDispatch from '../hooks/useAppDispatch';
import LoginForm from "../components/LoginForm";
import ProfileForm from '../components/ProfileForm';


const Login = () => {
    const [loginString,setLoginString] = useState(localStorage.getItem("loginUser")) 
    const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [profile, setProfile] = useState<User | null>(null);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch: AppDispatch = useAppDispatch();
    
    const handleLogout = () => {
        dispatch(logout())
        localStorage.setItem("loginUser","")
        navigate("/login")
    }

    useEffect(() => {
        if (loginUser && loginUser.firstName !== undefined) {
          // User is logged in, you can clear user data and logout here
          localStorage.setItem("loginUser",""); 
          dispatch(logout()); // Dispatch the logout action from your Redux slice
          setLoginUser(null); // Reset the loginUser state to null
        }
      }, [loginUser, dispatch]);

    return (
        <div style={{marginTop:100}}>
            {/* {
                (loginUser !== null && loginUser.firstName !== undefined) &&
                <ProfileForm />
               
            } */}
            {
                (!loginUser || loginUser.firstName === undefined) &&
                
                <div className="form__wrapper">
                    <h2 className="page__header">Login</h2>
                    <LoginForm />
                    <Link to="/register">Sign-on</Link>
                </div>
            }
        </div>
    );
}

export default Login;