<template>
    <div class="beConfirmed">
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
                        <p>付款倒计时：<span>{{ol.hour}}:{{ol.min}}:{{ol.second}}</span></p>
                    </section>
                    <section class="status">
                        <p>
                            <span class="payment" @touchend="handleOrder(ol.orderId)">已付款</span>
                        </p>
                    </section>
                </div>
            </div>
        </pull-refresh>
        <handle-box :handleStatus="handleStatus" :handleWords="handleWords"
                    :confirmFn="confirmOrder" :cancelFn="cancelFn"></handle-box>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import HandleBox from '../../common/handleBox'
    import PullRefresh from '../../common/pullRefresh'
    export default {
        name: 'beConfirmed',
        components: {HandleBox,PullRefresh},
        data() {
            return {
                pageNo:1,
                orderListData:[], // 列表
                timerList:[], // 定时器名字列表
                handleStatus:false, // 操作盒子
                handleWords:'是否确认已付款？', // 操作-提示文字
                orderId:'', // 要操作的订单id
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
        methods: {
            ...mapActions(['loadingShowA']),
            timeInterval(s,i){ // 定时器-设置倒计时
                let t=[]
                let hou = Math.floor(s/3600)
                let min = Math.floor(s/60) % 60
                let sec = s % 60
                t[0]=hou < 10 ? '0' + hou : hou
                t[1]=min < 10 ? '0' + min : min
                t[2]=sec < 10 ? '0' + sec : sec

                this.orderListData[i].hour=t[0]
                this.orderListData[i].minute=t[1]
                this.orderListData[i].second=t[2]
            },
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
                        orderState:'STAY_PAY'
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
                                _this.$store.state.reminderWords='还没有待确认订单'
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
                        _this.orderListData.forEach((c,i)=>{ // 设置倒计时
                            let s=Number(c.hour*3600) + Number(c.min*60) + Number(c.second)
                            _this.timerList[i]=setInterval(()=>{
                                if (s>0){
                                    s --
                                    _this.timeInterval(s,i)
                                }else {
                                    clearInterval(_this.timerList[i])
                                }
                            },1000)
                        })
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
            cancelFn(){ // 取消操作
                this.handleStatus=false
            },
            handleOrder(id){ // 显示弹窗
                this.handleStatus=true
                this.orderId=id
            },
            confirmOrder(){ // 点击已付款，确认订单（点击之后状态为已支付）
                let _this=this
                _this.loadingShowA()
                _this.cancelFn() // 关闭操作弹窗
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/card/order/offline/pay`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        orderId:_this.orderId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    if (d.code === 0){
                        _this.$store.state.errorMsg='<span style="color:#4CCF6F;">操作成功！</span>'
                        _this.$store.state.errorStatus=true

                        _this.orderListData=[]
                        _this.beConfirmedFn(1)
                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$store.state.errorMsg=''
//                            _this.$router.go(0)
                        },1000)
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
    .beConfirmed
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
