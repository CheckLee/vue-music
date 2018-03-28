<template>
<div class="m-header">
  <div class="icon"></div>
  <h1 class="text">Chicken Music</h1>
  <router-link tag="div" class="mine" to="/user">
    <i class="icon-mine"></i>
  </router-link>
</div>
</template>

<script type="text/ecmascript-6">
  export default {

  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./m-header.styl"
</style>
