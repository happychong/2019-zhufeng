Array.prototype.reduce = function (fn, prep) {
    // this -> arr
    let res = prep;
    for (let i = 0; i < this.length; i++) {
        if (!res) {
            // res不存在，第一次循环pre是第一个，cur是第二个
            res = this[i];
            continue;
        }
        res = fn(res, this[i], i, this);
    }
    return res;
}


let a = [1, 2, 3, 4, 5];

let res = a.reduce((pre, cur, index, arr) => {
    return pre + cur;
}, 10)
console.log(res);
