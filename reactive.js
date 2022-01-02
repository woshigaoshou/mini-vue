class Dep {
  constructor() {
    this.subscribers = new Set();
  }
  depend() {
    if (activeEffect){
      this.subscribers.add(activeEffect);
    }
  }
  notify() {
    console.log(this.subscribers);
    
    this.subscribers.forEach(effect => {
      console.log(effect);
      
      effect();
    })
  }
}

let activeEffect = null;
const targetDep = new WeakMap();

function getDep(target, key) {
  let depsMap = targetDep.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetDep.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

// vue2实现方式
// const reactive = (raw) => {
//   for (let key in raw) {
//     const dep = getDep(raw, key);
//     let value = raw[key]; // 若不定义value，则会不断触发get，导致栈溢出
//     Object.defineProperty(raw, key, {
//       get() {
//         dep.depend();
//         return value;
//       },
//       set(newValue) {
//         value = newValue;
//         dep.notify();
//       }
//     })
//   }
//   return raw;
// }

// vue3实现方式
const reactive = (raw) => {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return target[key];
    },
    set(target, key, newValue) {
      const dep = getDep(target, key);
      target[key] = newValue;
      dep.notify();
    }
  });
}

function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}

// let info = reactive({
//   num: 1
// });



// watchEffect(function (params) {
//   console.log(info.num * 2);
// });

// info.num++;
