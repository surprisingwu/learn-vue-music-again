<template>
  <scroll
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="_onScroll"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" @click="selectItem(item)" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcut"
            class="item"
            :data-index="index"
            :class="{'current': currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { getIndex } from 'common/js/dom'
  import Loading from 'base/loading/loading'

  const SHORT_ITEM_HEIGHT = 18
  const FIXED_TITLE = 30
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        listHeight: [],
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    computed: {
      shortcut () {
        return this.data.map((item) => {
          return item.title.slice(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY >= 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    created () {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
    },
    methods: {
      selectItem(item) {
        this.$emit('selectItem', item)
      },
      onShortcutTouchStart ($event) {
        const index = getIndex($event.target, 'index')
        let firstTouch = $event.touches[0]
        this.touch.startY = firstTouch.pageY
        this.touch.beginIndex = index
        this._scrollTo(index)
      },
      onShortcutTouchMove ($event) {
        const endTouch = $event.touches[0]
        this.touch.endY = endTouch.pageY
        let delta = this.touch.endY - this.touch.startY
        let num = delta / SHORT_ITEM_HEIGHT | 0
        let index = num + parseInt(this.touch.beginIndex)
        this._scrollTo(index)
      },
      _calculateHeight () {
        this.listHeight = []
        const listEls = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < listEls.length; i++) {
          let item = listEls[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _onScroll (pos) {
        this.scrollY = pos.y
      },
      _scrollTo (index) {
        // 点击其他地方时
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        }
        if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 点击右侧的快速入口
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data (newData) {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        // 计算newY的落点
        let listHeight = this.listHeight
        // 滚动到顶部,且newY >0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到底部
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let offsetY = (newVal > 0 && newVal <= FIXED_TITLE) ? newVal - FIXED_TITLE : 0
        if (this.offsetY === offsetY) {
          return
        }
        this.offsetY = offsetY
        this.$refs.fixed.style.transform = `translate3d(0,${this.offsetY}px,0)`
      }
    },
    components: {
      Scroll, Loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
