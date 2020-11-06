export const ADD_EVENT = "ADD_EVENT";
export const EDIT_EVENT = "EDIT_EVENT";
export const GET_TRIP_EVENTS = "GET_TRIP_EVENTS";
export const DELETE_EVENT = "DELETE_EVENT";

import { auth, database } from "../../firebase";
// import trips from "../reducers/trips";

export const addEvent = (
  eventName,
  eventDesc,
  eventDate,
  eventTime,
  tripParent
) => {
  return async (dispatch, getState) => {
    const newEventKey = database.ref().child("events").push().key;

    var updates = {};
    updates["events/" + newEventKey] = {
      title: eventName,
      description: eventDesc,
      date: eventDate,
      time: eventTime,
    };
    updates["trips/" + tripParent + "/events/" + newEventKey] = 1;
    database.ref().update(updates);

    //te dwa pushe mozna przerobic do tablicy updates

    dispatch({
      type: ADD_EVENT,
      eventData: {
        title: eventName,
        description: eventDesc,
        date: eventDate,
        time: eventTime,
      },
    });
  };
};

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

export const getEvents = (tripId) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    let tripEvents = [];

    const response = await database
      .ref("trips/" + tripId + "/events")
      .once("value")
      .then(async function (dataSnapshot) {
        const data = JSON.parse(JSON.stringify(dataSnapshot));
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            const eventId = key;
            const nestedResponse = await database
              .ref("events/" + eventId)
              .once("value")
              .then(function (dataSnapshot) {
                console.log(dataSnapshot);
                tripEvents.push({
                  ...JSON.parse(JSON.stringify(dataSnapshot)),
                  id: eventId,
                });
              });
          }
        }
      });
    console.log("ACTION EVENTS:");
    console.log(tripEvents);

    dispatch({
      type: GET_TRIP_EVENTS,
      tripEvents: tripEvents,
    });
  };
};

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

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
