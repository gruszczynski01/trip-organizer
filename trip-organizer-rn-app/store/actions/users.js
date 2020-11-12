// export const ADD_TRIP = "ADD_TRIP";
// export const EDIT_TRIP = "EDIT_TRIP";
// export const GET_USER_TRIP = "GET_USER_TRIP";
// export const GET_TRIP_MEMBERS = "GET_TRIP_MEMBERS";
// export const DELETE_TRIP = "DELETE_TRIP";
export const GET_SEARCHED_USERS = "GET_SEARCHED_USERS";

import { auth, database } from "../../firebase";
// import trips from "../reducers/trips";

export const getSearchedUsers = (statement) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    let wordsArray = statement.split(" ");
    console.log("wordsArray");
    console.log(wordsArray);
    // uzyc mapy, gdzie key bylby id i a w val object tak by nie dodwac dwa razy tego samoego
    // srpawdzic dlaczego zwraca więcej niz te co sie zaczynaja od
    var searchedUsers = new Set();
    // let searchedUsers = [];
    wordsArray.forEach(async (word) => {
      console.log("SLOWO:");
      console.log(word);
      const responseEmail = await database
        .ref("users")
        .orderByChild("email")
        .startAt(word)
        .endAt(word + "\uf8ff")
        .once("value")
        .then(async function (users) {
          users.forEach((user) => {
            searchedUsers.add(user);
          });
        });
      const responseName = await database
        .ref("users")
        .orderByChild("name")
        .startAt(word)
        .endAt(word + "\uf8ff")
        .once("value")
        .then(async function (users) {
          users.forEach((user) => {
            searchedUsers.add(user);
          });
        });
      const responseSurname = await database
        .ref("users")
        .orderByChild("surname")
        .startAt(word)
        .endAt(word + "\uf8ff")
        .once("value")
        .then(async function (users) {
          users.forEach((user) => {
            searchedUsers.add(user);
          });
        });
    });
    console.log("SZUKANI");
    console.log(Array.from(searchedUsers));
    dispatch({
      type: GET_SEARCHED_USERS,
      searchedUser: Array.from(searchedUsers),
    });
  };
};

// export const addTrip = (
//   tripName,
//   tripDestination,
//   tripBeginning,
//   tripEnding
// ) => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//     const newToDoListKey = database.ref().child("toDoLists").push().key;

//     const newTripKey = database.ref().child("trips").push().key;

//     var updates = {};
//     updates["trips/" + newTripKey] = {
//       owner: userId,
//       name: tripName,
//       destination: tripDestination,
//       tripBeginning: tripBeginning,
//       tripEnding: tripEnding,
//       members: [{ userId: {} }],
//       to_do_list: newToDoListKey,
//       events: {},
//     };
//     updates["toDoLists/" + newToDoListKey] = {
//       tripParent: newTripKey,
//       tasks: [],
//     };
//     database.ref().update(updates);

//     database
//       .ref()
//       .child("trips/" + newTripKey + "/members/" + userId)
//       .set(0);

//     database
//       .ref()
//       .child("users/" + userId + "/userTrips/" + newTripKey)
//       .set(0);

//     //te dwa pushe mozna przerobic do tablicy updates

//     dispatch({
//       type: ADD_TRIP,
//       tripData: {
//         id: newTripKey,
//         owner: userId,
//         name: tripName,
//         destination: tripDestination,
//         tripBeginning: tripBeginning,
//         tripEnding: tripEnding,
//         members: [{ userId: {} }],
//         toDoList: newToDoListKey,
//         events: {},
//       },
//       toDoListData: { tripParent: newTripKey, tasks: [] },
//     });
//   };
// };

// export const editTrip = (
//   tripId,
//   tripName,
//   tripDestination,
//   tripBeginning,
//   tripEnding
// ) => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//     var updates = {};
//     updates["trips/" + tripId + "/name"] = tripName;
//     updates["trips/" + tripId + "/destination"] = tripDestination;
//     updates["trips/" + tripId + "/tripBeginning"] = tripBeginning;
//     updates["trips/" + tripId + "/tripEnding"] = tripEnding;

//     database.ref().update(updates);

//     dispatch({
//       type: EDIT_TRIP,
//       tripData: {
//         id: tripId,
//         name: tripName,
//         destination: tripDestination,
//         tripBeginning: tripBeginning,
//         tripEnding: tripEnding,
//       },
//     });
//   };
// };

// export const getTrips = () => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//     let userTrips = [];

//     const response = await database
//       .ref("users/" + userId + "/userTrips")
//       .once("value")
//       .then(async function (dataSnapshot) {
//         const data = JSON.parse(JSON.stringify(dataSnapshot));
//         for (var key in data) {
//           if (data.hasOwnProperty(key)) {
//             const tripId = key;
//             const nestedResponse = await database
//               .ref("trips/" + tripId)
//               .once("value")
//               .then(function (dataSnapshot) {
//                 console.log(dataSnapshot);
//                 userTrips.push({
//                   ...JSON.parse(JSON.stringify(dataSnapshot)),
//                   id: tripId,
//                 });
//               });
//           }
//         }
//       });
//     dispatch({
//       type: GET_USER_TRIP,
//       tripsData: userTrips,
//     });
//   };
// };

// export const deleteTrip = (tripId) => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//     var tripToDeleteRef = await database
//       .ref("trips/" + tripId)
//       .remove()
//       .then(function () {
//         console.log("Remove succeeded.");
//       })
//       .catch(function (error) {
//         console.log("Remove failed: " + error.message);
//       });

//     tripToDeleteRef = await database
//       .ref("users/" + userId + "/userTrips/" + tripId)
//       .remove()
//       .then(function () {
//         console.log("Remove succeeded.");
//       })
//       .catch(function (error) {
//         console.log("Remove failed: " + error.message);
//       });

//     dispatch({
//       type: DELETE_TRIP,
//       tripId: tripId,
//     });
//   };
// };

// export const getTripMembers = (tripId) => {
//   return async (dispatch, getState) => {
//     console.log("ACTRON TRIPS _ GET MEMBERS");
//     let tripMembersArray = [];

//     const response = await database
//       .ref("trips/" + tripId + "/members")
//       .once("value")
//       .then(async function (tripMembersDS) {
//         const data = JSON.parse(JSON.stringify(tripMembersDS));
//         for (var key in data) {
//           if (data.hasOwnProperty(key)) {
//             const userId = key;
//             const userTripState = data[key];
//             const nestedResponse = await database
//               .ref("users/" + userId)
//               .once("value")
//               .then(function (user) {
//                 console.log({
//                   ...JSON.parse(JSON.stringify(user)),
//                   id: userId,
//                 });
//                 tripMembersArray.push({
//                   ...JSON.parse(JSON.stringify(user)),
//                   id: userId,
//                   ifChoosen: false,
//                   ifActive: userTripState,
//                 });
//               });
//           }
//         }
//       });

//     console.log("tripMembers");
//     console.log(tripMembersArray);
//     dispatch({
//       type: GET_TRIP_MEMBERS,
//       tripMembers: tripMembersArray,
//     });
//   };
// };
