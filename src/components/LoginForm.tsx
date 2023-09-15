import React, { useState } from "react";

import useAppDispatch from "../hooks/useAppDispatch";
import { login } from "../redux/reducers/usersReducer";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (event: React.FormEvent) => {
    //localStorage.clear()
    localStorage.setItem("loginUser","")
    // console.log("user: "+ email + " pass: " +password)
    const userInfo = await dispatch(login({ email, password })).then((action) => toast.success("Success log in")).catch((error) => {
      console.error(error)
      toast.error("Failed to create new user")
    });
    // localStorage.setItem("loginUser", JSON.stringify(userInfo as User))
    console.log("userInfo: " +userInfo)           
    // console.log("uloginUser: " +localStorage.getItem("loginUser"))
    navigate("/");
  };
  return (
    <form className="form">
      <div className="form__section">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form__section">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="full-width-button__primary"
        type="button"
        onClick={handleLogin}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
