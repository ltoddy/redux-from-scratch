function cloneDeep(obj: any): any {
  if (obj == null || typeof obj !== "object") {
    return obj;
  }

  return JSON.parse(JSON.stringify(obj));
}

type ReduxState = any;

type Action = {
  type: string,
  payload?: any,
};

type DispatchFunction = (action: Action) => void;

type Subscriber = (currentState: ReduxState, prevState: ReduxState) => void;

type SubscribeFunction = (subscriber: Subscriber) => void;

type UnsubscribeFunction = (subscriber: Subscriber) => void;

type GetStateFunction = () => ReduxState;

type ReduxStore = {
  dispatch: DispatchFunction,
  subscribe: SubscribeFunction,
  unsubscribe: UnsubscribeFunction,
  getState: GetStateFunction,
};

export function createStore(reducer: any): ReduxStore {
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
