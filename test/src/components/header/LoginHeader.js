import React, { useState } from "react";
import styles from "./header.module.css";
import { auth } from "../firebase";

function LoginHeader({height}) {
  const redirectMain = () => {
    window.location.href = "/#/home";
  };
  const redirectLogout = () => {
    window.location.href = "/";
  };
  const redirectProgress = () => {
    window.location.href = "/#/progress";
  };

  const redirectProfile = () => {
    window.location.href = "/#/profile";
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      redirectLogout();
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
      <div className={styles.header} style={{padding:`${height}vh  5vw`}}>
        <div className={styles.leftDiv} onClick={redirectMain}>
          GameON </div>
        <div className={styles.rightDiv}>
          <p onClick={redirectMain}> Home </p>
          <p onClick={redirectProgress}> Progress </p>
          <p onClick={redirectProfile}> Profile </p>
          <p onClick={handleLogout}> Logout </p>
        </div>
      </div>
  );
}

export default LoginHeader;
