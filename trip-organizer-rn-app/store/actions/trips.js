export const ADD_TRIP = "ADD_TRIP";
export const EDIT_TRIP = "EDIT_TRIP";
export const GET_USER_TRIP = "GET_USER_TRIP";
export const DELETE_TRIP = "DELETE_TRIP";

import { auth, database } from "../../firebase";
// import trips from "../reducers/trips";

export const addTrip = (
  tripName,
  tripDestination,
  tripBeginning,
  tripEnding
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    const newToDoListKey = database.ref().child("toDoLists").push().key;

    const newTripKey = database.ref().child("trips").push().key;

    var updates = {};
    updates["trips/" + newTripKey] = {
      owner: userId,
      name: tripName,
      destination: tripDestination,
      tripBeginning: tripBeginning,
      tripEnding: tripEnding,
      members: [{ userId: {} }],
      to_do_list: newToDoListKey,
      events: {},
    };
    updates["toDoLists/" + newToDoListKey] = {
      tripParent: newTripKey,
      tasks: [],
    };
    database.ref().update(updates);

    database
      .ref()
      .child("trips/" + newTripKey + "/members/" + userId)
      .set(0);

    database
      .ref()
      .child("users/" + userId + "/userTrips/" + newTripKey)
      .set(0);

    //te dwa pushe mozna przerobic do tablicy updates

    dispatch({
      type: ADD_TRIP,
      tripData: {
        id: newTripKey,
        owner: userId,
        name: tripName,
        destination: tripDestination,
        tripBeginning: tripBeginning,
        tripEnding: tripEnding,
        members: [{ userId: {} }],
        toDoList: newToDoListKey,
        events: {},
      },
      toDoListData: { tripParent: newTripKey, tasks: [] },
    });
  };
};

export const editTrip = (
  tripId,
  tripName,
  tripDestination,
  tripBeginning,
  tripEnding
) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    var updates = {};
    updates["trips/" + tripId + "/name"] = tripName;
    updates["trips/" + tripId + "/destination"] = tripDestination;
    updates["trips/" + tripId + "/tripBeginning"] = tripBeginning;
    updates["trips/" + tripId + "/tripEnding"] = tripEnding;

    database.ref().update(updates);

    dispatch({
      type: EDIT_TRIP,
      tripData: {
        id: tripId,
        name: tripName,
        destination: tripDestination,
        tripBeginning: tripBeginning,
        tripEnding: tripEnding,
      },
    });
  };
};

export const getTrips = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    let userTrips = [];

    const response = await database
      .ref("users/" + userId + "/userTrips")
      .once("value")
      .then(async function (dataSnapshot) {
        const data = JSON.parse(JSON.stringify(dataSnapshot));
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            const tripId = key;
            const nestedResponse = await database
              .ref("trips/" + tripId)
              .once("value")
              .then(function (dataSnapshot) {
                console.log(dataSnapshot);
                userTrips.push({
                  ...JSON.parse(JSON.stringify(dataSnapshot)),
                  id: tripId,
                });
              });
          }
        }
      });
    dispatch({
      type: GET_USER_TRIP,
      tripsData: userTrips,
    });
  };
};

export const deleteTrip = (tripId) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    var tripToDeleteRef = await database
      .ref("trips/" + tripId)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    tripToDeleteRef = await database
      .ref("users/" + userId + "/userTrips/" + tripId)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    dispatch({
      type: DELETE_TRIP,
      tripId: tripId,
    });
  };
};

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
