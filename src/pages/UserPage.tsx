import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import UserDetail from '../components/UserDetail'
import { useSelector } from 'react-redux'
import { GlobalState  } from '../redux/store'
import { User } from '../types/User'


const UserPage = () => {

// const user: User = useSelector((initialState: GlobalState ) => initialState.usersReducer.users.user); // Assuming 'user' is stored in the Redux store
// const users = useSelector((initialState: GlobalState) => initialState.usersReducer.users);

  const location = useLocation();
  const user = location.state?.user;
  
  return (
      <div>        
          <h1>User Detail Page</h1>
          {user && <UserDetail user={user} />}
    </div>
  )
}

export default UserPage