
class Chunk {
  constructor(module){
    this.module = module;
    this.name = module.name;
    this.files = [];
    this.modules = [];
  }
}
module.exports = Chunk;