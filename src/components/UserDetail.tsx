/* import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUser, getUser } from "../redux/reducers/usersReducer";
import { User } from "../types/User";
import { AppDispatch } from "../redux/store";
import { useParams } from "react-router-dom";


const UserDetail = () => {  
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const dispatch: AppDispatch = useDispatch();


  useEffect(() => {
    const fetchUser = async () => {
      const actionResult = await dispatch(getUser( parseInt(id === undefined ? "" : id) ));
      if (getUser.fulfilled.match(actionResult)) {
        setUser(actionResult.payload);
      }
    };  
    fetchUser();
  }, [dispatch, id]);

  
  const handleDeleteUser = (user:User) => {
    dispatch(deleteUser(user));
  };  

  return (
    user && (
      <div>
        <p>Name: { user.name }</p>
        <p>Email: { user.email }</p>
        <button onClick={() => handleDeleteUser(user)}>Delete</button>
      </div>
      )  
  )
}

export default UserDetail;
 */

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { User } from "../types/User";
import { deleteUser, getUser, updateUser, updateOneUser } from "../redux/reducers/usersReducer";
import { UserUpdate } from "../types/UserUpdate";
import { unwrapResult } from "@reduxjs/toolkit";

const UserDetail = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  
  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    // console.log("handlesave user: "+JSON.stringify(editedUser))
    // const id = 2; // The user ID you want to update
    const userUpdate: UserUpdate = {
      id: editedUser.id,
      update: {
        name: editedUser.name,
        email:editedUser.email,
        password:editedUser.password,
        avatar:editedUser.avatar,
        role: editedUser.role
      }};
    try {
      // const result = await dispatch(updateOneUser({id: user.id, update: editedUser}))
      const actionResult  = await dispatch(updateUser( userUpdate) as any)
      const result = unwrapResult(actionResult);
      console.log('Update user result:', result);
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setEditMode(false);
  };

  const handleDelete = () => {
    console.log('handle delete ');
    // dispatch(deleteUser(user.id));
  };

  const handleBack = () => {
    console.log('handle back ');
    // Implement your logic to navigate back to the user list page
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      {editMode ? (
        <form>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={editedUser?.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={editedUser?.email}
              onChange={handleInputChange}
            />
          </label>
          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
      ) : (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <button onClick={handleBack}>Back</button>
    </div>
  );
};

export default UserDetail;
