// 反柯理化  比如Object.prototype.toString方法，让每一个对象都有这个方法

function Parent() {

}
Parent.prototype.consoleOk = function (...args) {
    console.log(args, 'ok ok ok')
}

function uncurring(obj) {
    return (...args) => {
        Parent.prototype.consoleOk.call(obj, ...args);
    }
}

function Child() {

}
Child.consoleOk = uncurring(Child);


Child.consoleOk(4343)