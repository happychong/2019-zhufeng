<template>
  <div ref="upper" class="message-wrapper">
    <div v-for="upper in arr" :key="upper.id">{{ upper.opts.message }} ： {{ upper.id }}</div>
  </div>
</template>

<script>

const Message = {
  data() {
    this.lastId = 0;
    return {
      arr: {}
    }
  },
  methods: {
    addUpper(opts) {
      let tempId = this.lastId++;
      let obj = {
        id: tempId,
        opts: opts
      };
      obj.timer = setTimeout(() => {
        clearTimeout(obj.timer);
        Reflect.deleteProperty(this.arr, tempId)
      }, opts.duration);
      this.arr[tempId] = obj;
    }
  }
};
export default Message;
</script>