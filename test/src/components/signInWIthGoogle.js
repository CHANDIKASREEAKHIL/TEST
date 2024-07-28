import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import React from 'react';

function SignInwithGoogle() {
  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Update only if necessary fields are missing
          const userData = docSnap.data();
          if (!userData.firstName || !userData.lastName || !userData.photo) {
            await updateDoc(docRef, {
              firstName: userData.firstName || user.displayName.split(' ')[0],
              lastName: userData.lastName || user.displayName.split(' ')[1] || '',
              photo: userData.photo || user.photoURL,
              email: userData.email || user.email,
            });
          }
        } else {
          // Set initial data if user document doesn't exist
          await setDoc(docRef, {
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ')[1] || '',
            photo: user.photoURL,
            email: user.email,
          });
        }

        toast.success("User logged in Successfully", {
          position: "top-center",
        });

        window.location.href = "/#/home";
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google", {
        position: "top-center",
      });
    }
  }

  return (
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer"}}
        onClick={googleLogin}
      >
        <div style={{ border:"2px solid #ac7474", padding:"1vh 0vw"}}>
        <img src={require("../images/google.png")} alt="Google Icon" width={"6%"} />
        <span style={{paddingLeft:"2vw"}}> Sign in with Google</span>
        </div>
      </div>
    </div>
  );
}

export default SignInwithGoogle;
