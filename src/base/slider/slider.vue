<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(dot, index) in dots" :key="dot"
            :class="{ active: currentPageIndex === index }"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { addClass } from "common/js/dom"

  export default {
    name: "slider",
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted() {
      // 保证 DOM 成功加载有延时
      // 可以用 this.nextTick(), 也可以用 setTimeout
      // 浏览器刷新是 17ms
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      window.addEventListener('resize', () => {
        if (!this.slider || !this.slider.enable) {
          return 0
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        // console.log(this.children.length)

        let width = 0
        // 父容器宽度
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          // 先把每个轮播图的宽度射设成和父宽度一样的，然后在算总的
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // ???
        if (this.loop && !isResize) {
          width += sliderWidth * 2
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false, // 惯性
          // 新版本改动，snap 写在一起就好了
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          /*
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          */
          click: true
        })

        this.slider.on('scrollEnd', () => {
          // 获取滚动结束后新的当前页面数
          let pageIndex = this.slider.getCurrentPage().pageX
          // console.log(pageIndex)
          // 新版本中 pageIndex 就是当前pageIndex
          /*
          if (this.loop) {
            pageIndex -= 1
          }
          */
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            this._play()
          }
        })
        this.slider.on('touchEnd', () => {
          if (this.autoPlay) {
            this._play()
          }
        })
        // 防止在轮播前，手动拖动
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _play() {
        /*
        let pageIndex = this.currentPageIndex + 1
        /!*
        if (this.loop && pageIndex === 5) {
          pageIndex = 8
        }
        *!/
        // console.log(pageIndex)
        // console.log(this.slider)
        // console.log(this.slider)
        this.timer = setTimeout(() => {
          // 横向轮播，纵向轮播，间隔
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
        */
        // 发现了源码
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
    },
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "./slider.styl"
</style>
