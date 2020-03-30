// 1：Symbol.toStringTag 自定义类型标签 Module
console.log(Object.prototype.toString.call({name: 'webpack'})); // [object Object]
console.log(Object.prototype.toString.call([1, 2, 3])); // [object Array]
console.log(Object.prototype.toString.call(10)); // [object Number]
console.log(Object.prototype.toString.call(true)); // [object Boolean]
// Object.prototype.toString.call 方法返回 类同 [object Object] 这样的字符串

// Symbol.toStringTag 可以设置对象的返回类型，如下，把 useExports 的 类型改为 Module
let useExports = {};
Object.defineProperty(useExports, Symbol.toStringTag, {value: 'Module'});
console.log(Object.prototype.toString.call(useExports)); // [object Module]



// 2：Object.create(null)
let obj = Object.create(null);
console.log(obj);
// Object.create(null)的好处:不会继承 Object 上的任何属性，得到一个很干净的对象

// 原理 - new 一个对象，使这个对象的原型链指向create的参数
if (!Object.create) {
  Object.create = function (proto) {
    function F(){};
    F.prototype = proto;
    return new F();
  }
}



// 3：getter
let ageValue;
let obj = {};
// obj.age = ageValue; // 老写法改为下面的 defineProperty 方式
// Object.defineProperty(obj, prop, descriptor) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
Object.defineProperty(obj, 'age', {
  // value: 10, // value: 10 的设置方式与get方法的设置方式只能2选1
  get(){
    return ageValue;
  },
  set(newValue){
    ageValue = newValue;
  }
});

obj.age = 3; // 走 set 方法
console.log(obj.age); // 走 get 方法
console.log(ageValue);
ageValue = 4
console.log(ageValue);
console.log(obj.age);

