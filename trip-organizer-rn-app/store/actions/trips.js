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

    // const response = await database.ref("trips/" + newTripKey).set(
    //   {
    //     owner: userId,
    //     name: tripName,
    //     destination: tripDestination,
    //     tripBeginning: tripBeginning,
    //     tripEnding: tripEnding,
    //     members: [userId],
    //     to_do_list: newToDoListKey,
    //     events: [],
    //   },
    //   function (error) {
    //     if (error) {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/trips.js: Something went wrong with saving new trip to database"
    //       );
    //     } else {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/trips.js: Trip has been saved in database"
    //       );
    //     }
    //   }
    // );

    // const response = await database.ref("toDoLists/" + newToDoListKey).set(
    //   {
    //     tripParent: newTripKey,
    //     tasks: [],
    //   },
    //   function (error) {
    //     if (error) {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/trips.js: Something went wrong with saving new toDoList to database"
    //       );
    //     } else {
    //       console.log(
    //         "LOG: trip-organizer-rn-app/store/actions/trips.js: toDoList has been saved in database"
    //       );
    //     }
    //   }
    // );

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

    //updates["trips/" + newTripKey + "/members/" + userId] = "";

    database
      .ref()
      .child("users/" + userId + "/userTrips")
      .push(newTripKey);
    // updates["users/" + userId + "/userTrips/" + newTripKey] = "";

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
//
// analogiczny przyklad na dodanie tripa
//
// function writeNewPost(uid, username, picture, title, body) {
//     // A post entry.
//     var postData = {
//       author: username,
//       uid: uid,
//       body: body,
//       title: title,
//       starCount: 0,
//       authorPic: picture
//     };

//     // Get a key for a new Post.
//     var newPostKey = firebase.database().ref().child('posts').push().key;

//     // Write the new post's data simultaneously in the posts list and the user's post list.
//     var updates = {};
//     updates['/posts/' + newPostKey] = postData;
//     updates['/user-posts/' + uid + '/' + newPostKey] = postData;

//     return firebase.database().ref().update(updates);
//   }

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
