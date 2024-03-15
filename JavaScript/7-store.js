module.exports = class Store {
  state = {};
  #keys = [];
  #subscribers = new Map();
  #onChange = null;
  #parent = null;

  constructor(state, keys) {
    this.state = state;
    this.#keys = keys;
    for (const value of Object.values(state)) {
      if(value instanceof Store) value.setParent(this);
    }
  }

  setParent(parent) {
    this.#parent = parent;
    return this;
  }

  subscribe(key, cb) {
    if (!this.#keys.includes(key)) return;
    this.#subscribers.set(key, cb);
    return () => this.#subscribers.delete(key);
  }

  onStateChange(cb) {
    this.#onChange = () => cb(this.#subscribers, this.state);
    return this;
  }

  setState(value) {
    let newState = value;
    if (typeof value === 'function') {
      newState = value(this.state);
    }
    if (this.state === newState) return;
    this.state = newState;
    if (!this.#onChange) return;
    this.#onChange();
    this.#parent?.update();
    return this;
  }

  update() {
    this.setState({ ...this.state });
    return this;
  }

  getState() {
    const state = {};
    for (const [key, value] of Object.entries(this.state)) {
      if (value instanceof Store) {
        Object.assign(state, { [key]: value.getState() });
      } else {
        Object.assign(state, { [key]: value });
      }
    }
    return state;
  }
}
