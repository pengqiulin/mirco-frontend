import { initGlobalState } from "qiankun";

const initialState = {
    count:0
};
const actions= initGlobalState(initialState);

export default actions;