<template>
    <div class="checkPass">
        <div class="pass" @touchend="checkPassFn">
            <h3>恭喜你</h3>
            <p>店铺认证已通过</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'checkPass',
        components: {},
        props:{
            checkPassFn:Function
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
    .checkPass
        position fixed
        top 0
        left 0
        z-index 101
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .pass
            position absolute
            top 35%
            left 50%
            margin-left -72px
            background url("../../assets/icons/img_succesd@2x.png") center 23% no-repeat #FFF
            background-size 43px 39px
            color #151515
            width 145px
            height 165px
            border-radius 4px
            text-align center
            h3
                margin-top 65%
                font-size 17px
            p
                margin-top 5px
                font-size 14px
</style>
