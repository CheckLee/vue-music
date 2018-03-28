<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getSingerDetail } from "api/singer"
  import { ERR_OK } from "api/config"
  import { createSong } from "common/js/song"
  import { getSongUrl } from "api/song"
  import MusicList from "components/music-list/music-list"

  export default {
    name: "singer-detail",
    data() {
      return {
        initSongs: [],
        songs: [],
        flag: false,
        testVkey: ''
      }
    },
    computed: {
      ...mapGetters([ 'singer' ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    created() {
      // console.log(this.singer)
      // 这边就是先获取到歌单信息，然后在异步把歌曲url放进去
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 如果刷新以后，页面重新渲染，数据就没有了，然后在这儿做一步返回操作
        return new Promise((resolve, reject) => {
          if (!this.singer.id) {
            this.$router.push('/singer')
          }
          getSingerDetail(this.singer.id).then((res) => {
            if (res.code === ERR_OK) {
              this.songs = this._normalizeSongs(res.data.list)
              resolve()
            }
          }).catch((err) => {
            console.log(err)
            reject(err)
          })
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          // 这边可以直接提取 item.musicData => musicData , ES6的小技巧
          let { musicData } = item
          getSongUrl(musicData.songmid).then((url) => {
            if (musicData.songid && musicData.albummid) {
              ret.push(createSong(musicData, url))
            }
          })
          /*
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
          */
        })
        return ret
      },
      _getSongsUrl() {
        console.log('1.1')
        this.songs.forEach((item, index) => {
          getSongUrl(item.mid).then((url) => {
            item.url = url
          })
        })
      }
        /*
        return new Promise((resolve, reject) => {
          this.songs.forEach((item, index) => {
            getSongUrl(item.mid).then((url) => {
              item.url = url
            })
          })
          console.log('1.2')
          // console.log(this.songs)
          resolve()
        })
        */
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" type="text/stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "./singer-detail.styl"
</style>
