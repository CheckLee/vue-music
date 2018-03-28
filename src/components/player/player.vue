<template>
  <div class="player" v-show="playlist.length > 0">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img height="100%" width="100%">
      </div>
      <div class="top">
        <div class="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title"></h1>
        <h2 class="subtitle"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img src="" alt="" class="image">
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="operator">
          <div class="icon i-left">
            <i class="icon-sequence"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-play"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-left">
            <i class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen">
      <div class="icon">
        <img width="40" height="40">
      </div>
      <div class="text">
        <h2 class="name"></h2>
        <p class="desc"></p>
      </div>
      <div class="control"></div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: "player",
    computed: {
      ...mapGetters([
        'fullScreen', 'playlist'
      ])
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./player.styl"
</style>
