import React from "react";
import { Link } from "react-router-dom";

import ProfileForm from "../components/ProfileForm";

const Profile = () => {
  return (
    // <Cover title="Registration">
      <div className="registration__wrapper">
        <h2 className="page__header">Profile</h2>
        <ProfileForm />
        <Link to="/">Home</Link>
      </div>
    // </Cover>
  );
};

export default Profile;
