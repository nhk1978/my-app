import React, { useReducer, useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, GlobalState  } from '../redux/store';
import { useNavigate  } from 'react-router-dom';

import usersReducer, { fetchAllUsers, deleteUser, updateOneUser, sortByEmail, RootState } from "../redux/reducers/usersReducer";
// import withLoading from './withLoading'
import { User } from '../types/User'
import '../index.css'



const UserList = () => {
  const [data, setData] = useState<User[]> ([])
  // const users = useSelector((initialState: GlobalState) => initialState.usersReducer.users);
  const loading = useSelector((initialState: GlobalState) => initialState.users.loading);
  const [sort, setSort] = useState<"asc" | "desc">("asc")
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers({page: 1,per_page: 15})).then((action) => {
      if (action.payload && typeof action.payload !== "string") {
        setData(action.payload as User[]);
      }
    });   
  }, [dispatch]);

  /* setEditedUser((prevState) => ({
    ...prevState,
    [name]: value,
  })); */

  const handleEditUser = (user:User) => {
    // history.push(`/user/${user.id}`, { user });
    navigate(`/user`, { state:{ user }}); // Redirect to user detail page
  };

  const handleDeleteUser = (user:User) => {
    dispatch(deleteUser(user.id));
  };

  const handleCreateUser = () =>{
    navigate(`/createnewuser`); // Redirect to profile page
  }

  const handleSortByEmail = () => {
    const newSort = sort === "asc" ? "desc" : "asc";
    setSort(newSort); 
    dispatch(sortByEmail(sort))    
    // setData(useSelector((initialState: GlobalState ) => initialState.users))
  }

  /* useEffect(() => {
    const sortedUsers = [...users].sort((a, b) => a.email.localeCompare(b.email));
    setData(sortedUsers);
  }, [users]); */

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
      <div>
        <button onClick={() => handleCreateUser()}>Create User</button>
          <table className="table-container">
            <thead>
              <tr>
                <th>User</th>
                <th> <a href="#" onClick={() => handleSortByEmail()} >Email</a></th>
                <th>ID</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.id}</td>
                  <td>{item.role}</td>
                  <td>
                    <div className="button-container">
                      {/* <Link to={`/user/${item.id}`}>Edit</Link> */}
                      <button onClick={() => handleEditUser(item)}>Edit</button>
                      <button onClick={() => handleDeleteUser(item)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>        
          
    </div>
  )
}

export default UserList
/* const UserListWithLoading = withLoading(UserList, "https://api.escuelajs.co/api/v1/users")

export default UserListWithLoading */