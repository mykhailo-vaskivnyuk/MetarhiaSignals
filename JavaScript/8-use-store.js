const Store = require('./7-store');

const store1 = (() => {
  const SUBSCRIBERS = ['component1', 'component2'];
  const INITIAL_STATE = { store1Prop: 100 };
  const handleStateChange = (subscribers, state) => {
    for (const [name, cb] of subscribers) {
      console.log('RUN SUBSCRIBER', 'STORE 1', name);
      cb(state);
    }
  };
  return new Store(INITIAL_STATE, SUBSCRIBERS)
    .onStateChange(handleStateChange);
})()

const store2 = (() => {
  const SUBSCRIBERS = ['component3', 'component4'];
  const INITIAL_STATE = { store2Prop: 200 };
  const handleStateChange = (subscribers, state) => {
    for (const [name, cb] of subscribers) {
      console.log('RUN SUBSCRIBER', 'STORE 2', name);
      cb(state);
    }
  };
  return new Store(INITIAL_STATE, SUBSCRIBERS)
    .onStateChange(handleStateChange);
})()

const storeMain = (() => {
  const SUBSCRIBERS = ['component5', 'component6'];
  const INITIAL_STATE = { storeMainProp: 500, store1, store2 };
  const handleStateChange = (subscribers, state) => {
    for (const [name, cb] of subscribers) {
      console.log('RUN SUBSCRIBER', 'STORE MAIN', name);
      cb(state);
    }
  };
  return new Store(INITIAL_STATE, SUBSCRIBERS)
    .onStateChange(handleStateChange);
})()

storeMain.state.store1.subscribe('component1', console.log);
storeMain.state.store1.subscribe('component2', console.log);
storeMain.state.store2.subscribe('component3', console.log);
storeMain.state.store2.subscribe('component4', console.log);
storeMain.subscribe('component5', console.log);
storeMain.subscribe('component6', console.log);

console.log('STORE MAIN STATE', storeMain.getState());
store1.setState({ store1Prop: 101 });
store2.setState({ store2Prop: 201 });
storeMain.setState((state) => ({ ...state, storeMainProp: 501 }));

console.log('STORE MAIN STATE', storeMain.getState());
