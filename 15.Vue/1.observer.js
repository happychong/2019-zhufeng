// Vue 监控数据变化原理 - observer.js
let arrayProto = Array.prototype; // 数组原型上的方法
let newProto = Object.create(arrayProto);
['push', 'shift', 'splice'].forEach(methodStr => {
  newProto[methodStr] = function (...args) {
    let inserted; // 被插入的新的数据
    switch (methodStr) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    if (inserted) {
      console.log(methodStr + '::增加数组添加值的监听');
      for (let item of inserted) {
        observer(item); // 如果有新值加到数组中，监听
      }
    }
    arrayProto[methodStr].call(this, ...args);
  }
});

function observer(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    // 数组格式
    Object.setPrototypeOf(obj, newProto); // 实现数组的方法的重写, == obj.__proto__ = newProto;
    for (let i = 0; i < obj.length; i++) {
      let item = obj[i];
      observer(item); // 数组中的值如果是object类型，创建响应式数据
    }
  } else {
    // 对象格式
    for (let key in obj) {
      defineReactive(obj, key, obj[key]);
    }
  }
}
function defineReactive(obj, key, value) {
  observer(value); // 如果值又是object类型，递归创建响应式数据，性能不好
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newV) {
      if (value !== newV) {
        observer(newV); // newV是object类型，创建响应式数据
        value = newV;
        console.log(key + ':视图更新');
      }
    }
  })
}

// data 模拟Vue中的data
let data = {
  name1: 'zj3',
  name2: {
    n: 'li4'
  },
  d: [1, {dName: 'dN'}]
};
observer(data);

// Vue特点，使用对象的时候，必须先声明其中的属性，这个属性才能使响应式的，否则没被Object.defineProperty过，不响应
// 1.增加原本不存在的属性，不能更新试图 （需要使用vm.$set)
data.x = 3;
// 2.默认会递归增加getter和setter
data.name1 = 'zh33';
data.name2.n = 'li44';
// 3.数组中的值是常量，不支持响应式变化
data.d[0] = 100;
// 4.数组中的值是object类型，支持响应式变化
data.d[1].dName = 'dN100';
// 5.修改数组长度 不会更新视图，但是会实质性的改变数据
data.d.length = 1;
// 6.数组新增数据（push,splice,unshift）会更新视图，
data.d.push({n: 'nn'});
data.d[1].n = 'nn99';