<template>
    <div class="errorBox" v-show="errorStatusG">
        <div class="error">
            <div class="errorWords" v-html="errorMsgG"></div>
            <div class="errorBtn" @touchend.stop.prevent="errorStatusA">确定</div>
        </div>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex'
    export default {
        name: 'errorBox',
        data() {
            return {}
        },
        created() {
        },
        computed: {
            ...mapGetters(['errorStatusG','errorMsgG'])
        },
        watch: {},
        methods: {
            ...mapActions(['errorStatusA'])
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .errorBox
        position fixed
        top 0
        left 0
        z-index 100
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .error
            position absolute
            left 14%
            top 40%
            background-color #FFF
            text-align center
            border-radius 12px
            width 72%
            font-size 17px
            .errorWords
                color #030303
                width 100%
                height 60px
                line-height @height
            .errorBtn
                border-top 1px solid #F2F2F2
                color #0076FF
                width 100%
                height 43px
                line-height @height
</style>
