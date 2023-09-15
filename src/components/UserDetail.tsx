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
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        // email:editedUser.email,
        avatar:editedUser.avatar,
        // password:editedUser.password,
        // role: editedUser.role,
        // dateOfBirth: editedUser.dateOfBirth
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
              value={editedUser?.firstName}
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
          <p>Name: {user.firstName}</p>
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
