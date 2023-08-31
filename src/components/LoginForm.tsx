import React, { useState } from "react";

import useAppDispatch from "../hooks/useAppDispatch";
import { login } from "../redux/reducers/usersReducer";
import { toast } from 'react-toastify';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(login({ email, password })).then(() => toast.success("Success log in"));
  //   setEmail("");
  //   setPassword("");
  // };
  const handleLogin = async (event: React.FormEvent) => {
    //localStorage.clear()
    localStorage.setItem("loginUser","")
    console.log("user: "+ email + " pass: " +password)
    dispatch(login({ email, password })).then((action) => toast.success("Success log in"))
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
