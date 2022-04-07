// vue 3.0 写法
import { h } from 'vue';
const DynamicHeading = (props, context) => {
    console.log(props);
    return h(`h${props.type}`, context.attrs, context.slots)
    // h 函数最好不要改名，有的浏览器固定了这个名字
    // h 函数 第一个参数：标签名  第二个参数：属性对象   第三个参数：childrens
}
DynamicHeading.props = ['type']
export default DynamicHeading


// 以下为 vue2 写法 注释掉
/**
export default {
    data() {
        return {
            val: '你好'
        }
    },
    props: {
        type: {
            type: String
        }
    },
    methods: {
        input(e) {
            console.log(e);
            
        }
    },
    render(h) {
        // render中的this 指当前组件实例

        // 以下这种写法，dom结构复杂的话，写起来比较费劲
        // return h('h' + this.type, {}, [
        //     this.$slots.default,
        //     h('h6', {
        //         on: {
        //             click() {
        //                 console.log('绑定事件');
        //             }
        //         },
        //         attrs: {
        //             x: 1,
        //             y: '5'
        //         }
        //     }),
        //     'the last child'
        // ]);

        // 所以用jsx （js + xml）来写更方便点
        // let tag = 'h' + this.type;
        // return <tag x={this.x} z='0'>
        //     {this.$slots.default}
        // </tag> 

        // 但是不能用指令v-model了，指令部分如下代码
        // return <input type="text" value={this.val} on-input={this.input}></input>

        // 以下为v-html写法
        return <p domPropsInnerHTML="<span>1234567890</span>"></p>
        // https://github.com/vuejs/babel-plugin-transform-vue-jsx 文档
    }
}
 */