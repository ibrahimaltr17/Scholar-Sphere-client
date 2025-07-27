import React, { useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';
import useAxiosPublic from '../hooks/axiosPublic';
// import { GoogleAuthProvider } from 'firebase/auth/web-extension';

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true)

  const axiosPublic = useAxiosPublic()

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  };

  const signInUser = (email, password) => {
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password);
  };

  const forgetPass = (email) => {
    return sendPasswordResetEmail(auth, email)
  }


  const providerGoogle = new GoogleAuthProvider();

  const googleLogIn = () => {
    return signInWithPopup(auth, providerGoogle);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData)
  }

  const removeUser = (user) => {
    return deleteUser(user);
  };


  const logOut = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🚀 ~ unsubscribe ~ currentUser:", currentUser);

      if (currentUser) {
        axiosPublic
          .post("/users", {
            email: currentUser.email,
            role: "user",
            loginCount: 1,
          })
          .then((res) => {
            setUser(currentUser);
            console.log(res.data);
          });
      }

      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);


  const authData = {
    user,
    loading,
    setLoading,
    createUser,
    signInUser,
    forgetPass,
    googleLogIn,
    updateUser,
    removeUser,
    logOut,
  }

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
};

export default AuthProvider;