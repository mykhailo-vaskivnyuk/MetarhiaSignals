module.exports = class Store {
  state = {};
  #keys = [];
  #subscribers = new Map();
  #onChange = null;
  #parent = null;

  constructor({ state, keys, onStateChange }) {
    this.state = state;
    this.#keys = keys;
    this.#onChange = onStateChange;
    for (const value of Object.values(state)) {
      if(value instanceof Store) value.setParent(this);
    }
  }

  #_onStateChange() {
    if (!this.#onChange) return;
    this.#onChange(this.#subscribers, this.state);
    return this;
  }

  setParent(parent) {
    this.#parent = parent;
    return this;
  }

  subscribe(key, cb) {
    const needCheck = this.#keys.length > 0;
    if (!needCheck || this.#keys.includes(key)) {
      this.#subscribers.set(key, cb);
    } else {
      throw new Error(`Subscriber [ ${key} ] is not allowed`);
    }
    return () => this.#subscribers.delete(key);
  }

  setState(newState) {
    let changed = false;
    for (const [key, value] of Object.entries(newState)) {
      if (!(key in this.state)) continue;
      if (this.state[key] === value) continue;
      changed = true;
      this.state[key] = value;
    }
    if (changed) this.change();;
    return this;
  }

  change() {
    this.#_onStateChange();
    this.#parent?.change();
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
