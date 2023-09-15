import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { NewUser, UpdateUser, User } from "../types/User";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { createNewUser, getUser, updateUser } from "../redux/reducers/usersReducer";
import {toast} from "react-toastify"
import { UserUpdate } from "../types/UserUpdate";

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUser>();
  // const { users } = useAppSelector((state) => state.usersReducer);
  const [editMode, setEditMode] = useState(false);
  // const { users } = useAppSelector((state) => state.users);
  const loginString = localStorage.getItem("loginUser")
  const [loginUser, setLoginUser] = useState<User | null>(loginString ? JSON.parse(loginString) : null);
  const [editedUser, setEditedUser] = useState({ ...loginUser });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleEdit = () => {
    setEditMode(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const onSubmit = (data: UpdateUser) => {    
    const updatedUser: UserUpdate = {
      id: editedUser.id ? editedUser.id : "",
      update: data 
    };
    // updateUser.id = editedUser.id;
    // updatedUser.email = editedUser.email ? editedUser.email  : "";

    // console.log("user: "+ JSON.stringify(updatedUser))
    const user = dispatch(updateUser(updatedUser))
    .then(() => {
      toast.success("User has been updated");
      
    })
    .catch((error) => {
      // console.error(error)
      toast.error("Failed to update user")
    });
    console.log("user: "+ JSON.stringify(user));
    setEditMode(false);
    navigate("/profile");
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)} style={{alignSelf: "center", width:"800px"}}>
      <div className="form__group">
      <label className='user-profile--edit__section__header'>First Name:</label>
        {editMode && 
          <div className="form__group">            
            <input
              type="text"
              placeholder="First name"
              {...register("firstName", { required: true })}
            />
          </div>}
        {!editMode && <div className="form__group">
            <input
              type="text"
              name="lastname"
              value={editedUser?.firstName}
              onChange={handleInputChange}
            />
            </div>}
        {errors.firstName && (
          <span className="form--error">This field is required! &&&</span>
        )}
      </div>
      <div className="form__group">
        <label className='user-profile--edit__section__header'>Last Name:</label>
            
        {editMode && <input
          type="text"
          placeholder="Last name"
          {...register("lastName", { required: true })}
        />}
        {!editMode && <input
              type="text"
              name="lastName"
              value={editedUser?.lastName}
              onChange={handleInputChange}
            />}
        {errors.lastName && (
          <span className="form--error">This field is required! %%%</span>
        )}
      </div>
      {!editMode && 
      <div className="form__group">
        <label className='user-profile--edit__section__header'>Email:</label>            
        <input
              type="text"
              name="email"
              value={editedUser?.email}
              onChange={handleInputChange}
            />
      </div>}      
      {!editMode && <div className="form__group">
        <label className='user-profile--edit__section__header'>Date of Birth:</label>            
        <input
              type="text"
              name="dateOfBirth"
              value={editedUser?.dateOfBirth}
              onChange={handleInputChange}
            />        
      </div> }     
      <div className="form__group">
        <label className='user-profile--edit__section__header'>Avatar:</label>            
        {editMode && <input
          type="url"
          placeholder="Avatar URL"
          {...register("avatar", { required: true, minLength: 8 })}
        />}
        {!editMode && <input
              type="text"
              name="avatar"
              value={editedUser?.avatar}
              onChange={handleInputChange}
            />}
        {errors.avatar && (
          <span className="form--error">
            This field is required to put an url of photo address
          </span>
        )}
      </div>
      {!editMode &&  <div className="form__group">
        <label className='user-profile--edit__section__header'>Role:</label> 
        <input
              type="text"
              name="role"
              value={editedUser?.role}
              onChange={handleInputChange}
            />       
      </div>}
      <div style={{alignSelf: "center", width:"100px"}}>
        {!editMode && <button type="button" onClick={handleEdit} className="form__button">
          Edit
        </button>}
        {editMode && <button type="submit"  className="form__button">
          Update Profile
        </button>}
      </div>
    </form>
  );
};

export default ProfileForm;
