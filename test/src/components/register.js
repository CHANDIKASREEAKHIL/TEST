import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc, getDocs, query, where, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import "./mainPage.css";
import DynamicForm from "./DynamicForm/dynamicForm";
import Header from "./header/Header";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [username, setUsername] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      // Check if the username is available
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        toast.error("Username is already taken. Please choose another one.", {
          position: "top-center",
        });
        setIsDisabled(false);
        return;
      }

      // Proceed with user registration
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          dateOfBirth: dob,
          username: username,
          photo: "",
        });
      }
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });
      setTimeout(() => {
        window.location.href = "/#/login";
      }, 1000);
    } catch (error) {
      console.error("Error registering user:", error.message);
      toast.error("Failed to register user. Please try again later.", {
        position: "top-center",
      });
    } finally {
      setIsDisabled(false);
    }
  };

  const checkUsernameExists = async (username) => {
    try {
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking username:", error);
      return true; // Assume username exists on error to prevent registration
    }
  };

  const formProps = {
    inputKeys: ["username", "firstName", "lastName", "email", "password", "dob"],
    labels: {
      username: "Username",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      password: "Password",
      dob: "Date of Birth",
    },
    inputTypes: {
      username: "text",
      firstName: "text",
      lastName: "text",
      email: "text",
      password: "password",
      dob: "date",
    },
    values: {
      username: username,
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
      dob: dob,
    },
    columns: 1,
    inputWidth: 100,
    onChangeHandlers: {
      username: (value) => setUsername(value),
      firstName: (value) => setFname(value),
      lastName: (value) => setLname(value),
      email: (value) => setEmail(value),
      password: (value) => setPassword(value),
      dob: (value) => setDob(value),
    },
    placeholders: {
      username: "Enter username",
      firstName: "Enter First Name",
      lastName: "Enter Last Name",
      email: "Enter email",
      password: "Enter password",
      dob: "Select date",
    },
    validationRules: {},
  };

  return (
    <div className="mainDiv">
      <Header />
      <div className="innerGrid">
        <div className="leftSection" style={{ gridTemplateRows: "min-content", marginTop: "0vh" }}>
          <div style={{ border: "2px solid #ac7474", padding: "2vh", width: "80%" }}>
            <form onSubmit={handleRegister}>
              <h3> Register </h3>
              <DynamicForm {...formProps} />
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2vh 2vw 0vh 2vw" }}>
                <p className="forgot-password text-right">
                  Already registered? Then <a style={{ color: "white", fontWeight: "900", textDecoration: "none" }} href="/login">Login</a>
                </p>
                <button className="submitButton" type="submit" disabled={isDisabled}>
                  {isDisabled ? 'Signing Up...' : 'Sign Up'}
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

export default Register;
