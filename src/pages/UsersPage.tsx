import React from 'react'
import { Link } from 'react-router-dom'
import UserList from '../components/UserList'


const UsersPage = () => {
  return (
    <div>
      <h1>User Page</h1>
      <UserList />
    </div>
  )
}

export default UsersPage