import React, { useState, useEffect } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";
import DynamicForm from "../DynamicForm/dynamicForm";

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oobCode, setOobCode] = useState(""); 
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      setOobCode(params.get("oobCode") || "");
    }, []);
  
    const handleResetPassword = async (event) => {
      event.preventDefault(); 
  
      try {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }
  
        await confirmPasswordReset(auth, oobCode, password);
        alert("Password reset successful!"); 
        navigate("/login");
      } catch (error) {
        alert("Password reset failed. Please try again."); 
        console.error(error);
      }
    };
  
    const formProps = {
      inputKeys: ["password", "confirmPassword"],
      labels: {
        password: "Password",
        confirmPassword: "Confirm Password",
      },
      inputTypes: {
        password: "password",
        confirmPassword: "password",
      },
      values: {
        password: password,
        confirmPassword: confirmPassword,
      },
      columns: 1,
      inputWidth: 100,
      onChangeHandlers: {
        password: (value) => setPassword(value),
        confirmPassword: (value) => setConfirmPassword(value),
      },
      placeholders: {
        password: "Enter password",
        confirmPassword: "Enter password again",
      },
      validationRules: {}, 
    };
  
    return (
      <div className="mainDiv">
        <Header />
        <div className="innerGrid">
          <div className="leftSection">
            <div style={{ border: "2px solid #633172", padding: "5vh", width: "80%" }}>
              <form onSubmit={handleResetPassword}>
                <h3>Reset Password</h3>
                <DynamicForm {...formProps} />
                <div style={{ display: "flex", justifyContent: "space-between", margin: "3vh 2vw 0vh 2vw" }}>
                  <button className="submitButton" type="submit">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="rightSection"></div>
        </div>
      </div>
    );
  }
  

export default ResetPassword;
