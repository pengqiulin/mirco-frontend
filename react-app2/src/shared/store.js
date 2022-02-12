import { createStore } from "redux";

const reducer = (state={}, action) => {
  switch (action.type) {
    default:
      return state;
    // 设置 Token
    case "SET_COUNT":
      return {
        ...state,
        count: action.payload,
      };
  }
};

const store = createStore(reducer)

export default store;