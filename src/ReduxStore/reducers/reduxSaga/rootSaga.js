import { all } from "redux-saga/effects";
import { watchLoadRoomData, watchLoadUserData } from "./saga";

export function* rootWatcher() {
  yield all([watchLoadUserData(), watchLoadRoomData()]);
}
