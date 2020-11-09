export const ADD_TASK = "ADD_TASK";
export const EDIT_TASK = "EDIT_TASK";
export const GET_TRIP_TASKS = "GET_TRIP_TASKS";
export const DELETE_TASK = "DELETE_TASK";

import { auth, database } from "../../firebase";
// import trips from "../reducers/trips";

export const addTask = (taskName, taskDescription, toDoList) => {
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

export const editTask = (
  taskId,
  taskName,
  taskDescription,
  taskIfDone,
  taskOwnerId
) => {
  return async (dispatch, getState) => {
    var updates = {};
    updates["tasks/" + taskId + "/name"] = taskName;
    updates["tasks/" + taskId + "/description"] = taskDescription;
    updates["tasks/" + taskId + "/ifDone"] = taskIfDone;
    updates["tasks/" + taskId + "/owner"] = taskOwnerId;

    database.ref().update(updates);

    dispatch({
      type: EDIT_TASK,
      taskData: {
        id: taskId,
        name: taskName,
        description: taskDescription,
        ifDone: taskIfDone,
        owner: taskOwnerId,
      },
    });
  };
};

export const getTasks = (toDoListId) => {
  return async (dispatch, getState) => {
    let toDoListTasks = [];

    const response = await database
      .ref("toDoLists/" + toDoListId + "/events")
      .once("value")
      .then(async function (dataSnapshot) {
        const data = JSON.parse(JSON.stringify(dataSnapshot));
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            const taskId = key;
            const nestedResponse = await database
              .ref("tasks/" + taskId)
              .once("value")
              .then(async function (dataSnapshot) {
                const taskData = JSON.parse(JSON.stringify(dataSnapshot));
                const secondNestedResponse = await database
                  .ref("users/" + taskData.owner)
                  .once("value")
                  .then(async function (user) {
                    const userData = JSON.parse(JSON.stringify(user));
                    toDoListTasks.push({
                      ...JSON.parse(JSON.stringify(dataSnapshot)),
                      id: taskId,
                      ownerName: userData.name + " " + userData.surname,
                      showDetails: false,
                    });
                  });
              });
          }
        }
      });

    dispatch({
      type: GET_TRIP_TASKS,
      toDoListTasks: toDoListTasks,
    });
  };
};

export const deleteEvent = (eventId, tripId) => {
  return async (dispatch, getState) => {
    var tripToDeleteRef = await database
      .ref("events/" + eventId)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    eventToDeleteRef = await database
      .ref("trips/" + tripId + "/events/" + eventId)
      .remove()
      .then(function () {
        console.log("Remove succeeded.");
      })
      .catch(function (error) {
        console.log("Remove failed: " + error.message);
      });

    dispatch({
      type: DELETE_EVENT,
      eventId: eventId,
    });
  };
};

// Artykuł jak pobierac dane tripy dla jednego usera
// https://medium.com/@justintulk/how-to-query-arrays-of-data-in-firebase-aa28a90181bad
//
