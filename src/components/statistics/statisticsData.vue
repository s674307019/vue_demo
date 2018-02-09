<template>
    <div class="statisticsData">
        <div class="selectBox">
            <div class="selectType">
                <select v-model="dateType">
                    <option value="week">本周</option>
                    <option value="months">本月</option>
                    <option value="quarter">本季度</option>
                </select>
                <span></span>
            </div>
            <div class="selectType">
                <select v-model="cardType">
                    <option value="1">次卡</option>
                    <option value="2">折扣卡</option>
                </select>
                <span></span>
            </div>
        </div>
        <router-view :cardType="cardType"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'statisticsData',
        data() {
            return {
                dateType:'week', // 默认week
                dateTypeWords:'本周', // 默认本周
                dateTypeStatus:false, // 控制显示dateType列表
                cardType:'1', // 默认次卡
                cardTypeWords:'次卡',
                cardTypeStatus:false
            }
        },
        computed: {},
        watch: {
            dateType(nv,ov){
                if (nv==='week'){
                    this.$router.replace('/statisticsData/dataWeek')
                }else if (nv==='months'){
                    this.$router.replace('/statisticsData/dataMonth')
                }else {
                    this.$router.replace('/statisticsData/dataQuarter')
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .statisticsData
        position fixed
        top 0
        let 0
        padding 15px 0
        background-color #FFF
        width 100%
        height 100%
        overflow-y auto
        .selectBox
            padding 0 15px
            margin-bottom 15px
            .selectType
                margin-right 15px
                display inline-block
                vertical-align middle
                width 20%
                font-size 0
                select
                    vertical-align middle
                    background none
                    appearance none
                    border 0
                    font-size 17px
                    color #000
                span
                    display inline-block
                    vertical-align middle
                    background url("../../assets/icons/btn_down@2x.png") right center no-repeat
                    background-size 11px 6px
                    width 15px
                    height 6px
</style>
