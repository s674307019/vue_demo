<template>
    <div class="decline">
        <div class="declineMain">
            <h3>拒绝理由</h3>
            <section v-html="declineWords">
            </section>
            <router-link :to="{name:'ShopCertify',params:{'editor':true}}" tag="button">重新编辑认证信息</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'decline',
        components: {},
        props:{
            declineWords:String
        },
        data() {
            return {}
        },
        created() {
        },
        computed: {},
        watch: {},
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .decline
        position fixed
        top 0
        left 0
        z-index 101
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .declineMain
            position absolute
            top 35%
            left 50%
            margin-left -135px
            color #151515
            background-color #FFF
            width 270px
            border-radius 12px
            text-align center
            h3
                padding 20px 0
                border-bottom 1px solid #F2F2F2
                font-size 17px
            section
                padding 12px 0
                font-size 14px
                color #030303
                p
                    margin 0 auto
                    line-height 20px
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    width 90%
            button
                padding 16px 0
                color #0076FF
                border 0
                border-top 1px solid #F2F2F2
                background none
                font-size 14px
                width 100%
</style>
