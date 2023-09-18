import React, { useEffect, useState } from "react";
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
  const [editMode, setEditMode] = useState(false);
  const loginString = localStorage.getItem("loginUser");
  const [loginUser, setLoginUser] = useState<User | null>( null );
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("login str: "+ loginString);
    // if(loginString !== undefined)  navigate("/login");
    if(loginString !== "")  
    {
        try {
          const parsedLoginUser = loginString ? JSON.parse(loginString) : "";
          setLoginUser(parsedLoginUser);
          setEditedUser(parsedLoginUser);
        } catch (error) {
          // Handle the error if JSON parsing fails
        //   console.error('Error parsing JSON:', error);
        }
    }
    else navigate("/login");
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevState: User | null) => ({
      ...prevState!,
      [name]: value,
    }));
  };
  
  const onSubmit = async (data: UpdateUser) => {    
    const updatedUser: UserUpdate = {
      id: editedUser !== null && editedUser.id ? editedUser.id : "",
      update: data 
    };
    // updateUser.id = editedUser.id;
    // updatedUser.email = editedUser.email ? editedUser.email  : "";

    // console.log("user: "+ JSON.stringify(updatedUser))
    const user = (await (await dispatch(updateUser(updatedUser))).payload as User);
    localStorage.setItem("loginUser", JSON.stringify(user));
    setEditedUser(user);
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
