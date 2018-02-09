<template>
    <div class="tabBar">
        <ul class="tabList">
            <router-link to="/home" replace tag="li">
                <div class="home"><p>首页</p></div>
            </router-link>
            <router-link to="/mine" replace tag="li">
                <div class="mine"><p>我的</p></div>
            </router-link>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'tabBar',
        components: {},
        data() {
            return {}
        },
        created() {
        },
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .tabBar
        position fixed
        left 0
        bottom 0
        z-index 100
        width 100%
        height 49px
        .tabList
            $flex()
            background-color #FFF
            width @width
            height @height
            $border(top)
            li
                flex 1
                $flex()
                cursor pointer
                div
                    text-align center
                    img
                        height 22px
                    p
                        padding-top 23px
                        font-size 10px
                        color $color3
                    &.home
                        background url("../../assets/icons/btn_home_n@2x.png") center top no-repeat
                        background-size 23px
                    &.mine
                        background url("../../assets/icons/btn_mine_n@2x.png") center top no-repeat
                        background-size 23px
                &.active
                        div
                            p
                                color $black
                            &.home
                                background-image url("../../assets/icons/btn_home_d@2x.png")
                            &.mine
                                background-image url("../../assets/icons/btn_mine_d@2x.png")
</style>
