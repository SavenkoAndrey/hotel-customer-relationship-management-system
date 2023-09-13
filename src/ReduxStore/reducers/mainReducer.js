const initialState = {
  isOpen: false,
  accept: false,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_NOTIFICARION":
      return {
        ...state,
        isOpen: true,
      };
    case "CLOSE_NOTIFICATION":
      return {
        ...state,
        isOpen: false,
      };
    default:
      return state;
  }
};
