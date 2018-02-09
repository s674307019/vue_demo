<template>
    <div class="waitConsumption">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="myOrderLists">
                <div class="orderList" v-for="opd in orderProjectData" :key="opd.orderId">
                    <section class="header">
                        <img :src="opd.buyerAvatarUrl" alt="">
                        <span class="mobile">{{opd.buyerMobile}}</span>
                        <span class="time">{{opd.addTime}}</span>
                    </section>
                    <section class="msg">
                        <p><span>订单号：{{opd.orderSn}}</span></p>
                        <p><span>项目名称：{{opd.goodsName}}</span></p>
                        <p><span>金额：{{opd.payAmount}}</span></p>
                        <p><span>数量：{{opd.goodsNum}}</span></p>
                    </section>
                    <section class="status">
                        <p>
                            <span class="waitConsumption">{{opd.orderStateName}}</span>
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
        name: 'waitConsumption',
        components: {PullRefresh},
        data() {
            return {
                pageNo:1,
                orderProjectData:[],
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.waitConsumptionFn(this.pageNo)
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            waitConsumptionFn(pn,fun){ // 获取列表
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/goods/order/list`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        pageNo:pn,
                        pageSize:5,
                        orderState:'STAY_USE'
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
                            _this.orderProjectData=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有待消费'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.orderProjectData=_this.orderProjectData.concat(d.data.list)
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
                this.waitConsumptionFn(this.pageNo,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.waitConsumptionFn(this.pageNo,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/mineClubCardOrderList.styl"
    .waitConsumption
        width 100%
</style>
