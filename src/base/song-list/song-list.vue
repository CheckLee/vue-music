<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" class="item" :key="song.index">
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "song-list",
    props: {
      songs: {
        type: Array,
        default: null
      }
    },
    methods: {
      getDesc(song) {
        return `${song.singer} · ${song.album}`
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus"  scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./song-list.styl"
</style>
