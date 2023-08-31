import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { NewUser, User } from "../types/User";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { createNewUser } from "../redux/reducers/usersReducer";
import {toast} from "react-toastify"

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const { users } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: NewUser) => {
    if (users.find((user) => user.email === data.email)) {
      alert("The registered email has been existed!");
      return;
    }
    const newUser = { ...data };
    dispatch(createNewUser(newUser)).then(() => toast.success("User has been created")).catch((error) => {
      console.error(error)
      toast.error("Failed to create new user")
    });
    navigate("/login");
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your first name"
          {...register("firstName", { required: true })}
        />
        {errors.firstName && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your last name"
          {...register("lastName", { required: true })}
        />
        {errors.lastName && (
          <span className="form--error">This field is required!</span>
        )}
      </div>
      <div className="form__group">
        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && (
          <span className="form--error">
            This field is required to put a valid email!
          </span>
        )}
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your phone number"
          {...register("phoneNumber")}
        />
        {errors.email && (
          <span className="form--error">
            This field is required to put a valid email!
          </span>
        )}
      </div>
      <div className="form__group">
        <input
          type="text"
          placeholder="Enter your address"
          {...register("address")}
        />
        {errors.email && (
          <span className="form--error">
            This field is required to put a valid email!
          </span>
        )}
      </div>
      <div className="form__group">
        <input
          minLength={6}
          type="password"
          placeholder="Enter your password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && (
          <span className="form--error">
            This field is required to put a password with more than 7 characters
          </span>
        )}
      </div>
      <div className="form__group">
        <input
          type="url"
          placeholder="Enter url of your photo"
          {...register("avatar", { required: true, minLength: 8 })}
        />
        {errors.avatar && (
          <span className="form--error">
            This field is required to put an url of photo address
          </span>
        )}
      </div>
      <button type="submit" className="form__button">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
