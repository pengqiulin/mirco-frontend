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
  
  class SharedModule {
    static shared = new Shared();
  
    /**
     * 重载 shared
     */
    static overloadShared(shared) {
      SharedModule.shared = shared;
    }
  
    /**
     * 获取 shared 实例
     */
    static getShared() {
      return SharedModule.shared;
    }
  }
  
  export default SharedModule;