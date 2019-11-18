const EventEmitter = require('events');
const fs = require('fs');

class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super();
        // 默认参数设置
        this.path = path;
        this.flags = options.flags || 'r';
        this.encoding = options.encoding || null;
        this.highWaterMark = options.highWaterMark || 64*1024;
        this.mode = options.mode || 438;
        this.autoClose = options.autoClose == false ? false : true;
        this.start = options.start || 0;
        this.end = options.end || 2e17;

        this.flowing = false; // 默认是暂停模式
        this.offset = 0; // 读文件的偏移量
        this.isClosed = false;
        this.isFinished = false;
        this.open(); // 打开文件 当创建可读流时 就打开文件 (异步执行)
        this.on('newListener', (type) => {
            if (type === 'data') { // 当用户监听data事件的时候 就开始读取文件
                this.flowing = true;
                this.read();
            }
        })
    }
    pipe(ws) {
        let rs = this;
        this.on('data', function (chunk) {
            let flag = ws.write(chunk);
            if (!flag) {
                this.pause();
            }
        })
        this.on('end', function (chunk) {
            rs.close();
            ws.close();
        })
        ws.on('drain', function () {
            rs.resume();
        })
    }
    read() {
        if (typeof this.fd !== 'number') {
            // 因为read比open先调用
            return this.once('open', this.read); // 先把read方法存起来，等open后再次调用
        }
        let buffer = Buffer.alloc(this.highWaterMark);
        let howMuchToRead
            = this.end
                ? Math.min(this.highWaterMark, this.end - this.offset)
                : this.highWaterMark;      
        fs.read(this.fd, buffer, 0, howMuchToRead, this.offset, (err, bytesRead) => {
            this.offset += bytesRead;
            if (bytesRead > 0) {
                // 只要读取到了内容，就emit出去
                if (howMuchToRead > bytesRead) {
                    buffer = buffer.slice(0, bytesRead);
                }
                this.emit('data', buffer);
            }
            if (bytesRead > 0 && bytesRead === this.highWaterMark) {
                // 如果读取到了内容，并且读取到的内容长度和highWaterMark相同 就再次尝试读取，以免多次读取
                this.flowing && this.read();
            } else {
                if (!this.isFinished) {
                    this.isFinished = true;
                    this.emit('end');
                }
                if (this.autoClose) {
                    this.close();
                }
            }
        })
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            this.fd = fd;
            this.emit('open', this.fd);
        })
    }
    close() {
        this.isClosed = true;
        fs.close(this.fd, (err) => {
            this.emit('close')
        })
    }
    pause() {
        this.flowing = false;
    }
    resume() {
        this.flowing = true;
        if (this.offset < this.end) {
            this.read();
        }
    }
}
module.exports = ReadStream