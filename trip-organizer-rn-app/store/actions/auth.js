import { AsyncStorage } from "react-native";

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
import { auth } from "../../firebase";

let timer;

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer); //js function
  }
};
export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};
const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
export const signup = (email, password, name, surname) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBr4f8mBJ1Era_ZF1hfWT1tQ41BZrkA_sE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnScureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json;
      const errorId = errorResData.error.message;
      let message = "Something wend wrong!";
      if (errorId === "EMAIL_EXIST") {
        message = "This email exists already!";
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    dispatch(addUserToDatabase(resData.localId, email, name, surname));
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await auth
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          message = "Wrong password.";
        } else if (errorCode === "auth/invalid-email") {
          message = "Invalid email.";
        } else if (errorCode === "auth/user-disabled") {
          message = "User disabled.";
        } else if (errorCode === "auth/user-not-found") {
          message = "User not found.";
        } else {
          message = errorMessage;
        }
        throw new Error(message);
      });

    const resData = await JSON.parse(JSON.stringify(response));
    dispatch(
      authenticate(
        resData.user.uid,
        resData.user.stsTokenManager.accessToken,
        parseInt(resData.user.stsTokenManager.expirationTime) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() +
        parseInt(resData.user.stsTokenManager.expirationTime) * 1000
    );
    saveDataToStorage(resData.user.uid, resData.user.uid, expirationDate);
  };
};

const addUserToDatabase = (id, email, name, surname) => {
  return async (dispatch, getState) => {
    console.log(
      `ID: ${id}, email: ${email}, name: ${name}, surname: ${surname}`
    );
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://trip-organizer-2020.firebaseio.com/users/${id}.json?auth=${token}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          surname,
        }),
      }
    );

    // if (!response.ok) {
    //   const errorResData = await response.json;
    //   console.log(errorResData);
    // }
    const resData = await response.json();
    console.log("resData: " + resData);
    // dispatch({
    //   type: ADD_USER,
    //   userData: {
    //     id,
    //     email,
    //     name,
    //     surname,
    //   },
    // });
  };
};
