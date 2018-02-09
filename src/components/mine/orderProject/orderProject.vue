<template>
    <div class="orderProject">
        <div class="orderMenu">
            <router-link to="/orderProject/waitRefund" replace tag="section" class="menuList">待退款</router-link>
            <router-link to="/orderProject/waitConsumption" replace tag="section" class="menuList">待消费</router-link>
            <router-link to="/orderProject/proCompleted" replace tag="section" class="menuList">已完成</router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'orderProject',
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
    .orderProject
        width 100%
        .orderMenu
            $flex()
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
