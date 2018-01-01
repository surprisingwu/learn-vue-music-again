<template>
  <div class="singers"></div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singers'
  import { ERR_OK } from 'api/config'

  export default {
    data () {
      return {
        singersList: []
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
            this.singersList = res.data
            console.log(this.singersList)
          }
        })
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
