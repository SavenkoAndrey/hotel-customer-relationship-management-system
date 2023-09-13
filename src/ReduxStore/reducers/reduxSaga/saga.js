import { put, takeEvery, call } from 'redux-saga/effects';
import {
  FETCH_USER,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILURE,
  FETCH_ROOM,
  LOAD_ROOM_DATA_SUCCESS,
  LOAD_ROOM_DATA_FAILURE,
} from './actions';

import { db } from '../../../DataBase/firebase';
import { collection } from 'firebase/firestore/lite';

// Replace 'fetchUserDataFromFirebase' with your actual Firebase data loading function.
function* loadUserData() {
  try {
    const userData = yield call(collection(db, 'Accounts'));
    yield put({ type: LOAD_USER_DATA_SUCCESS, payload: userData });
  } catch (error) {
    yield put({ type: LOAD_USER_DATA_FAILURE, error });
  }
}

export function* watchLoadUserData() {
  yield takeEvery(FETCH_USER, loadUserData);
}

// for loading room data 

function* loadRoomData() {
  try {
    const roomData = yield call(collection(db, 'Rooms'));
    yield put({ type: LOAD_ROOM_DATA_SUCCESS, payload: roomData });
  } catch (error) {
    yield put({ type: LOAD_ROOM_DATA_FAILURE, error });
  }
}

export function* watchLoadRoomData() {
  yield takeEvery(FETCH_ROOM, loadRoomData);
}