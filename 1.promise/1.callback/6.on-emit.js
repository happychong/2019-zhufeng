const fs = require('fs');
let school = {};

let e = {
    arr: [],
    on(fn) {
        this.arr.push(fn)
    },
    emit() {
        this.arr.forEach(fn => {
            fn();
        })
    }
}

// 发布订阅
e.on(() => {
    console.log('ok')
})
e.on(() => {
    // 订阅
    if (Object.keys(school).length === 2) {
        console.log(school)
    }
})

fs.readFile('name.txt', 'utf8', (err, data) => {
    school.name = data;
    e.emit();
})
fs.readFile('age.txt', 'utf8', (err, data) => {
    school.age = data;
    e.emit();
})
