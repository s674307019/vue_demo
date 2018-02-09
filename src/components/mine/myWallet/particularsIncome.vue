<template>
    <div class="particularsIncome">
        <div class="parMsg">
            <div class="header">
                <section class="money">
                    <span class="sign">+</span>
                    <span class="money">&#165;{{changeNum}}</span>
                </section>
                <section class="msg">
                    <p class="time">{{createTime}}</p>
                    <p class="income">收入</p>
                </section>
            </div>
        </div>
        <ul class="cardList">
            <li class="lists">
                <section class="listMain">
                    <p class="title color1">
                        <img :src="storeLogoUrl" alt="">
                        <span>{{cardName}}</span>
                    </p>
                    <p class="listMsg">
                        <span>{{cardType}}</span>
                    </p>
                </section>
            </li>
        </ul>
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>订单编号</p>
                </section>
                <section class="listText">
                    <p>{{orderSn}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>支付类型</p>
                </section>
                <section class="listText">
                    <p>{{payType}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>交易金额</p>
                </section>
                <section class="listText">
                    <p>&#165;{{payAmount}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>付款时间</p>
                </section>
                <section class="listText">
                    <p>{{payTime}}</p>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'particularsIncome',
        components: {},
        data() {
            return {
                logId:null,//日志Id
                changeNum:0,
                createTime:'',
                orderSn:'',//订单号
                payType:'',//支付类型
                payAmount:0.00 ,//支付金额
                payTime:'',//支付时间
                cardName:'',//卡名称
                cardType:'',//卡类型
                cardImage:'',//卡图片
                cardImageUrl:'',//卡图片url
                storeLogo:'',
                storeLogoUrl:''
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
                        _this.orderSn = d.data.cardOrderBaseInfoVo.orderSn
                        _this.payType =  d.data.cardOrderBaseInfoVo.payTypeName
                        _this.payAmount =  d.data.cardOrderBaseInfoVo.payAmount
                        _this.payTime =  d.data.cardOrderBaseInfoVo.payDate
                        _this.cardName =  d.data.cardOrderBaseInfoVo.cardName
                        let ct=d.data.cardOrderBaseInfoVo.cardType
                        _this.cardType =  ct==='1'?'次卡':ct==='2'?'折扣卡':'体验卡'
                        _this.storeLogoUrl =  d.data.cardOrderBaseInfoVo.storeLogoUrl

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
    @import "../../../assets/stylus/cards.styl"
    .particularsIncome
        width 100%
        background-color $white
        .parMsg
            width 100%
            .header
                padding 15px 13px 15px 22px
                background-color $color6
                border-bottom 1px solid rgba(137,137,137,.5)
                width @width
                section
                    display inline-block
                    vertical-align middle
                    color $color7
                    font-size 0
                    &.money
                        .sign
                            margin-right 8px
                            font-size 36px
                        .money
                            font-size 46px
                    &.msg
                        margin-top 2px
                        float right
                        text-align right
                        .time
                            margin 5px 0 8px 0
                            font-size 12px
                        .income
                            font-size 17px
        .cardList
            padding-bottom 0
            $border(bottom)
            .lists
                margin-bottom 0
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
