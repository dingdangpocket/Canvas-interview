/**
 *
 * @param {} state  仓库数据
 * @param {*} action  通知对象
 * @returns
 */

export type countActionType = {
  type: string;
  payload: number;
};

export default function reducer(state = 10, action: countActionType) {
  switch (action.type) {
    case "increment":
      return {
        count: (state += action.payload),
      };
    case "decrement":
      return {
        count: (state -= action.payload),
      };
    default:
      return state;
  }
}
