<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24" alt="" />
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
  export default {
    name: "",
    props: {
      title: {
        type: String,
        default: "正在载入..."
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "./loading.styl"
</style>
