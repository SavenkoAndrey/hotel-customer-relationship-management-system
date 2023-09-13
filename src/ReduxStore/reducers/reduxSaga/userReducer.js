import {
  FETCH_USER,
  LOAD_USER_DATA_SUCCESS,
  LOAD_USER_DATA_FAILURE,
  FETCH_ROOM,
  LOAD_ROOM_DATA_SUCCESS,
  LOAD_ROOM_DATA_FAILURE,
} from "./actions";

const initialState = {
  userData: null,
  roomData: {},
  loadingUserData: false,
  loadingRoomData: false,
  userDataError: null,
  roomDataError: null,
};

export function rootReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, loadingUserData: true, userDataError: null };
    case LOAD_USER_DATA_SUCCESS:
      return { ...state, userData: action.payload, loadingUserData: false };
    case LOAD_USER_DATA_FAILURE:
      return { ...state, loadingUserData: false, userDataError: action.error };
    case FETCH_ROOM:
      return { ...state, loadingRoomData: true, roomDataError: null };
    case LOAD_ROOM_DATA_SUCCESS:
      const roomData = action.payload.reduce((acc, room) => {
        acc[room.id] = room;
        return acc;
      }, {});
      return { ...state, roomData, loadingRoomData: false };
    case LOAD_ROOM_DATA_FAILURE:
      return { ...state, loadingRoomData: false, roomDataError: action.error };
    default:
      return state;
  }
}
