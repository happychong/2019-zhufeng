let Vue;

const forEachObj = (obj, cb) => {
    Object.keys(obj).forEach(key => {
        cb(key, obj[key]);
    })
}
// 格式化目标
// let format = {
//     _rawModule: options,
//     _children: {
//         a: {
//             _rawModule: {},
//             _children: {
//                i: {
//                   _rawModule: {},
//                   _children: {},
//                   state: {ii: 'i'}
//                }
//             },
//             state: {x: 1}
//         },
//         b: {
//             _rawModule: {},
//             _children: {},
//             state: {y: 2}
//         }
//     },
//     state: options.state
// }
class ModuleCollection {
    constructor(options) {
        this.register([], options); // 注册模块，将模块注册成树结构
    }
    register(path, rootModule) {
        let module = { // 格式化模块
            _rawModule: rootModule, // 对应自己的options
            _children: {},
            state: rootModule.state
        }
        if (path.length ==0) {
            this.root =  module; // 如果是根模块，将这个模块挂在到根实例上
        } else {
            // 递归用reduce方法
            let parentModule = path.slice(0, -1).reduce((root, cur) => {
                return root._children[cur]
            }, this.root)
            parentModule._children[path[path.length - 1]] = module;
        }
        // 看当前模块是否有modules
        if (rootModule.modules) {
            // 如果有，再次注册
            forEachObj(rootModule.modules, (name, module) => {
                // [a]                [b] 
                // [a i] [a j]
                this.register(path.concat(name), module)
            })
        }
    }
}
const installModule = (store, rootState, path, rootModule) => {
    if (path.length > 0) {
        // 是儿子，找到父，将自己的状态给爸爸
        // [a] [b]
        let paren = path.slice(0, -1).reduce((res, cur) => {
            return res[cur];
        }, rootState);
        // vue 不能在对象上增加不存在的属性，否则不会导致视图更新，所以下面注释的写法不对
        // paren[path[path.length - 1]] = rootModule.state;
        Vue.set(paren, path[path.length - 1], rootModule.state);
    }

    let getters = rootModule._rawModule.getters;
    if (getters) {
        forEachObj(getters, (key, value) => {
            Object.defineProperty(store.getters, key, {
                get() {
                    // 让getter执行，将自己的状态传入
                    return value(rootModule.state) // 让对应的函数执行
                }
            })
        })
    }

    let mutations = rootModule._rawModule.mutations;
    if (mutations) {
        forEachObj(mutations, (key, value) => {
            store.mutations[key] = store.mutations[key] || [];
            store.mutations[key].push((payload) => {
                value(rootModule.state, payload);
                // 发布，让所有的订阅依次执行
                store._subscribes.forEach(fn => fn({
                    type: key,
                    payload
                }, rootState))
            });
        })
    }

    let actions = rootModule._rawModule.actions;
    if (actions) {
        forEachObj(actions, (key, value) => {
            store.actions[key] = store.actions[key] || [];
            store.actions[key].push((payload) => {
                value(store, payload);
            });
        })
    }
    // 同级挂载完成，开始挂载儿子
    forEachObj(rootModule._children, (key, value) => {
        installModule(store, rootState, path.concat(key), value)
    })
}

class Store {
    constructor(options = {}) {
        // 处理state
        // this.state = options.state; // 这样写不能响应式变化，vue不能监测到数据变化，所以如下改动
        this.s = new Vue({ // 核心所在：数据更新-更新视图，定义了响应式变化
            data() {
                return {
                    state: options.state
                }
            }
        })
        // 处理模块，modules
        this._modules = new ModuleCollection(options);
        this._subscribes = []; // plugins 发布订阅数组

        // 注释掉下面所有简易方法，处理深级别getters/mutations/actions
        this.getters = {}; 
        this.mutations = {};
        this.actions = {};
        // this-整个store  this.state-当前根状态  []-为了递归   this._modules.root-从根模块开始安装
        installModule(this, this.state, [], this._modules.root);

        // 简易方法注释 - start //
        // // 处理getters 简易方法：只能处理1级
        // let getters = options.getters;
        // this.getters = {};
        // // 重复复杂代码，整理到forEachObj方法中
        // // Object.keys(getters).forEach((key) => {
        // //     // this.getters[key] = getters[key](this.state);
        // //     Object.defineProperty(this.getters, key, {
        // //         get: () => {
        // //             return getters[key](this.state)
        // //         }
        // //     })
        // // })
        // forEachObj(getters, (key, value) => {
        //     // this.getters[key] = getters[key](this.state); // 不能这样写，不响应变化
        //     Object.defineProperty(this.getters, key, {
        //         get: () => {
        //             return value(this.state)
        //         }
        //     })
        // })
        // // 处理mutations 简易方法：只能处理1级
        // let mutations = options.mutations;
        // this.mutations = {};
        // // Object.keys(mutations).forEach((key) => {
        // //     this.mutations[key] = (payload) => {
        // //         mutations[key](this.state, payload);
        // //     }
        // // })
        // forEachObj(mutations, (key, value) => {
        //     this.mutations[key] = (payload) => {
        //         value(this.state, payload);
        //     }
        // })
        // // 处理actions 简易方法：只能处理1级
        // let actions = options.actions;
        // this.actions = {};
        // forEachObj(actions, (key, value) => {
        //     this.actions[key] = (payload) => {
        //         value(this, payload);
        //     }
        // })
        // 简易方法注释 - end //
    
        // plugins
        options.plugins.forEach(plugin => plugin(this));
    }
    subscribe = (fn) => {
        this._subscribes.push(fn);
        // this.on('data', data => {
        //     store.commit('receiveData', data)
        // })
    }
    // 提交更改，找到对应的函数执行
    commit = (mutationName, payload) => { // es7语法，保证this
        // this.mutations[mutationName](payload); // 注释掉，mutations改[]了
        let tempMs = this.mutations[mutationName];
        if (tempMs.length > 0) {
            tempMs.map((fn) => {
                fn(payload);
            })
        }
    }
    dispatch = (name, payload) => {
        // this.actions[name](payload);
        let tempMs = this.actions[name];
        if (tempMs.length > 0) {
            tempMs.map((fn) => {
                fn(payload);
            })
        }

        // 源码里还有一个变量，来控制是否是通过mutation来更新状态的，不是会报错
    }
    get state() { // 类的属性访问器，解决this.s.state多一层的问题
        return this.s.state
    }
}

const install = (_Vue) => {
    // _Vue vue的构造函数
    Vue = _Vue;
    console.log('vuex 中 install 执行');
    // install方法在vue.use的时候被调用，且只会被调用1次
    Vue.mixin({ // 混合
        beforeCreate(){ // 给每个实例都混入beforeCreate（创建之前会被执行的钩子函数）生命周期 钩子函数
            // 在这里给每个组件都增加$store属性
            if (this.$options && this.$options.store) {
                // 有store 是根实例
                this.$store = this.$options.store;
            } else {
                // 一个page new Vue 2次的话(单独创建了一个实例)，这个实例就没有$parent，就没有$store
                this.$parent && this.$parent.$store && (this.$store = this.$parent.$store);
            }
            // $store 是放在实例上的，没有放到原型上（Vue.prototype)，以免不需要store的实例也有$store
        }
    })
}

export default {
    // 提供一个install方法，vue.use的时候会被调用
    install,
    Store
}