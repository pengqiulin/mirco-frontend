import store from "./store";

class Shared {
  /**
   * 获取 Count
   */
 getCount(){
    const state = store.getState();
    return state.count || 0;
  }

  /**
   * 设置 count
   */
  setCount(count){
    // 将 count 的值记录在 store 中
    store.dispatch({
      type: "SET_COUNT",
      payload: count
    });
  }
}

const shared = new Shared();
export default shared;