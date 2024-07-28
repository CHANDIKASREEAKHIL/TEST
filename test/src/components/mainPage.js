import React from "react";
import "./mainPage.css";
import Header from "./header/Header";

function Main() {
const redirectRegister = () => {
    window.location.href = "/#/register";
}
const redirectLogin = () => {
    window.location.href = "/#/login";
}
const redirectMain = () => {
    window.location.href = "/#/";
}

  return (
    <div className="mainDiv">
        <Header />
        <div className="innerGrid">
            <div className="leftSection">
                <div style={{textAlign:"start"}}>
                <h1>Game On, Brain On!</h1>
                <h1>Level Up Your</h1>
                <h1>Knowledge</h1>
                </div>
                <div style={{textAlign:"start"}}>
                <h5>
                Where Gaming Meets Trivia. Learn more while you </h5>
                <h5>play. For enhancing your active learning, Attempt our Quizzes </h5>
                <h5>and watch the increment in your progress.
                </h5>
                </div>
                <div style={{display:"flex", gap:"10vw"}}>
                <button className="submitButton" onClick={redirectRegister}>Registration</button>
                <button className="clickButton" onClick={redirectLogin}>Login Page</button>
                </div>
            </div>
            <div className="rightSection">
            </div>
        </div>
    </div>
  );
}

export default Main;
