const initialState = {
  isAuthenticated: false,
};

const authenticationReducer = (action, state = initialState) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authenticationReducer;
