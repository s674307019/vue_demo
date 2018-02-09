<template>
    <div class="pullRefresh"
         @touchstart="touchStartFn"
         @touchmove="touchMoveFn"
         @touchend="touchEndFn">
        <!--:class="{'pullDownPic':intNumber.downY>=50}"-->
        <!--:style="{'height':intNumber.downY+'px'}"-->
        <!--&gt;</div>-->
        <!--<div class="arrowDown" v-show="arrowDownStatus"-->
        <!--:style="{'height':`${intNumber.downY}px`,'margin-top':`${intNumber.downY}px`}">{{arrowDownWords}}</div>-->
        <!--<div class="pullDown" v-show="pullDownStatus"-->
        <!--:class="{'pullDownPic':intNumber.downY>=50}"-->
        <!--:style="{'height':`${intNumber.downY}px`}"-->
        <!--&gt;</div>-->
        <slot></slot>
        <div class="pullUp"
             :class="{'pullUpPic':intNumber.upY>=50}"
             :style="{'height':intNumber.upY+'px'}"></div>
        <div class="hasNoMore" v-show="hasNoMore">没有更多了</div>
    </div>
</template>

<script>
    /*
    * 说明：
    *   props接收4个属性：
    *       1.pullDownFn:Function,
    *           下拉刷新执行的回调，回调函数参数必须有个重置变量函数resetFn
    *           如：
    *               pullDownFn(){
                        this.pageNo=1
                        this.hasNoMore=false
                        this.getMemberFn(this.pageNo,this.resetFn)
                    }
            2.pullUpFn:Function,
                上拉加载执行的回调，回调函数参数必须有个重置变量函数resetFn
                如：
                    pullUpFn(){
                        this.pageNo++
                        this.getMemberFn(this.pageNo,this.resetFn)
                    }
            3.intNumber:Object,
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                }
            4.hasNoMore:Boolean
                hasNoMore:false
            5.重置变量resetFn：
                pullDownFn(){
                    // 下拉刷新
                    this.pageNo=1
                    this.hasNoMore=false
                    this.getMemberFn(this.pageNo,this.resetFn)
                }
    * */
    export default {
        name: 'pullRefresh',
        props:{
            pullDownFn:Function,
            pullUpFn:Function,
            intNumber:Object,
            hasNoMore:Boolean
        },
        data() {
            return {
                iStartY:0, // 起始位置,手指按下位置
                iMoveY:0, // 手指移动了多长距离
                iEndY:0, // 手指离开屏幕是移动的距离
                pullDownStatus:false, // 刷新图片显示
                arrowDownStatus:false, // 向下箭头显示
                arrowDownWords:'下拉刷新'
            }
        },
        watch:{
            intNumber(n,o){
                if(n.downY===0){
                    this.pullDownStatus=false
                    this.arrowDownWords='下拉刷新'
                }
            }
        },
        methods: {
            touchStartFn(e){
//                e.preventDefault()
                this.iStartY=e.changedTouches[0].pageY // 手指按下位置
            },
            touchMoveFn(e){
//                e.preventDefault()
                this.iMoveY=e.changedTouches[0].pageY-this.iStartY // 手指移动了多长距离
                if (this.iMoveY<0){
                    if (!this.hasNoMore){
                        this.intNumber.upY=Math.abs(this.iMoveY)
                    }
                }
            },
            touchEndFn(e){
//                e.preventDefault()
                this.iEndY=e.changedTouches[0].pageY-this.iStartY // 手指离开屏幕移动的距离
                if (this.iEndY<0){
                    // 上拉
                    if (!this.hasNoMore){
                        if (this.iEndY<=-50){
                            if (this.iEndY<=-100){
                                this.intNumber.upY=100
                            }
                            this.pullUpFn()
                        }else {
                            this.intNumber.upY=0
                        }
                    }
                }
                this.iStartY=0
                this.iMoveY=0
                this.iEndY=0
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .pullRefresh
        width 100%
        height auto
        overflow-y hidden
        font-size 0
        .arrowDown
            margin 0 auto
            font-size 14px
            background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAEkklEQVRYhcWZy29bRRSHv5l77SqNSUqrNJXaqAlSgxRRFKUiEhvyD9BKCLJgwXtDYVsJCdbssoAFVTcIChILKoRUdY0KCxCOAk5I7bycmLxIHCdu3ThObc81iztGfl7PDa76k7yZe+45nz0z55wZi+/v/MQRdBx4AXgJeB54BujR4wAHwA6wDMwAvwCTetyXbJ/2Q8CbwCvAoIfdKaAPGAFe02MLwI/AN0DUNKA0tOsDvgDCwEct4JppUL8b1r762gX4tnb6AdB5BLBadWpfYe3bU16AQeA68BVwpg1gtTqjfV/XsRqqGWAIuAVcbT9Xna7qWKFGDxsBBoHvgCutPJdKJYpFhXIcnJqPchyKRUWpVDKBvKJj1v2SjXbxZ8BlEzjbshi6MEBvz9NIIYEyjMApOWzvpFlYXqWoFEKIVi4vA59TM2u1gG/UGnhp5OKz9J9rvjx7Tp4g1NlBOGKcVd4HfgW+LQ9UTvE5YMLEi3IcurtCnD/b29L2/NleurtCKMcxhZzQLHWAHwOnjVyUSgRt22TaEEIQtG0wW4tohk9qAQcxyElVjI/JVustdDEoA74HdPj389jUgcuExM3s408Up7HGgU4JXAIGnjBMIw0AlyQw9qRJPDRmA8NeFm5lqF7mSimUMk4bKFWuKtXjUkqk9MwEwzbQ3xyuRKizg+6nqsukUg7dXeaNTc+pboIBG8uqrqzpBw/JHT7ySlf9Nk1yn1vKJC+OPMfJE13GMI00PHSh4fhuOsPd3/5AOU4zyNMSr/QiBIGA36bbXMeOBcA72Xc07QeFEBQKRSL3Fk07Et+6N79CvlDwrEgSyDV7aFmS9a0d5uKrbYdbTKyzsraJbVleZjkJJL0sLCmZnV9mK7nXNrjt1B7T0SWkbHniSEog4WUhhEAph8mZGPsHh/8bLntwyGRkjmLRqEdMSCDSysqyJPvZHFMzc37apjoppZicjpHJHtSlnCaalsDPJpa2bbG5nWJ2fvnIgJHoEpvJFAHbc91V6q4EpoAVE2vLkswt/c3qxrZvuKXEOgsra602RaVWgCkJZHFPVS1VXjNTs/Pcz+wbwyVTaSLRRaSQRk2u1i0gW14IX+KRbiolpeTwUZ5wJEahUGxpn80dEp6OUSw6repupXKa6b+GdQG4afq2bVmk0vf5M7roaVdUinAkSmY/a7opyrqpmarOJJ/SIidWQdoW8cQGS4mNpjYzsTj/JHcJ2L7KZVKzUAu4Dlwz9SIQSEsyHVsktfeg7nk8scH88iq25buWX9MsdYDgnkdvmHqSul7/Homym3YhHcdhdWObSHQRS8oWvUCdblBxJgYQDS4wg8APwMumXh3HwbZtukLHUY5D5mGWkv4CPnQHeBXIVw42Wrl54HXgtqlnKSVKKXbTGTf9COEX7raOma990Gxr7eOeqoynWwiBZUl3Wv2guTHGdcw6ee39PO49zTvAlr+YRtoC3tUx6n65skyS09fAKO5FY7YNYFntaxT3AtNTptlzDfhQO50A4kcAi+t3R7WvNZOXGu1iE4VwD/xjwEW8/4b4C7djmqLJOvPSv1DFkd0uFUBoAAAAAElFTkSuQmCC") 40% center no-repeat #F2F2F2
            background-size 22px
            text-align center
            text-indent 2em
            color #333
            width 100%
        .pullDown,.pullUp
            background-color #F2F2F2
            width @width
        .pullDownPic,.pullUpPic
            background url("data:image/gif;base64,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") center no-repeat #F2F2F2
            background-size 24px
        .hasNoMore
            padding 15px 0
            font-size 14px
            color #333
            text-shadow 0 1px 0 #FFF
            background-color #F2F2F2
            text-align center
</style>
