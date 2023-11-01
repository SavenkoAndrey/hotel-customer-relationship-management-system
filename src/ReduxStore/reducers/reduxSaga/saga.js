import { put, call, takeLatest } from "redux-saga/effects";

import { db } from "../../../DataBase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchUsersFailure, fetchUsersSuccess } from "./userReducer";
import { fetchRoomFailure, fetchRoomSuccess } from "./roomReducer";
import { FETCH_ROOM, FETCH_USER } from "./actions";


function* loadUserData() {

  try {
    const users = [];
    const fetchUsersRef = yield call(getDocs, collection(db, "Accounts"));
    
    fetchUsersRef.forEach((doc) => {
      users.push({...doc.data(), id: doc.id });
    });
    
    yield put(fetchUsersSuccess(users));
    // console.log(users);
  } catch (error) {
    yield put(fetchUsersFailure(error));
  }
}

// for loading room data

function* loadRoomData() {
  try {
    const fetchRoomRef = yield call(getDocs, collection(db, 'Rooms'));

    const roomData = [];
    fetchRoomRef.forEach((doc) => {
      roomData.push({...doc.data(), id: doc.id});
    });
    yield put(fetchRoomSuccess(roomData));
  } catch (error) {
    yield put(fetchRoomFailure(error));
  }
}

export function* watchLoadRoomData() {
  yield takeLatest(FETCH_ROOM, loadRoomData);
}
export function* watchLoadUserData() {
  yield takeLatest(FETCH_USER, loadUserData);
}




