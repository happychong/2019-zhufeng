// 模仿element-ui Message

import MessageComponent from './messageUpper.vue';
import { createVNode, h, render } from 'vue';

let time = null;
let vnode = null;
export const Message = {
    success(opts) {
        if (!document.querySelector('.message-wrapper')) {
            vnode = h(MessageComponent, { ref:'vnode' });
            render(vnode, document.body);
            vnode.component.ctx.addUpper(opts);
        } else {
            vnode.component.ctx.addUpper(opts);
        }
    },
    info(opts) {},
    warn(opts) {},
    error(opts) {}
};

export default {
    install(_Vue, a,b,c) {
        console.log(_Vue, a,b,c);
        // _Vue vue3中是当前根节点的实例， vue2中应该是Vue的构造函数
        // 注册全局组件、注册全局指令、往原型上添加方法&属性
        let $message = {};
        // 采用拷贝的方式，防止别人增加一个属性，加到原有的对象上
        for (let key of Object.keys(Message)) {
            $message[key] = Message[key];
        }
        // 原型上注册$message方法
        _Vue.config.globalProperties.$message = $message;
    }
};