<template>
    <div class="completed">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="myOrderLists">
                <div class="orderList" v-for="ol in orderListData" :key="ol.orderId">
                    <section class="header">
                        <img :src="ol.buyerAvatarUrl" alt="">
                        <span class="mobile">{{ol.buyerMobile}}</span>
                        <span class="time">{{ol.addTime}}</span>
                    </section>
                    <section class="msg">
                        <p>订单号：<span>{{ol.orderSn}}</span></p>
                        <p>会员卡名称：<span>{{ol.cardName}}</span></p>
                        <p>金额：<span class="money">{{ol.payAmount}}</span></p>
                    </section>
                    <section class="status">
                        <p>
                            <span :class="{'closed':ol.orderStateName==='已关闭','paid':ol.orderStateName==='已支付'}">{{ol.orderStateName}}</span>
                        </p>
                    </section>
                </div>
            </div>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../../common/pullRefresh'
    export default {
        name: 'completed',
        components: {PullRefresh},
        data() {
            return {
                pageNo:1,
                orderListData:[], // 列表
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.beConfirmedFn(this.pageNo) // 页面初始化完成 请求数据
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            beConfirmedFn(pn,fun){ // 数据请求
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/card/order/list`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        pageNo:pn,
                        pageSize:5,
                        orderState:null
                    }
                }).then((res) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.orderListData=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有已完成订单'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.orderListData=_this.orderListData.concat(d.data.list)
                            if (d.data.list.length===0){
                                _this.hasNoMore=true
                            }else {
                                _this.hasNoMore=false
                            }
                        }
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            resetFn(){ // 重置上拉下拉数据
                this.intNumber={
                    downY:0,
                    upY:0
                }
            },
            pullDownFn(){
                // 下拉刷新
                this.pageNo=1
                this.hasNoMore=false
                this.beConfirmedFn(this.pageNo,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.beConfirmedFn(this.pageNo,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/mineClubCardOrderList.styl"
    .completed
        width 100%
        .moreView
            margin 0 auto 10px auto
            padding 5px 0
            font-size 14px
            text-align center
            background-color #F2F2F2
            border-radius 15px
            width 25%
</style>
