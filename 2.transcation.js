// 事物 开始的时候 做某件事 结束的时候再做某件事

const perform = (anymethod, wrappers) => {
    wrappers.forEach(wrap => {
        wrap.initilizae();
    });
    anymethod();
    wrappers.forEach(wrap => {
        wrap.close();
    });
}

perform(() => {
    console.log('说话');
}, [
    { // warpper
        initilizae(){
            console.log('您好1，')
        },
        close(){
            console.log('再见1，')
        }
    },
    { // warpper
        initilizae(){
            console.log('您好2，')
        },
        close(){
            console.log('再见2，')
        }
    }
])

// 柯理化 我们可以把一个大函数拆分成具体的函数 3中