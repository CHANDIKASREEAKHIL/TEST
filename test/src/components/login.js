import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import { toast } from "react-toastify";
import SignInwithGoogle from "./signInWIthGoogle";
import DynamicForm from "./DynamicForm/dynamicForm";
import Header from "./header/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("User logged in Successfully", {
        position: "top-center",
      });
      setTimeout(() => {
        window.location.href = "/#/home";
      }, 1000);
    } catch (error) {
      console.log(error);
      toast.error("Error occured in User login", {
        position: "top-center",
      });
    } finally {
      setIsDisabled(false);
    }
  };

  const formProps = {
    inputKeys: ["email", "password"],
    labels: {
      email: "Email Address",
      password: "Password",
    },
    inputTypes: {
      email: "text",
      password: "password",

    },
    values: {
      email: email,
      password: password,
    },
    columns: 1,
    inputWidth: 100,
    onChangeHandlers: {
      email: (value) => setEmail(value),
      password: (value) => setPassword(value),
    },
    placeholders: {
      email: "Enter email",
      password: "Enter password",
    },
    validationRules: {}, 
  };

  return (
    <div className="mainDiv">
   <Header />
    <div className="innerGrid" 
    // style={{gridTemplateColumns:"3fr 2fr"}}
    >
    <div className="leftSection" style={{gridTemplateRows:"min-content", marginTop:"0vh"}}>
      <div style={{border: "2px solid #ac7474", padding:"5vh", width:"80%"}}>
      <form onSubmit={handleSubmit}>
      <h3>Login</h3>
      <DynamicForm {...formProps}/>

      <div style={{display:"flex", justifyContent:"space-between", margin:"3vh 2vw 0vh 2vw"}}>
      <p className="forgot-password text-right">
       <a style={{color:"white", textDecoration: "none"}} href="/forgotPassword"> Forgot Password? </a>
      </p>
        <button className="submitButton" type="submit" disabled={isDisabled}>
                  {isDisabled ? 'Loggin In...' : 'LogIn'}
        </button>
      </div>
      <SignInwithGoogle/>
    </form>
  </div>
    </div>
    <div className="rightSection">

    </div>
    </div>
  </div>
    
  );
}

export default Login;
