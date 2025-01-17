import { AsyncStorage } from "react-native";

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = "AUTHENTICATE";
export const SAVE_USER = "SAVE_USER";
export const EDIT_USER = "EDIT_USER";
export const LOGOUT = "LOGOUT";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";
import { auth, database } from "../../firebase";

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
  console.log("Saving userData to AsyncStorage");
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
    const response = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        const errorId = errorResData.error.message;
        if (errorCode == "auth/weak-password") {
          message = "The password is too weak.";
        } else if (errorCode == "auth/operation-not-allowed") {
          message = "Operation not allowed.";
        } else if (errorCode == "auth/invalid-email") {
          message = "Email address is not valid.";
        } else if (errorCode == "auth/email-already-in-use") {
          message = "Address email already in use";
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
    dispatch(addUserToDatabase(resData.user.uid, email, name, surname));
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
    console.log("LOGGIN RESPONSE");
    console.log(resData);
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
    saveDataToStorage(
      resData.user.stsTokenManager.accessToken,
      resData.user.uid,
      expirationDate
    );
    dispatch(getLoggedUser());
    // dispatch({
    //   type: SAVE_USER,
    //   loggedUser: {
    //     id: resData.user.uid,
    //     email: email,
    //     name: name,
    //     surname: surname,
    //   },
    // });
  };
};

const addUserToDatabase = (id, email, name, surname) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const response = await database.ref("users/" + userId).set(
      {
        email: email,
        name: name,
        surname: surname,
      },
      function (error) {
        if (error) {
          console.log(
            "LOG: trip-organizer-rn-app/store/actions/auth.js: Something went wrong with saving new user to database"
          );
        } else {
          console.log(
            "LOG: trip-organizer-rn-app/store/actions/auth.js: Token has been saved in database"
          );
        }
      }
    );
    dispatch({
      type: SAVE_USER,
      loggedUser: {
        id: userId,
        email: email,
        name: name,
        surname: surname,
      },
    });
  };
};
export const getLoggedUser = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    let loggedUser = null;
    const response = await database
      .ref("users/" + userId)
      .once("value")
      .then(async function (user) {
        loggedUser = user.toJSON();
        loggedUser["id"] = user.key;
      });

    dispatch({
      type: SAVE_USER,
      loggedUser: {
        id: loggedUser.id,
        email: loggedUser.email,
        name: loggedUser.name,
        surname: loggedUser.surname,
      },
    });
  };
};
export const editUser = (id, email, name, surname) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    var updates = {};
    updates["users/" + userId + "/name"] = name;
    updates["users/" + userId + "/surname"] = surname;
    database.ref().update(updates);

    // const response = await database.ref("users/" + userId).set(
    //   {
    //     name: name,
    //     surname: surname,
    //   },
    //   function (error) {
    //     if (error) {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/auth.js: Something went wrong with editing user to database"
    //       );
    //     } else {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/auth.js: User has been edited in database"
    //       );
    //     }
    //   }
    // );
    dispatch({
      type: EDIT_USER,
      editedUser: {
        id: id,
        email: email,
        name: name,
        surname: surname,
      },
    });
  };
};

export const deleteAccount = () => {
  return async (dispatch, getState) => {
    await auth.currentUser
      .delete()
      .then(function () {
        console.log("Deleted");
      })
      .catch(function (error) {
        console.log("Sth went wrong");
      });
    dispatch({
      type: LOGOUT,
    });
  };
};
