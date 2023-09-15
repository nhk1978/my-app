import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserDetail from '../components/UserDetail'
import { useSelector } from 'react-redux'
import { GlobalState  } from '../redux/store'
import { User } from '../types/User'


const UserPage = () => {

// const user: User = useSelector((initialState: GlobalState ) => initialState.usersReducer.users.user); // Assuming 'user' is stored in the Redux store
// const users = useSelector((initialState: GlobalState) => initialState.usersReducer.users);

  const location = useLocation();
  // const user = location.state?.user;
  const loginString = localStorage.getItem("loginUser")
  const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);

  return (
      <div>        
          <h1>User Detail Page</h1>
          {loginUser && <UserDetail user={loginUser} />}
    </div>
  )
}

export default UserPage