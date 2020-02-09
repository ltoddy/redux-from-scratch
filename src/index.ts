function cloneDeep(obj: any): any {
  if (obj == null || typeof obj !== "object") {
    return obj;
  }

  return JSON.parse(JSON.stringify(obj));
}

export type ReduxState = any;

export type Action = {
  type: string,
  payload?: any,
};

export type Reducer = (state: ReduxState, action: Action) => ReduxState;

export type DispatchFunction = (action: Action) => void;

export type Subscriber = (currentState: ReduxState, prevState: ReduxState) => void;

export type SubscribeFunction = (subscriber: Subscriber) => void;

export type UnsubscribeFunction = (subscriber: Subscriber) => void;

export type GetStateFunction = () => ReduxState;

export type ReduxStore = {
  dispatch: DispatchFunction,
  subscribe: SubscribeFunction,
  unsubscribe: UnsubscribeFunction,
  getState: GetStateFunction,
};

export function createStore(reducer: Reducer): ReduxStore {
  let currentState: ReduxState;
  const subscribers: Array<Subscriber> = [];

  function dispatch(action: Action): void {
    const prevState = currentState;
    currentState = reducer(cloneDeep(currentState), action);

    subscribers.forEach(subscriber => {
      subscriber(currentState, prevState);
    });
  }

  function subscribe(subscriber: Subscriber): void {
    subscribers.push(subscriber);
  }

  function unsubscribe(subscriber: Subscriber): void {
    subscribers.splice(subscribers.indexOf(subscriber), 1);
  }

  function getState(): ReduxState {
    return cloneDeep(currentState);
  }

  return {
    dispatch,
    subscribe,
    unsubscribe,
    getState,
  };
}

type Reducers = { [key: string]: Reducer };

export function combineReducers(reducers: Reducers): Reducer {
  return function (state: ReduxState = {}, action: Action): ReduxState {
    const ret: ReduxState = {};
    Object.keys(reducers).forEach((key: string) => {
      const reducer = reducers[key];
      ret[key] = reducer(state[key], action);
    });
    return ret;
  };
}
