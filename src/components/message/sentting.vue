<template>
    <div class="sentting" v-show="senttingStatus">
        <div class="content">
            <section class="number"><h3>{{progressVal}}</h3><sub>%</sub></section>
            <p>正在发送</p>
            <div class="progress" :style="{'width':progressVal+'%'}"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'sentting',
        components: {},
        props:{
            senttingStatus:{
                type:Boolean
            },
            progressVal:{
                type:Number
            }
        },
        data() {
            return {
            }
        },
        created() {
        },
        computed: {},
        watch: {
//            senttingStatus(nv,ov){
//                if(nv){
//                    this.progressFn()
//                }
//            }
        },
        methods: {
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .sentting
        position fixed
        top 0
        left 0
        background-color rgba(0,0,0,.3)
        width 100%
        height 100%
        .content
            position absolute
            top 35%
            left 50%
            margin-left -72px
            background-color #FFF
            color #333333
            width 145px
            height 152px
            border-radius 4px
            text-align center
            .number
                margin-top 32px
                color #36D700
                h3
                    font-size 36px
                    display inline
                sub
                    vertical-align middle
                    font-size 14px
            p
                margin-top 22px
                font-size 14px
            .progress
                position absolute
                left 0
                bottom 0
                background-color #36D700
                border-bottom-left-radius 3px
                border-bottom-right-radius 3px
                height 4px
</style>
