import { fetchUsersFailure, setUsers } from "./userReducer";
import { put, takeEvery, call } from "redux-saga/effects";
import { FETCH_USER } from "./actions";

function* fetchUserWorker() {
  try {
    const response = yield call(
      fetch,
      "https://jsonplaceholder.typicode.com/users?_limit=5"
    );
    const data = yield response.json();
    yield put(setUsers(data));
  } catch (error) {
    yield put(fetchUsersFailure(error));
  }
}

export function* userWatcher() {
  yield takeEvery(FETCH_USER, fetchUserWorker);
}
