import React from "react";
import { Link } from "react-router-dom";

import Cover from "../components/Cover";
import RegisterForm from "../components/RegisterForm";

const Registration = () => {
  return (
    <Cover title="Registration">
      <div className="registration__wrapper">
        <h2 className="page__header">Registration</h2>
        <RegisterForm />
        <Link to="/login">Already had an account? Login!</Link>
      </div>
    </Cover>
  );
};

export default Registration;
