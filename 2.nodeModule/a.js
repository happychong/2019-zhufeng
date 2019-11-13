console.log(__dirname, '---a');

// module.exports = 'hello'

exports = 'hello'


const fs = require('fs');
const path = require('path');

function wideDeepRm(dir, callback) {
    try {
        let arr = [dir];
        let index = 0;
        let childsLength = [];
        let childsIndex = 0;
        let layer = 0;
        let layerArr = 0;
        let current;
        while (current = arr[index]) {
            let statObj = fs.statSync(current);
            if (statObj.isDirectory()) {
                let dirs = fs.readdirSync(current);
                dirs = dirs.map(item => path.join(current, item));
                arr = [...arr, ...dirs];
                if (index === 0) {
                    if (dirs.length) {
                        // 直接是空目录的话，直接next，删除自己
                        childsLength.push(dirs.length);
                    }
                    // 设置下一级别数据
                    layer++;
                    layerArr = 0;
                    childsIndex = 1;
                } else if (childsIndex === childsLength[layer - 1]) {
                    layerArr = layerArr + dirs.length;
                    if (layerArr) {
                        childsLength.push(layerArr);
                    }
                    layer++;
                    layerArr = 0;
                    childsIndex = 1;
                } else {
                    childsIndex++;
                    layerArr = layerArr + dirs.length;
                }
            } else {
                if (layer === 0) {
                    // 直接删除文件
                    fs.unlink(current, (err) => {})
                } else if (childsIndex >= childsLength[layer - 1]) {
                    if (layerArr) {
                        childsLength.push(layerArr);
                    }
                    layer++;
                    layerArr = 0;
                    childsIndex = 1;
                } else {
                    childsIndex++;
                    layerArr = [...layerArr, current];
                }
            }
            index++;
        }
        function next () {
            if (childsLength.length === 0) {
                let item = arr[0];
                fs.rmdir(item, (err, data) => {
                    callback && callback();
                });
                return;
            }
            let fileNum = childsLength.pop();
            let rmFiles = arr.splice(arr.length - fileNum, fileNum);
            
            rmFiles.map(item => {
                return new Promise((resolve, reject) => {
                    let itemStat = fs.statSync(item);
                    if (itemStat.isFile()) {
                        fs.unlink(item, (err) => {
                            resolve();
                        })
                    } else {
                        fs.rmdir(item, (err) => {
                            resolve();
                        })
                    }
                })
            });
            Promise.all(rmFiles).then(() => {
                next();
            })
        }
        next();
    } catch (e) {
        console.error(dir, '--文件路径不存在');
    }
}
wideDeepRm('a', () => {
    console.log('ok ok ok');
})
