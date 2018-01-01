<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active: currentIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { addClass } from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentIndex: 0
      }
    },
    props: {
      showDots: {
        type: Boolean,
        default: true
      },
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
      setTimeout(() => {
        this.init()
        window.addEventListener('resize', () => {
          this._setSliderWidth(true)
        })
      }, 20)
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    methods: {
      init() {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this._setSliderWidth()
        if (this.showDots) {
          this._initDots()
        }
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      },
      _setSliderWidth(resize) {
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        this.children = this.$refs.sliderGroup.children
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !resize) {
          width += 2 * sliderWidth
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
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          bounce: false,
          click: true
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.currentPage.pageX
          this.currentIndex = pageIndex - 1
          if (this.autoPlay) {
            this._play()
          }
        })
      },
      _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.slider.next()
        }, this.interval)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background-color: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
