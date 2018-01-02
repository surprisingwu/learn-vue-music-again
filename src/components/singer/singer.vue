<template>
  <div class="singers"></div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singers'
  import { ERR_OK } from 'api/config'
  import Singer from 'common/js/singer'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data () {
      return {
        singers: []
      }
    },
    created () {
      this._getSingerList()
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          console.log(1)
          if (res.code === ERR_OK) {
            this.singers = this._normalize(res.data.list)
          }
        })
      },
      _normalize (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        // 由于对象是无序的, 转化成数组
        let hot = []
        let ret = []
        for (let k in map) {
          let value = map[k]
          if (value.title === HOT_NAME) {
            hot.push(value)
          } else {
            ret.push(value)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

  .singers
    position fixed
    top 88px
    left 0
    bottom 0
    right 0
</style>
