import { createStore, Action, ReduxState, ReduxStore } from './index';

describe('#redux', () => {
  it('should get null state when create store without dispatch action', () => {
    function reducer(state: ReduxState, action: Action) {
      return state;
    }

    const store: ReduxStore = createStore(reducer);
    const state: ReduxState = store.getState();

    expect(state).toBe(undefined);
  });

  it('should refresh state when dispatch action', () => {
    function userReducer(state: ReduxState, action: Action) {
      if (action.type == 'USER') {
        return {
          ...state,
          user: {
            name: 'tom',
            age: 20,
          }
        }
      }
      return state;
    }

    const store: ReduxStore = createStore(userReducer);
    store.dispatch({ type: 'USER' });
    const state: ReduxState = store.getState();

    expect(state).toHaveProperty('user', { name: 'tom', age: 20 });
  });
});
