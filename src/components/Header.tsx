import React, { useEffect, useState } from 'react'
import './Header.css'
import logo from '../assets/to.png';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { useSelector } from 'react-redux';
import { CartState } from '../redux/reducers/CartSlice';
import { AppDispatch, GlobalState } from '../redux/store';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import useAppDispatch from '../hooks/useAppDispatch';


const Header = () => {
    const cart = useSelector((state: GlobalState) => state.cart.cart)
    const loginString = localStorage.getItem("loginUser");
    const [loginUser, setLoginUser] = useState<User | null>(null);

    const navigate = useNavigate()
    // const dispatch: AppDispatch = useAppDispatch();

    const navigateToCart = () => {
        navigate("/cart")
    }
    useEffect(() => {
        if (loginString) {
            try {
              const parsedLoginUser = JSON.parse(loginString);
              setLoginUser(parsedLoginUser);
            } catch (error) {
              // Handle the error if JSON parsing fails
            //   console.error('Error parsing JSON:', error);
            }
          }
    }, []);
    const handleProfile = () => {
        if(loginUser === null || loginUser.firstName === undefined)
            navigate("/login")
        else
            navigate("/profile")
    }



    return (
        <>
            {(loginUser && loginUser.firstName && loginUser.firstName.length > 0) && <div className='header' >
                {/* Logo */}
                <div>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ backgroundColor: "#FFFFFF", width: 40, height: 40, marginTop: 10 }}
                    />
                </div>
                {/* Search bar */}
                <div className='headerInputContainer'
                    style={{ marginLeft: 'auto' }}>
                    <input className='headerInput' type="text" placeholder='Search items or products' />
                    <SearchOutlinedIcon style={{ color: "white", marginLeft: 4, marginTop: 5 }} />
                </div>
                <div >
                    <h4 className='headerText' onClick={handleProfile}>
                        {loginUser ? 'Hello ' + loginUser.firstName +' '+ loginUser.lastName : 'Login'}
                    </h4>
                    <h4 className='headerText'>Acount & List</h4>
                </div>

                {/* <div>
                    <h4 className='headerText'>Returns</h4>
                    <h4 className='headerText'>& Orders</h4>
                </div> */}
                <div onClick={() => navigateToCart()}
                    style={{
                        position: "relative",
                        cursor: "pointer"
                    }}>
                    <ShoppingCartOutlinedIcon style={{
                        color: "white",
                        marginRight: 4,
                        marginTop: 4
                    }} />
                    <span style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "white",
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: 400
                    }}>
                        {cart && cart.length > 0 ? cart.length : 0}
                    </span>
                </div>
                <div>
                    {/* Place and number */}
                    <Link className='headerText' to="/login">Logout</Link>
                </div>

            </div>
            }
            {
                (loginUser == null || !loginUser || !(loginUser.firstName)) && <div className='header' >
                    <div>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ backgroundColor: "#FFFFFF", width: 40, height: 40, marginTop: 10 }}
                        />
                    </div>
                    <div>
                    {/* Place and number */}
                    <Link className='headerText' to="/login">Login</Link>
                </div>
                </div>
            }
        </>
    )
}

export default Header