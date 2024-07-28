import React from "react";
import styles from "./header.module.css";

function Header() {
  const redirectRegister = () => {
    window.location.href = "/#/register";
  };

  const redirectLogin = () => {
    window.location.href = "/#/login";
  };

  const redirectMain = () => {
    window.location.href = "/";
  };

  const handleGetStarted = () => {
    if (window.location.pathname === "/register") {
      redirectLogin(); 
    } else {
      redirectRegister(); 
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftDiv} onClick={redirectMain}>
        GameON </div>
      <div className={styles.rightDiv}>
        <p onClick={redirectMain}> Home </p>
        <p>About Us</p>
        <button className="submitButton" onClick={handleGetStarted}>
          Get Started </button>
      </div>
    </div>
  );
}

export default Header;
