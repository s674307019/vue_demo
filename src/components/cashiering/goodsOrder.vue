<template>
    <div class="cashOrder" v-show="cashOrderData.buyerName">
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>昵称</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.buyerName}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>电话</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.buyerMobile}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>订单号</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.orderSn}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>状态</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.orderStateName}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>项目名称</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.goodsName}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>总金额</p>
                </section>
                <section class="listText">
                    <p>&#165;{{cashOrderData.payAmount}}</p>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>数量</p>
                </section>
                <section class="listText">
                    <p>{{cashOrderData.goodsNum}}</p>
                </section>
            </div>
        </div>
        <button @touchend="confirmCash">确认消费</button>
        <deal-success v-show="dealSuccess"></deal-success>
        <deal-fail v-show="dealFail" :failMsg="failMsg" :dealFailFn="dealFailFn"></deal-fail>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    import DealSuccess from './dealSuccess'
    import DealFail from './dealFail'
    export default {
        name: 'cashOrder',
        components: {DealSuccess,DealFail},
        data() {
            return {
                cashOrderData:{},
                orderId:'',
                useNo:'',
                errorStatus:false, // 错误信息提醒
                errorMsg:'',
                loadingShow:false,
                dealSuccess:false, // 消费成功
                dealFail:false, // 消费失败
                failMsg:''
            }
        },
        created() {
            this.useNo=this.$store.state.consumNo
            if (!this.useNo){
                this.$router.back()
            }
            this.getDataFn()
        },
        methods: {
            ...mapActions(['loadingShowA']),
            getDataFn(){ // 根据卡号查询卡
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/cashier/search/goods`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        useNo:_this.useNo
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.cashOrderData=d.data
                        _this.orderId=d.data.orderId
                    }else {
                        _this.$store.state.errorMsg=d.msg
//                        _this.$store.state.errorMsg='请输入正确的消费码'
                        _this.$store.state.errorStatus=true
                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$router.back()
                        },2000)
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            confirmCash(){ // 确认消费
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/cashier/use/goods`,
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
//                    console.log(d)
                    if (d.code === 0){
                        _this.dealSuccess=true
                        setTimeout(()=>{
                            _this.dealSuccess=false
                            _this.$store.state.consumNo=''
                            _this.$router.back()
                        },2000)
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
            dealFailFn(e){
                e.preventDefault()
                this.dealFail=false
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .cashOrder
        width 100%
        button
            $button(fixed,$color6,$color7,100%)
</style>
