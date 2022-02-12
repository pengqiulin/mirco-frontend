import { createStore } from "redux";

const reducer = (state={}, action) => {
  switch (action.type) {
    default:
      return state;
    // 设置 count
    case "SET_COUNT":
      console.log("是否有改变state",action);
      return {
        ...state,
        count: action.payload,
      };
  }
};

const store = createStore(reducer)

export default store;