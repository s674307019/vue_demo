<template>
    <div class="checkNotPass">
        <div class="notPass">
            <p>店铺认证未通过</p>
            <button @touchend="checkReason">查看理由</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'checkNotPass',
        components: {},
        props:{
            checkReason:Function
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
    .checkNotPass
        position fixed
        top 0
        left 0
        z-index 101
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .notPass
            position absolute
            top 35%
            left 50%
            margin-left -72px
            background url("../../assets/icons/img_failed@2x.png") center 23% no-repeat #FFF
            background-size 43px 39px
            color #151515
            width 145px
            height 165px
            border-radius 4px
            text-align center
            p
                color #333
                margin-top 65%
                font-size 14px
            button
                position absolute
                bottom 0
                left 0
                color #0076FF
                border 0
                border-top 1px solid #F2F2F2
                background none
                font-size 14px
                width 100%
                height 36px
</style>
