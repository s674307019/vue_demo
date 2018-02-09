<template>
    <div class="sent">
        <div class="search">
            <input class="searchInput" type="text" placeholder="搜索"
                   v-model="searchVal"
                   :class="{'searchInputBg':searchVal.length===0}">
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="sentItem">
                <div class="sentList"  v-for="(ml,i) in messageList">
                    <div class="listWords">
                        <section class="title">
                            <span class="arrow" :class="{'msgDetail':msgDetailStatus[i]}" @touchend="msgDetailStatusFn(i)"></span>
                            <p>{{ml.sendTime}}</p>
                            <p v-show="!msgDetailStatus[i]">
                                <span v-if="ml.num<=3">{{getMsgName(ml.nickNameList)}}</span>
                                <span v-else>{{getMsgName(ml.nickNameList)}}等{{ml.num}}人</span>
                            </p>
                            <p v-show="msgDetailStatus[i]">{{getAllMsgName(ml.nickNameList)}}</p>
                        </section>
                        <section class="content">
                            <p>{{ml.content}}</p>
                        </section>
                    </div>
                </div>
            </div>
        </pull-refresh>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'sent',
        components: {PullRefresh},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                searchVal2:'', // 搜索 输入的值
                msgDetailStatus:[], // 是否展看详情
                pageNo:1,
                messageList:[],
                msgNameStr:'',
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getMessageList(this.pageNo,this.searchVal2);
        },
        methods: {
            ...mapActions(['loadingShowA']),
            msgDetailStatusFn(i){
                this.$set(this.msgDetailStatus,i,!this.msgDetailStatus[i])
            },
            getAllMsgName(v){
                let v2='';
                v.forEach((c,i)=>{
                    v2+=v[i]+" ";
                });
                return v2;
            },
            getMsgName(v){
                let v2=''
                if (v.length===1){
                    v2=v[0]
                }
                if (v.length===2){
                    v2+=v[0]+"、"+v[1];
                }
                if (v.length===3){
                    v2+=v[0]+"、"+v[1]+"、"+v[2];
                }
                if(v.length>3){
                    for (var i=0;i<3 ;i++ ) {
                        if(i<2){
                            v2+=v[i]+"、";
                        }else {
                            v2+=v[i];
                        }
                    }
                }

                return v2;
            },
            getMessageList(pn,keyword,fun){ // 获取消息列表
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/message/messageList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:5,
                        keyword:keyword,
                    }
                }).then((res) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    let d=res.data;
//                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.messageList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有已发送消息列表'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.messageList=_this.messageList.concat(d.data.list)
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
                    console.log(err);
                })

            },
            searchBtnFn(){
                this.getMessageList(this.pageNo,this.searchVal)
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
                this.getMessageList(this.pageNo,this.searchVal,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getMessageList(this.pageNo,this.searchVal,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/sent.styl"
    .sent
        position fixed
        top 0
        left 0
        background-color $color9
        width 100%
        height 100%
        overflow-y auto
        .search
            .searchInputBg
                text-indent 2em
                background url("../../assets/icons/icon_search.png") 46% center no-repeat $white
                background-size 13px
</style>
