// 发布订阅 --->  观察者模式（Vue watcher)
// 发布订阅模式 没有关系的
// 观察者模式    --- 观察者模式包含发布订阅

class Subject { // 被观察者 小宝宝
    constructor() {
        this.arr = [];
        this.state = 'happy';
    }
    attach(o) {
        this.arr.push(o);
    }
    changeState(newState) {
        this.state = newState;
        this.arr.forEach(o => {
            o.update(newState)
        })
    }
}

class Observer { // 观察者 父 母
    constructor(name) {
        this.name = name;
    }
    update(newState) {
        console.log(this.name + '说：' + newState)
    }
}

let s = new Subject('baby');
let o1 = new Observer('mother');
let o2 = new Observer('father');

s.attach(o1);
s.attach(o2);

s.changeState('饿了')