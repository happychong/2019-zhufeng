const EventEmitter = require('events');
const fs = require('fs');

class WriteStream extends EventEmitter{
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.highWaterMark = options.highWaterMark || 16*1024;
        this.encoding = options.encoding || 'utf8';
        this.start = options.start || 0;
        this.mode = options.mode || 0o666;
        this.flags = options.flags || 'w';
        // 打开文件
        this.open();
        // 缓存区
        this.cacheWrite = [];
        this.writing = false;
        this.len = 0; // 缓存区的大小
        this.needDrain = false; // 是否触发drain事件
        this.isClosed = false;
    }
    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            this.fd = fd;
            this.emit('open', fd);
        })
    }
    write(chunk, callback = (err) => {}) {
        if (this.isClosed) {
            this.throwError();
        }
        // 判断是否正在写入，是的话先放入缓存中
        chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        this.len += chunk.length; // 统计写入数据的个数
        // console.log('this.len:', this.len);
        
        let flag = this. len < this.highWaterMark;
        this.needDrain = !flag; // 正好是相反操作 只有当前写入的内容>=highWaterMark，才会触发
        if (this.writing) {
            this.cacheWrite.push({
                chunk,
                callback
            })
        } else {
            let that = this;
            this.writing = true;
            this._write(chunk, () => {
                callback && callback();
                that.clearBuffer();
            }); // 真实写入
        }
        return flag;
    }
    // 核心写入方法
    _write(chunk, clearBuffer) {
        if (typeof this.fd !== 'number') {
            // open是异步的
            return this.once('open', () => {
                this._write(chunk, (err) => {
                    clearBuffer();
                })
            });
        }
        fs.write(this.fd, chunk, (err) => {
            this.len -= chunk.length;
            this.writing = false;
            clearBuffer();
        });
    }
    clearBuffer() {
        if (this.cacheWrite.length > 0) {
            let item = this.cacheWrite.shift();
            this._write(item.chunk, (err) => {
                item.callback && item.callback();
                this.clearBuffer();
            });
        } else {
            if (this.needDrain && !this.isClosed) {
                this.emit('drain')
            }
        }
    }
    end(chunk, callback) {
        if (this.isClosed) {
            return this.throwError();
        }
        if (chunk) {
            this.write(chunk, () => {
                this.close();
            });
            this.isClosed = true;
        } else {
            this.close();
        }
    }
    close() {
        fs.close(this.fd, (err) => {
            this.emit('close');
        })
    }
    throwError() {
        throw new Error('write 不能在 end 调用');
    }
}

module.exports = WriteStream;