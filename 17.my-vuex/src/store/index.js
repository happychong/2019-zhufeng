import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex); // 使用Vuex的install方法

const persits = (store) => {
    // store 当前的store实例，上面会多个subscribe（订阅）方法，
    store.subscribe((mutation, state) => { // commit 的时候会触发这个订阅
        console.log('persits:', mutation, state);
        localStorage.setItem('vuex-state', JSON.stringify(state))
    })
}
// 这里可以取值，替换掉store里的值，做数据恢复
// localStorage.getItem('vuex-state');
// store.replaceState();
export default new Vuex.Store({ // 导出的是store的实例,
    plugins: [persits], // 写个插件实现数据持久化，插件就是个函数
    modules: { // 模块 modules的名字和state的名字重名，会被覆盖掉
        a: {
            state: {x: 1},
            modules: {
                namespaced: true,
                i: {
                    state: {ii: 'i3级了'},
                    getters: { // 所有的getters都会定义到根上
                        computedI(state) { // $store.getters.computedI 取值
                            return state.ii + ' am 100'
                        }
                    },
                    mutations: { // 可以更改状态
                        syncAdd(state, payload) {
                            console.log('同名方法，多个的话，都要执行');
                        },
                        changeStoreII(state, payload) {
                            state.ii = '我改变了'
                        }
                    },
                },
                j: {
                    state: {jj: 'i'}
                }
            }
        },
        b: {
            state: {y: 2}
        }
    },
    state: { // 统一的状态管理
        age: 10,
    },
    getters: { // 计算属性 原理object.defineProperty
        myAge(state) { // 虽然写的是函数，实际取得是值
            return state.age + 10;
        }
    },
    mutations: { // 可以更改状态
        syncAdd(state, payload) {
            state.age = state.age + payload;
        },
        syncMinus(state, payload) {
            state.age -= payload;
        }
    },
    actions: { // 异步提交更改，异步调用，提交mutation，通过nutation修改状态
        asyncMinus(store, payload) {
            setTimeout(() => {
                store.commit('syncMinus', payload)
            })
        }
    }
})