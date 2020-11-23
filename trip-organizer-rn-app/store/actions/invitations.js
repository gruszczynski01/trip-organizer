export const ADD_INVITATION = "ADD_INVITATION";
export const ACCEPT_INVITATION = "ACCEPT_INVITATION";
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
    //# 1
    updates["invitations/" + newInvitationKey] = {
      trip: trip,
      tripName: tripName,
      sender: sender,
      senderName: senderName,
      receiver: receiver,
      sendTimestamp: sendTimestamp,
    };
    //# 2
    updates[
      "users/" + receiver + "/receivedInvitations/" + newInvitationKey
    ] = 1;
    //# 3
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
export const deleteInvitation = (invitation) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    await database
      .ref("invitations/" + invitation.id)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    await database
      .ref("users/" + userId + "/receivedInvitations/" + invitation.id)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    await database
      .ref("trips/" + invitation.trip + "/members/" + userId)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    dispatch({
      type: DELETE_INVITATION,
      invitationId: invitation.id,
    });
  };
};

export const getUserInvitations = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    let userInvitations = [];

    const response = await database
      .ref("users/" + userId + "/receivedInvitations")
      .once("value")
      .then(async function (dataSnapshot) {
        const data = JSON.parse(JSON.stringify(dataSnapshot));
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            const invitationId = key;
            const nestedResponse = await database
              .ref("invitations/" + invitationId)
              .once("value")
              .then(function (dataSnapshot) {
                console.log(dataSnapshot);
                userInvitations.push({
                  ...JSON.parse(JSON.stringify(dataSnapshot)),
                  id: invitationId,
                });
              });
          }
        }
      });
    dispatch({
      type: GET_USER_INVITATIONS,
      userInvitations: userInvitations,
    });
  };
};

export const acceptInvitation = (invitation) => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    await database
      .ref("invitations/" + invitation.id)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    await database
      .ref("users/" + userId + "/receivedInvitations/" + invitation.id)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    await database
      .ref()
      .child("trips/" + invitation.trip + "/members/" + invitation.receiver)
      .set(1);

    await database
      .ref()
      .child("users/" + userId + "/userTrips/" + invitation.trip)
      .set(0);

    dispatch({
      type: ACCEPT_INVITATION,
      deletedInvitation: invitation.id,
    });
  };
};

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
