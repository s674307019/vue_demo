<template>
    <div class="handleList" v-show="handleStatus">
        <div class="handleBox">
            <h3>{{handleWords}}</h3>
            <section class="btn">
                <p @touchend="confirmFn">确定</p>
                <p @touchend="cancelFn">取消</p>
            </section>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'handleList',
        components: {},
        props:{
            handleStatus:{
                type:Boolean
            },
            handleWords:{
                type:String
            },
            confirmFn:{
                type:Function
            },
            cancelFn:{
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
    .handleList
        position fixed
        top 0
        left 0
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .handleBox
            position absolute
            top 38%
            left 50%
            margin-left -40%
            border-radius 8px
            background-color #FFF
            width 80%
            h3
                margin 22px 0
                padding 0 5px
                color #0076FF
                font-size 16px
                text-align center
            .btn
                font-size 0
                width 100%
                p
                    padding 12px 0
                    font-size 14px
                    display inline-block
                    vertical-align middle
                    text-align center
                    width 50%
                    &:first-child
                        border-bottom-left-radius 8px
                        background-color #FFDC71
                        color #333
                    &:last-child
                        border-bottom-right-radius 8px
                        background-color #F2F2F2
                        color #F00
</style>
