import { all } from "redux-saga/effects";
import { userWatcher } from "./userSaga";
import { watchCloseNotification } from './saga';

export function* rootWatcher() {
  yield all([userWatcher(), watchCloseNotification()])
}