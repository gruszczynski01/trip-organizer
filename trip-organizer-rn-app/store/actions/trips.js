export const ADD_TRIP = "ADD_TRIP";
export const EDIT_TRIP = "EDIT_TRIP";
export const GET_USER_TRIP = "GET_USER_TRIP";
export const DELETE_TRIP = "DELETE_TRIP";

import { auth, database } from "../../firebase";
import trips from "../reducers/trips";

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
      .child("trips/" + newTripKey + "/members")
      .push(userId);

    database
      .ref()
      .child("users/" + userId + "/userTrips")
      .push(newTripKey);

    //te dwa pushe mozna przerobic do tablicy updates

    dispatch({
      type: ADD_TRIP,
      tripData: {
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

export const getTrips = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    let userTrips = [];

    const response = await database
      .ref("users/" + userId + "/userTrips")
      .once("value")
      .then(async function (dataSnapshot) {
        // console.log("DS:");
        // console.log(dataSnapshot);
        const data = JSON.parse(JSON.stringify(dataSnapshot));
        // console.log(data);
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            // console.log(key + " -> " + data[key]);
            const tripId = data[key];

            const nestedResponse = await database
              .ref("trips/" + tripId)
              .once("value")
              .then(function (dataSnapshot) {
                // console.log("DS2:");
                // console.log(dataSnapshot);
                userTrips.push({
                  ...JSON.parse(JSON.stringify(dataSnapshot)),
                  id: tripId,
                });
              });
          }
        }
      });
    console.log("UT:");
    console.log(userTrips);

    dispatch({
      type: GET_USER_TRIP,
      tripsData: userTrips,
    });
  };
};

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
