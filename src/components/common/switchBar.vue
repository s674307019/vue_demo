<template>
    <div class="switchBar">
        <section>
            <p class="switchBtn" @touchend="switchFn">
                    <span class="btn1"
                          v-show="!switchStatus"
                          :class="{'btn1Active':!switchStatus}"></span>
                <span class="btn2"
                      v-show="switchStatus"
                      :class="{'btn2Active':switchStatus}"></span>
            </p>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'switchBar',
        props:{
            switchStatus:{
                type:Boolean
            },
            switchFn:{
                type:Function
            }
        },
        data() {
            return{
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
    .switchBar
        font-size 0
        section
            .switchBtn
                display inline-block
                vertical-align middle
                border 1px solid #D1D1D1
                width 55px
                height 26px
                border-radius (@height/2)
                position relative
                span
                    position absolute
                    top 3px
                    display inline-block
                    width 18px
                    height 18px
                    border-radius (@height/2)
                    transition right .5s
                    &.btn1
                        right 6px
                        background-color #C9C9C9
                        &.btn1Active
                            right 31px
                    &.btn2
                        left 6px
                        background-color #FFDC71
                        &.btn2Active
                            left 31px
</style>
