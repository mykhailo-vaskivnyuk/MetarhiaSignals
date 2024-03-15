'use strict';

const signal = (initialValue) => {
  signal.execute = null;
  signal.desposeAll = null;
  const effects = new Set();
  const value = initialValue;

  const subscribeExecute = () => {
    if (!signal.execute) return;
    const { execute } = signal;
    effects.add(execute);
    const despose = () => effects.delete(execute);
    signal.desposeAll.push(despose);
  }

  const getter = () => {
    subscribeExecute();
    if (typeof value !== 'function') return value;
    return value();
  };
  getter.set = (value) => {
    value = value;
    for (const execute of effects) execute();
  };
  return getter;
};

const computed = (compute) => signal(compute);

const effect = (execute) => {
  const desposeAll = [];
  signal.execute = execute;
  signal.desposeAll = desposeAll;
  execute();
  signal.execute = null;
  signal.desposeAll = null;
  return () => {
    for (const despose of desposeAll) despose();
  }
}

// Usage

const count = signal(100);
const double = computed(() => count() * 2);
console.log({ initial: { count: count(), double: double() } });

const dispose = effect(() => {
  console.log({ count: count(), double: double() });
});

count.set(200);
count.set(300);
dispose();
count.set(400);
