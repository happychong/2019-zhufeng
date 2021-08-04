<template>
    <input type="file" ref="input" accept="image/*" @change="change"/>
</template>

<script>
export default {
  methods: {
    change(e) {
      let file = e.target.files[0];
      let fd = new FormData(); // 上传二进制
      fd.append('file', file);
      // 触发change事件，可以做预览（fileReader - 有兼容性问题） blob 处理
      this.$emit('change', fd);
    },
    show() {
      this.$refs.input.click();
    }
  }
}
</script>