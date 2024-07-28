import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase"; 
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Styles from "./passwordReset.module.css";
import { collection, query, where, getDocs } from "firebase/firestore";

function ForgotPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailVal = e.target.email.value;

    try {
      // Check if the email exists in Firestore
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", emailVal));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Email address not found. Please check your email or register.");
        return;
      }

      // If email exists, send password reset email
      await sendPasswordResetEmail(auth, emailVal);
      alert("Password reset email sent. Check your email inbox!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="mainDiv">
      <Header />
      <div className="innerGrid">
        <div className="leftSection" style={{ gridTemplateRows: "min-content", marginTop: "0vh" }}>
          <div style={{ border: "2px solid #633172", padding: "5vh", width: "80%" }}>
            <form onSubmit={(e) => handleSubmit(e)}>
              <h1>Forgot Password</h1>
              <div className={Styles.labelInputContainer}>
                <label style={{ display: "flex", alignItems: "center", margin: "0.5vh 1.5vh" }}>Email Address</label>
                <input style={{ border: "2px solid #633172" }} name="email" type="text" placeholder="Enter your email" />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" className="submitButton">Reset</button>
            </form>
          </div>
        </div>
        <div className="rightSection"></div>
      </div>
    </div>
  );
}

export default ForgotPassword;
