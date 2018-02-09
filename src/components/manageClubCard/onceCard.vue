<template>
    <div class="onceCard">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <ul class="cardList">
                <li class="lists" v-for="cls in cardLists">
                    <router-link :to="{name:'DetailCard',query:{cardId:cls.cardId}}" tag="section"  class="listMain">
                        <p class="title color1">
                            <img :src="cls.storeLogo" alt="">
                            <span>{{cls.cardName}}</span>
                            <span class="mainMoney">&#165;{{cls.faceValue}}</span>
                        </p>
                        <p class="listMsg">
                            <span>{{cls.cardTypeName}}<span>({{cls.cardTimes}}次)</span></span>
                            <span class="msgIndate">{{cls.effectiveDate}}前有效</span>
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
        name: 'onceCard',
        components: {PullRefresh},
        props:{
            searchVal:{ // 搜索字段
                type:String
            }
        },
        data() {
            return {
                cardLists:[],
                pageNo:1,
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getCardDataFn(this.pageNo)
        },
        computed: {},
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
                _this.$emit('loadingShowFn',true)
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/card/cardList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:'5',
                        cardType:'1',
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
    .onceCard
        background-color $white
        width 100%
</style>
