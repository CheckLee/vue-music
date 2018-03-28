<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" :key="group.index" ref="listGroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" @click="selectItem(item)" v-for="item in group.items" :key="item.index">
            <img v-lazy="item.avatar" alt="" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         @touchstart="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            class="item needsclick" :key="item.index"
            :class="{'current': currentIndex === index}"
            :data-index="index" >{{ item }}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import { getData } from "common/js/dom"

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    name: "",
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      // 原生的，只是为了获取数据，不需要观测变化...这是和data有啥区别
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        // console.log(e.target)
        let anchorIndex = getData(e.target, 'index')
        // console.log(anchorIndex)
        // 第一次触碰的位置
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // y轴上的偏移量
        // a | 0 相当于向下取整 math.flow
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        // 控制当触碰到两旁空白处时，不进行曹错
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 当调用该方法时，scrollY不发生变化
        // 也就是说，侧边栏可以定位锚点，但是不能定位自身
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算所有 list-group 对应顶部的高度，这样便于侧边栏对应
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // 当watch到data变化时，重新计算heightList高度
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },

      scrollY(newY) {
        // console.log(newY)
        const listHeight = this.listHeight
        // console.log(listHeight)
        // 当滚动到顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 中间滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let heightL = listHeight[i]
          let heightH = listHeight[i + 1]
          if (-newY >= heightL && -newY < heightH) {
            this.currentIndex = i
            // diff 就是 当前滚动位置 与 当前list结束位置的差
            this.diff = heightH + newY
            return
          }
        }
        // 当滚动到底部时，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        // 如果两个title有重叠时，fixedTop 是个负值，就是让fixed-title向上偏移
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        // 如果上下滑动不变时，fixedTop不需要改变
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          // 热门只有一个字，所以截一个字
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    components: { Scroll }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "./listview.styl"
</style>
