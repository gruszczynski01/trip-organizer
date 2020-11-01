export const ADD_TRIP = "ADD_TRIP";
export const EDIT_TRIP = "EDIT_TRIP";
export const GET_USER_TRIP = "GET_USER_TRIP";
export const DELETE_TRIP = "DELETE_TRIP";

import { auth, database } from "../../firebase";

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

    let userTripsIds = [];

    database
      .ref("users/" + userId + "/userTrips")
      .once("value")
      .then(function (dataSnapshot) {
        console.log("DS:");
        console.log(dataSnapshot);
        // dataSnapshot.forEach((element) => {
        //   console.log(element.val);
        // });
      });

    // const videosToFetch = ["23423lkj234", "20982lkjbba"];
    // Map the Firebase promises into an array
    // const tripsPromises = userTripsIds.map((id) => {
    //   return databaseRef
    //     .child("trips")
    //     .child(id)
    //     .on("value", (s) => s);
    // });
    // // Wait for all the async requests mapped into
    // // the array to complete
    // Promise.all(tripsPromises)
    //   .then((trips) => {
    //     // do something with the data
    //   })
    //   .catch((err) => {
    //     // handle error
    //   });

    dispatch({
      type: GET_USER_TRIP,
      tripsData: {},
    });
  };
};

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
