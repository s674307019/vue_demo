<template>
    <div class="myWallet">
        <div class="turnover">
            <section>
                <p>总收入</p>
                <h3>&#165;{{money}}</h3>
            </section>
        </div>
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="touchBalance">
                <router-link v-for="cls in logList" :key="cls.orderId" :to="{name:getRoutName(cls.changeType,cls.orderType),query:{logId:cls.logId}}" tag="section" class="particulars">
                    <p class="msg">
                        <span>{{cls.nickName}}</span>
                        <span class="income" v-if="cls.changeType===1">+{{cls.changeNum}}<sub>元</sub></span>
                        <span class="expenditure" v-else>{{cls.changeNum}}<sub>元</sub></span>
                    </p>
                    <p class="time"><span>{{cls.createTime}}</span></p>
                </router-link>
            </div>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../../common/pullRefresh'
    export default {
        name: 'myWallet',
        components: {PullRefresh},
        data() {
            return {
                money:0, //余额
                logList:[],
                totalPage:1,//总页数
                pageNo:1,
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了

            }
        },
        created() {
            this.getWalletInfo()
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
             getRoutName(changeType,orderType){ // 判断支出还是收入
                if(changeType===1){
                    if(orderType==='1'){
                        return 'GoodsExpenditure' // 商品明细(支出)
                    }else { // orderType=2/3
                        return 'ParticularsIncome' // 余额明细(收入)
                    }
                }else { // changeType=-1
                    return 'ParticularsExpenditure' // 余额明细(支出)
                }
             },
             getWalletInfo(){ // 获取总收入
                let _this=this
                 _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/storeAccount/balance`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.money = d.data.money
                        if (_this.money.toString().indexOf('.')===-1){
                            _this.money=_this.money.toString()+'.00'
                        }

                        _this.getWalletLogPageData(_this.pageNo) // 获取收支列表
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
            getWalletLogPageData(pageNo,fun){ // 获取收支列表-Fun
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/storeAccount/incomeRecord`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pageNo,
                        pageSize:'6'
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
                       // _this.totalPage = d.data.totalPage
                        if(pageNo===1){
                            _this.logList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有消费记录'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.logList=_this.logList.concat(d.data.list)
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
                this.getWalletLogPageData(this.pageNo,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getWalletLogPageData(this.pageNo,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    .myWallet
        width 100%
        .turnover
            $flex()
            background linear-gradient($color5,$color6)
            color $color7
            text-align center
            border-top 1px solid rgba(137,137,137,0.50)
            width 100%
            height 268px
            section
                flex 1
                p
                    font-size 15px
                    line-height 21px
                h3
                    line-height 42px
                    font-size 30px
                    margin 12px 0 37px 0
        .touchBalance
            padding 0 15px
            background-color $white
            .particulars
                padding 11px 0
                $border(bottom)
                .msg
                    font-size 0
                    span
                        color #3C3C3C
                        font-size 15px
                        line-height 18px
                        &:last-child
                            float right
                            font-weight 600
                            sub
                                vertical-align middle
                                font-size 10px
                    .income
                        color #FC9F13
                    .expenditure
                        color #323232
                .time
                    span
                        color #AAB4BE
                        font-size 12px
                &:last-child
                    border-bottom 0
</style>
