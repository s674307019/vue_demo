<template>
    <div class="sentFail">
        <div class="deal" @touchend="sentFailFn">
            <p>发送失败</p>
            <span>{{sentFailWords}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'sentFail',
        components: {},
        props:{
            sentFailWords:{
                type:String
            },
            sentFailFn:{
                type:Function
            }
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
    .sentFail
        position fixed
        top 0
        left 0
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .deal
            position absolute
            top 35%
            left 50%
            margin-left -72px
            background url("../../assets/icons/img_failed@2x.png") center 24% no-repeat #FFF
            background-size 43px 39px
            color #333333
            width 145px
            border-radius 4px
            text-align center
            p
                margin-top 62%
                font-size 14px
            span
                margin-top 13px
                padding 10px 5px
                display block
                font-size 12px
</style>
