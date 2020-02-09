import { createStore, Action, ReduxState, ReduxStore, combineReducers } from "./index";

describe("#redux", () => {
  it("should get null state when create store without dispatch action", () => {
    function reducer(state: ReduxState, action: Action): ReduxState {
      return state;
    }

    const store: ReduxStore = createStore(reducer);
    const state: ReduxState = store.getState();

    expect(state).toBe(undefined);
  });

  it("should refresh state when dispatch action", () => {
    function userReducer(state: ReduxState, action: Action): ReduxState {
      if (action.type == "USER") {
        return {
          ...state,
          user: {
            name: "tom",
            age: 20,
          }
        };
      }
      return state;
    }

    const store: ReduxStore = createStore(userReducer);
    store.dispatch({ type: "USER" });
    const state: ReduxState = store.getState();

    expect(state).toHaveProperty("user", { name: "tom", age: 20 });
  });

  it("should refresh partial state when dispatch action given combined reducer", () => {
    function userReducer(state: ReduxState, action: Action): ReduxState {
      if (action.type === "USER") {
        return {
          ...state,
          name: "tom",
          age: 20,
        };
      }
      return state;
    }

    function itemsReducer(state: ReduxState, action: Action): ReduxState {
      if (action.type === "ITEMS") {
        return [...state, "hello world"];
      }
      return state;
    }

    const reducer = combineReducers({
      user: userReducer,
      items: itemsReducer,
    });
    const store = createStore(reducer);

    store.dispatch({ type: "USER" });
    const state: ReduxState = store.getState();

    expect(state).toHaveProperty("user", { name: "tom", age: 20 });
  });
});
