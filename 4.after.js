// after可以生成新的函数 等待函数执行次数达到我的预期时执行
const after = (times, cb) => {
    return () => {
        if (--times === 0) {
            cb();
        }
    }
}

let newAfter = after(3, () => {
    console.log('执行3次了')
})
newAfter();
newAfter();
newAfter();