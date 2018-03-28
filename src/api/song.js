// import jsonp from 'common/js/jsonp'
import { commonParams } from "./config"
import axios from "axios/index"

function getSongVkey(songmid) {
  const url = '/api/getSongVkey'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 2577861252,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongUrl(songmid) {
  return new Promise((resolve, reject) => {
    getSongVkey(songmid).then((res) => {
      let songInfo = res.data.items[0]
      let url = `http://dl.stream.qqmusic.qq.com/${songInfo.filename}?vkey=${songInfo.vkey}&guid=2577861252&fromtag=66`
      resolve(url)
    })
  })
}
