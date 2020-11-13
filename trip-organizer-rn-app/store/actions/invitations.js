export const ADD_INVITATION = "ADD_INVITATION";
export const EDIT_INVITATION = "EDIT_INVITATION";
export const GET_USER_INVITATIONS = "GET_USER_INVITATIONS";
export const DELETE_INVITATION = "DELETE_INVITATION";

import { auth, database } from "../../firebase";
// import trips from "../reducers/trips";

export const addInvitation = (
  trip,
  tripName,
  sender,
  senderName,
  receiver,
  sendTimestamp
) => {
  return async (dispatch, getState) => {
    const newInvitationKey = database.ref().child("invitations").push().key;

    var updates = {};
    updates["invitations/" + newInvitationKey] = {
      trip: trip,
      tripName: tripName,
      sender: sender,
      senderName: senderName,
      receiver: receiver,
      sendTimestamp: sendTimestamp,
    };
    updates[
      "users/" + receiver + "/receivedInvitations/" + newInvitationKey
    ] = 1;
    updates["trips/" + trip + "/members/" + receiver] = 0;
    database.ref().update(updates);

    dispatch({
      type: ADD_INVITATION,
      invitationData: {
        trip: trip,
        tripName: tripName,
        sender: sender,
        senderName: senderName,
        receiver: receiver,
        sendTimestamp: sendTimestamp,
      },
    });
  };
};

// export const editTask = (
//   taskId,
//   taskName,
//   taskDescription,
//   taskIfDone,
//   taskOwnerId
// ) => {
//   return async (dispatch, getState) => {
//     var updates = {};
//     updates["tasks/" + taskId + "/name"] = taskName;
//     updates["tasks/" + taskId + "/description"] = taskDescription;
//     updates["tasks/" + taskId + "/ifDone"] = taskIfDone;
//     updates["tasks/" + taskId + "/owner"] = taskOwnerId;

//     database.ref().update(updates);

//     dispatch({
//       type: EDIT_TASK,
//       taskData: {
//         id: taskId,
//         name: taskName,
//         description: taskDescription,
//         ifDone: taskIfDone,
//         owner: taskOwnerId,
//       },
//     });
//   };
// };

// export const getTasks = (toDoListId) => {
//   return async (dispatch, getState) => {
//     let toDoListTasks = [];

//     const response = await database
//       .ref("toDoLists/" + toDoListId + "/tasks")
//       .once("value")
//       .then(async function (dataSnapshot) {
//         const data = JSON.parse(JSON.stringify(dataSnapshot));
//         for (var key in data) {
//           if (data.hasOwnProperty(key)) {
//             const taskId = key;
//             const nestedResponse = await database
//               .ref("tasks/" + taskId)
//               .once("value")
//               .then(async function (dataSnapshot) {
//                 const taskData = JSON.parse(JSON.stringify(dataSnapshot));
//                 const secondNestedResponse = await database
//                   .ref("users/" + taskData.owner)
//                   .once("value")
//                   .then(async function (user) {
//                     const userData = JSON.parse(JSON.stringify(user));
//                     toDoListTasks.push({
//                       ...JSON.parse(JSON.stringify(dataSnapshot)),
//                       id: taskId,
//                       ownerName: userData.name + " " + userData.surname,
//                       showDetails: false,
//                     });
//                   });
//               });
//           }
//         }
//       });

//     dispatch({
//       type: GET_TRIP_TASKS,
//       toDoListTasks: toDoListTasks,
//     });
//   };
// };

// export const deleteTask = (taskId, taskToDoListId) => {
//   return async (dispatch, getState) => {
//     var tripToDeleteRef = await database
//       .ref("tasks/" + taskId)
//       .remove()
//       .then(function () {
//         console.log("Remove succeeded.");
//       })
//       .catch(function (error) {
//         console.log("Remove failed: " + error.message);
//       });

//     tripToDeleteRef = await database
//       .ref("toDoLists/" + taskToDoListId + "/tasks/" + taskId)
//       .remove()
//       .then(function () {
//         console.log("Remove succeeded.");
//       })
//       .catch(function (error) {
//         console.log("Remove failed: " + error.message);
//       });

//     dispatch({
//       type: DELETE_TASK,
//       taskId: taskId,
//     });
//   };
// };

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
