<template>
    <div class="orderCard">
        <div class="orderMenu">
            <router-link to="/orderCard/beConfirmed" replace tag="section" class="menuList">待确认</router-link>
            <router-link to="/orderCard/completed" replace tag="section" class="menuList">已完成</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'orderCard',
        components: {},
        data() {
            return {
            }
        },
        created() {
        },
        computed: {},
        watch: {},
        methods: {
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    .orderCard
        position fixed
        top 0
        left 0
        background-color $color9
        width 100%
        height 100%
        overflow-y auto
        .orderMenu
            $flex()
            $border(bottom)
            background-color $white
            width @width
            height 50px
            .menuList
                flex 1
                text-align center
                color #C2C2C2
                font-weight 600
            .router-link-exact-active
                color $color7
</style>
