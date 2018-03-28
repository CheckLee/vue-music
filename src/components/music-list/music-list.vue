<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :probe-type="probeType"
            @scroll="scroll"
            :listen-scroll="listenScroll"
            :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from "base/scroll/scroll"
  import SongList from "base/song-list/song-list"
  import { prefixStyle } from "common/js/dom"
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'

  const RESERVED_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    name: "music-list",
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: null
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      // console.log(transform)
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    methods: {
      ...mapActions([
        'selectPlay'
      ]),
      // 先触发scroll组件事件，获取滚动距离
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.push('/singer')
      },
      selectItem(item, index) {
        console.log('2')
        console.log(this.songs)
        this.selectPlay({
          list: this.songs,
          index
        })
      }
    },
    watch: {
      // 监听滚动位置，联动layer一起滚动
      // 但是不能让它一直滚动，滚动到顶就ok
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

        // 下拉实现图片scale变大
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur})`

        // 当向上滑动时，固定图片高度
        // 而向下滑动时，图片变回10：7比例
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
          this.$refs.play.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.play.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    mounted() {
      // 这边有个点很奇怪
      // this.$refs.list 是获取到组件
      // this.$refs.list.$el 是指向组件本身
      // console.log(this.$refs.list)
      // console.log(this.$refs.list.$el)
      // console.log(this.$refs.bgImage)
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    components: {
      Scroll, SongList, Loading
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  @import "./music-list.styl"
</style>
