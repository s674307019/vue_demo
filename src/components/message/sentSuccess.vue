<template>
    <div class="sentSuccess">
        <div class="deal" @touchend="sentSuccessFn">
            <p>发送成功</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'sentSuccess',
        components: {},
        props:{
            sentSuccessFn:{
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
    .sentSuccess
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
            background url("../../assets/icons/img_succesd@2x.png") center 30% no-repeat #FFF
            background-size 43px 39px
            color #333333
            width 145px
            height 152px
            border-radius 4px
            text-align center
            p
                margin-top 70%
                font-size 14px
</style>
