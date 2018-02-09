<template>
    <div class="calendarBuyCard">
        <pull-refresh :intNumber="intNumber" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="calendarBox">
                <div class="calendar" v-for="list in buyCardList">
                    <p>
                        <span class="title">姓名：</span>
                        <span class="content">{{list.username}}</span>
                    </p>
                    <p>
                        <span class="title">手机号：</span>
                        <span class="content">{{list.mobile}}</span>
                    </p>
                    <p v-if="list.changeType!=='4' && list.changeType!=='5'">
                        <span class="title">订单编号：</span>
                        <span class="content">{{list.orderSn}}</span>
                    </p>
                    <p>
                        <span class="title">卡类别：</span>
                        <span class="content">{{list.cardTypeName}}</span>
                    </p>
                    <p>
                        <span class="title">卡名：</span>
                        <span class="content">{{list.cardName}}</span>
                    </p>
                    <p>
                        <span class="title">售价：</span>
                        <span class="content">{{list.faceValue}}</span>
                    </p>

                    <p v-if="list.cardType==='1' && list.changeType==='2'">
                        <span class="title">充值卡次：</span>
                        <span class="content">{{list.times}}次</span>
                    </p>
                    <p v-if="list.cardType==='1' && list.changeType==='4'">
                        <span class="title">发起转售：</span>
                        <span class="content">{{list.times}}次</span>
                    </p>
                    <p v-if="list.cardType==='1' && list.changeType==='5'">
                        <span class="title">转售冲正：</span>
                        <span class="content">{{list.times}}次</span>
                    </p>

                    <p v-if="list.cardType==='1'  && list.changeType==='1'">
                        <span class="title">购买卡次：</span>
                        <span class="content">{{list.times}}次</span>
                    </p>
                    <p  v-if="list.cardType!=='2'">
                        <span class="title" >剩余卡次：</span>
                        <span class="content">{{list.remainTimes}}次</span>
                    </p>
                    <p v-if="list.cardType==='2'">
                        <span class="title"  >折扣率：</span>
                        <span class="content">{{list.discount}}</span>
                    </p>
                    <p  v-if="list.cardType==='2'">
                        <span class="title" >剩余金额：</span>
                        <span class="content">{{list.remainAmount}}</span>
                    </p>
                    <p>
                        <span class="title">购买时间：</span>
                        <span class="content">{{list.buyTime}}</span>
                    </p>
                </div>
            </div>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'calendarBuyCard',
        components: {PullRefresh},
        data() {
            return {
                userId:'',
                searchVal:'', // 搜索 输入的值
                pageNo:1,
                buyCardList:[], // 会员买卡列表数据
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.userId=this.$route.query.userId
            if(this.userId){
                this.getMemberFn(this.pageNo,this.userId)
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            getMemberFn(pn,v,fun){
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/userBuyCardLog`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        memberId:v,
                        pageNo:pn,
                        pageSize:3,
                        keyword:_this.searchVal
                    }
                }).then((res) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    let d=res.data
                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.buyCardList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有买卡记录'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.buyCardList=_this.buyCardList.concat(d.data.list)
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
            moreViewFn(){ // 查看更多
                if (this.moreView==='查看更多'){
                    this.pageNo ++
                    this.getMemberFn(this.pageNo,this.userId)
                }
            },
            getChangeTypeFn(v){
                if(v==='1'){
                    return '购买卡次'
                }else if(v==="2"){
                    return '充值卡次'
                }else if(v==='3'){
                    return '消费卡次'
                }else if(v==='4'){
                    return '发起转售'
                }else {
                    return '不知道是什么'
                }
            },
            resetFn(){ // 重置上拉下拉数据
                this.intNumber={
                    downY:0,
                    upY:0
                }
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getMemberFn(this.pageNo,this.userId,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/cards.styl"
    .calendarBuyCard
        width 100%
        .calendarBox
            width 100%
            .calendar
                margin-bottom 10px
                padding 14px 15px
                background-color #FFF
                P
                    font-size 14px
                    line-height 20px
                    .title
                        color #808080
                    .content
                        color #151515
</style>
