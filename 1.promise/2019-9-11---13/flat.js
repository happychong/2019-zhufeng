let a = [1, [2, 3, [4, [5, [6]]]]];

let flat = function (arr, deepLeval, resArr = []) {
    let curLeval = 1;
    arr.reduce((prep, cur, index, arr) => {
        if (typeof cur === 'object') {
            if ((deepLeval === undefined || deepLeval === null) || deepLeval && curLeval < deepLeval) {
                let temp = flat(cur, (deepLeval ? (deepLeval - curLeval) : null), resArr);
                return temp;
            } else {
                prep.push(cur)
                return prep;
            }
        } else {
            prep.push(cur)
            return prep;
        }
    }, resArr)

    curLeval++;
    return resArr;
};


let flatArr = flat(a);
console.log(flatArr)