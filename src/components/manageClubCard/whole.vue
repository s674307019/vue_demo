<template>
    <div class="whole">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <ul class="cardList">
                <li class="lists" v-for="cls in cardLists">
                    <!--次卡 cardType=1-->
                    <!--折扣卡 cardType=2-->
                    <!--体验卡 cardType=3-->
                    <router-link class="listMain" :to="{name:'DetailCard',query:{cardId:cls.cardId}}" tag="section">
                        <p class="title" :class="colors[cls.cardType-1]">
                            <img :src="cls.storeLogo" alt="">
                            <span>{{cls.cardName}}</span>
                            <span class="mainMoney">&#165;{{cls.faceValue}}</span>
                        </p>
                        <p class="listMsg">
                            <span v-if="cls.cardType==2">{{cls.cardTypeName}}<span v-show="cls.discount">({{cls.discount/10}}折)</span></span>
                            <span v-else>{{cls.cardTypeName}}<span>({{cls.cardTimes}}次)</span></span>
                            <!--<span class="msgIndate">{{cls.effectiveDate}}前有效</span>-->
                            <span class="msgIndate">截至{{cls.effectiveDate}}</span>
                        </p>
                    </router-link>
                </li>
            </ul>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'whole',
        components: {PullRefresh},
        props:{
            searchVal:{ // 搜索字段
                type:String
            }
        },
        data() {
            return {
                cardLists:[], // 请求的数据
                colors:['color1','color2','color3'], // 不同的卡类型显示不同的class
                pageNo:1, // 页码
                msg:'',
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getCardDataFn(this.pageNo) // 获取数据
        },
        watch: {
            searchVal(nVal,oVal){
                if (nVal){
                    this.pageNo=1 // 如果是搜索数据，则设置为第一页
                    this.getCardDataFn(this.pageNo,this.searchVal)
                }else {
                    this.pageNo=1 // 如果是搜索数据，则设置为第一页
                    this.getCardDataFn(this.pageNo,null)
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            getCardDataFn(pn,sv,fun){
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({ // 获取所有卡片
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/card/cardList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:'5',
                        cardName:sv
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
                            _this.cardLists=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='你当前还未发布卡片'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.cardLists=_this.cardLists.concat(d.data.list)
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
                this.searchVal=''
                this.hasNoMore=false
                this.getCardDataFn(this.pageNo,this.searchVal,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getCardDataFn(this.pageNo,this.searchVal,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/cards.styl"
    .whole
        background-color $white
        width 100%
</style>
