<template>
    <div class="manageMember">
        <div class="search" v-show="memberList.length>0">
            <input class="searchInput" type="text" placeholder="输入会员名称/手机号搜索"
                   v-model="searchVal"
                   :class="{'searchInputBg':searchVal.length===0}">
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="listsItem">
                <router-link :to="{name:'MemberDetail',query:{userId:ml.userId}}" tag="div" class="listsCon" v-for="ml in memberList" :key="ml.userId">
                    <section class="listPic"><img :src="ml.avatar" alt=""></section>
                    <section class="listWords" style="width: 81%;">
                        <h3 :class="{'iconNew':ml.tag==='Y'}">{{ml.username}}</h3>
                        <p>{{ml.mobile}}</p>
                    </section>
                </router-link>
            </div>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'manageMember',
        components: {PullRefresh},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                searchVal2:'',
                pageNo:1,
                memberList:[], // 会员列表数据
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getMemberFn(this.pageNo)
        },
        computed: {},
        watch: {
            searchVal2(nv,ov){
                this.pageNo=1
                this.getMemberFn(this.pageNo)
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            searchBtnFn(){
                this.searchVal2=this.searchVal
            },
            getMemberFn(pn,fun){
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/memberList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:10,
                        keyword:_this.searchVal2
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
                            _this.memberList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有会员列表'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.memberList=_this.memberList.concat(d.data.list)
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
                this.getMemberFn(this.pageNo,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getMemberFn(this.pageNo,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/listsItem.styl"
    .manageMember
        width 100%
        .search
            .searchInputBg
                text-indent 2em
                background url("../../assets/icons/icon_search.png") 26% center no-repeat $white
                background-size 13px
        @media screen and (min-width: 320px)
            .search
                .searchInputBg
                    background-position 20% center
        @media screen and (min-width: 375px)
            .search
                .searchInputBg
                    background-position 25% center
        @media screen and (min-width: 414px)
            .search
                .searchInputBg
                    background-position 28% center
</style>
