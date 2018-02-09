<template>
    <div class="particularsExpenditure">
        <div class="parMsg">
            <div class="header">
                <section class="money">
                    <span class="sign">-</span>
                    <span class="money">&#165;{{changeNum}}</span>
                </section>
                <section class="msg">
                    <p class="time">{{createTime}}</p>
                    <p class="income">退款</p>
                </section>
            </div>
        </div>
        <div class="projectBox">
            <div class="projectList">
                <div class="projectInfo">
                     <section class="img"><img :src="goodsImageUrl" alt=""></section>
                    <section class="text">
                        <p class="goodsName">{{goodsName}}</p>
                        <p class="goodsMsg"><span>{{goodsTypeName}}</span></p>
                    </section>
                </div>
            </div>
        </div>
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>退款编号</p>
                </section>
                <section class="listText">
                    <p>{{refundSn}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>退款原因</p>
                </section>
                <section class="listText">
                    <p>{{refundReason}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>退款金额</p>
                </section>
                <section class="listText">
                    <p>&#165;{{refundAmount}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>申请时间</p>
                </section>
                <section class="listText">
                    <p>{{refundTime}}</p>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'particularsExpenditure',
        components: {},
        data() {
            return {
                logId:null, // 日志Id
                changeNum:0,
                createTime:'',
                refundSn:'', // 订单号
                refundReason:'',
                payType:'', // 支付类型
                refundAmount:0.00, // 支付金额
                payTime:'', // 支付时间
                goodsName:'', // 商品名称
                goodsTypeName:'', // 商品类型名称
                goodsImage:'', // 商品图片
                goodsImageUrl:'', // 商品图片url
                refundTime:'' // 退款时间
            }
        },
        created() {
            let logId=this.$route.query.logId
            this.getLogInfo(logId)
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            getLogInfo(logId){
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/storeAccount/recordDetails`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        logId:logId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    if (d.code === 0){
//                        console.log(d.data)
                        _this.changeNum = d.data.changeNum
                        _this.createTime = d.data.createTime
                        _this.refundSn = d.data.refundOrderInfoVo.refundSn
                        _this.refundReason = d.data.refundOrderInfoVo.refundReason
                        _this.payType =  d.data.refundOrderInfoVo.payTypeName
                        _this.refundAmount =  d.data.refundOrderInfoVo.refundAmount
                        _this.refundTime =  d.data.refundOrderInfoVo.refundTime
                        _this.goodsName =  d.data.refundOrderInfoVo.goodsName
                        _this.goodsTypeName =  d.data.refundOrderInfoVo.goodsTypeName
                        _this.goodsImageUrl =  d.data.refundOrderInfoVo.goodsImage
//                        console.log(_this.goodsImageUrl)

                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    @import "../../../assets/stylus/projectOrder.styl"
    .particularsExpenditure
        width 100%
        background-color $white
        .parMsg
            width 100%
            .header
                padding 15px
                background-color $color6
                border-bottom 1px solid rgba(137,137,137,.5)
                width @width
                section
                    display inline-block
                    vertical-align middle
                    color $color7
                    font-size 0
                    position relative
                    &.money
                        .sign
                            margin-right 8px
                            font-size 36px
                        .money
                            font-size 46px
                    &.msg
                        position absolute
                        right 15px
                        top 18px
                        text-align right
                        .time
                            margin 5px 0 8px 0
                            font-size 12px
                        .income
                            font-size 17px
        .projectBox
            .projectList
                .projectInfo
                    .text
                        p.goodsName
                            font-size 17px
                            margin-bottom 14px
        .listsBox
            margin-top 10px
            .listXs
                border 0
                height 34px
                line-height @height
                .listTitle,.listText
                    p
                        font-size 14px
</style>
