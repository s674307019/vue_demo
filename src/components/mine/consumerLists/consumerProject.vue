<template>
    <div class="consumerProject">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="myOrderLists">
                <div class="orderList" v-for="cld in consumerListsData" :key="cld.orderSn">
                    <section class="msg">
                        <p>昵称：<span>{{cld.nickName}}</span></p>
                        <p>手机号：<span>{{cld.mobile}}</span></p>
                        <p>订单编号：<span>{{cld.orderSn}}</span></p>
                        <p>消费项目：<span>{{cld.goodsName}}</span></p>
                        <p>消费金额：<span>{{cld.consumeAmount}}</span></p>
                        <p>数量：<span>{{cld.goodsNum}}</span></p>
                        <p>日期：<span>{{cld.consumeTime}}</span></p>
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
        name: 'consumerProject',
        components: {PullRefresh},
        props:{
            searchVal:{
                type:String
            }
        },
        data() {
            return {
                pageNo:1,
                consumerListsData:[],
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.consumerProjectFn(this.pageNo)
        },
        computed: {},
        watch: {
            searchVal(nv,ov){
                this.pageNo=1
                this.consumerCardFn(this.pageNo)
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            consumerProjectFn(pn,fun){ // 获取列表
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/consume/memberGoodsConsumeList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:5,
                        keyword:_this.searchVal
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
                            _this.consumerListsData=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有项目消费清单'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.consumerListsData=_this.consumerListsData.concat(d.data.list)
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
                this.consumerProjectFn(this.pageNo,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.consumerProjectFn(this.pageNo,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/mineClubCardOrderList.styl"
    .consumerProject
        width 100%
</style>
