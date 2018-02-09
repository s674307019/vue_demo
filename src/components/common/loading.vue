<template>
    <div class="loading" v-show="loadingShowG">
        <div class="loadingImg"><img src="../../assets/icons/img_waitting@2x.png" alt=""></div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'loading',
        components: {},
        data() {
            return {}
        },
        created() {
        },
        computed: {
            ...mapGetters(['loadingShowG'])
        },
        watch: {},
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .loading
        position fixed
        top 0
        left 0
        z-index 100
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .loadingImg
            position absolute
            top 45%
            left 50%
            margin-left -20px
            img
                width 40px
                animation play 2s linear infinite
    @keyframes play{ // 旋转动画
        0% {
            transform rotate(0deg)
        }
        100% {
            transform rotate(360deg)
        }
    }
</style>
