import { AUTH } from "./action";

const initialState = {
  auth: null,
  data: null,
};

export default reducers = (state = initialState, action) => {
  switch (action.type) {
    case AUTH:
      return { ...state, auth: action.Authdata };
    default:
      return state;
  }
};
