<template>
    <div class="chooseMember">
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="listsItem">
                <div class="listsCon chooseAll" v-show="memberList.length>0">
                    <section class="choose" :class="{'checked':checkedAllStatus}" @touchend="checkedAllFn"></section>
                    <section class="listWords" @touchend="checkedAllFn">
                        <h3>全选</h3>
                    </section>
                </div>
                <div class="listsCon" v-for="(member,i) in memberList" @touchend="memberFn(i)">
                    <section class="choose" :class="{'checked':checkedArr[i]}"></section>
                    <section class="listPic"><img :src="member.avatar" alt=""></section>
                    <section class="listWords">
                        <h3>{{member.username}}</h3>
                        <p>{{member.mobile}}</p>
                        <!--<section class="onceCard" v-if="member.type==1">欢乐卡</section>-->
                        <!--<section class="discountCard" v-else-if="member.type==2">折扣卡</section>-->
                        <!--<section class="experienceCard" v-else>体验卡</section>-->
                    </section>
                </div>
            </div>
        </pull-refresh>
        <button @touchend="confirmFn" v-show="memberList.length>0">确定</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'chooseMember',
        components: {PullRefresh},
        data() {
            return {
                pageNo:1,
                memberList:[], // 会员列表数据
                checkedAllStatus:false,
                checkedArr:[],
                members:[],
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
        methods: {
            ...mapActions(['loadingShowA']),
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
                            _this.memberList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有会员卡列表'
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
            confirmFn(){
                let member=[]
                if (this.checkedArr.indexOf(true)===-1){
                    this.errorMsg='请选择会员！'
                    this.errorStatus=true
                }else {
                    this.checkedArr.forEach((c,i)=>{
                        if(c){
                            member.push({name:this.memberList[i].username,userId:this.memberList[i].userId})
                        }
                    })
                }
                sessionStorage.setItem('selectMemberList',JSON.stringify(member))
                this.$router.back()
            },
            memberFn(i){
                /*
                * this.$set() 解释：
                *     括号内包括三个属性值，
                *     第一个是 要设置的data
                *     第二个是 要设置的索引
                *     第三个是 要设置的值
                * */
                if (this.checkedArr[i]){
                    this.$set(this.checkedArr,i,false)
                }else {
                    this.$set(this.checkedArr,i,true)
                }
                // 如果数组长度相等，并且this.checkedArr的值全为true，全选按钮选中
                if(this.checkedArr.length===this.memberList.length){
                    if (this.checkedArr.indexOf(false)===-1){
                        this.checkedAllStatus=true
                    }else {
                        this.checkedAllStatus=false
                    }
                }
            },
            checkedAllFn(){ // 全选切换
                if (this.checkedAllStatus){
                    this.memberList.forEach((con,ind)=>{
                        this.checkedAllStatus=false
                        this.$set(this.checkedArr,ind,false)
                    })
                }else {
                    this.memberList.forEach((con,ind)=>{
                        this.checkedAllStatus=true
                        this.$set(this.checkedArr,ind,true)
                    })
                }
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
    @import "../../assets/stylus/listsItem.styl"
    .chooseMember
        padding-bottom 50px
        background-color #FFF
        width 100%
        .listsItem
            width 100%
            .listsCon
                .choose
                    margin-right 14px
                    display inline-block
                    vertical-align middle
                    background url("../../assets/icons/btn_circle@2x.png") center no-repeat
                    background-size 18px
                    width 18px
                    height 18px
                .checked
                    background-image url("../../assets/icons/btn_check@2x.png")
                .listWords
                    width 75.6%
                    position relative
                    background none
                    section
                        position absolute
                        top 12px
                        right 30px
                        padding-left 24px
                        color #333333
                        font-size 17px
                        background-position left center
                        background-repeat no-repeat
                        background-size 18px
            .chooseAll
                padding-top 15px
                font-size 0
                .choose
                    margin-top 4px
                    vertical-align middle
                .listWords
                    padding-bottom 15px
                    background none
                    width 91%
        button
            position fixed
            bottom 0
            left 0
            border 0
            background-color #FFDC71
            color #333
            font-size 17px
            width 100%
            height 50px
        @media screen and (min-width: 320px)
            .listsItem
                .listsCon
                    .listWords
                        width 71%
        @media screen and (min-width: 375px)
            .listsItem
                .listsCon
                    .listWords
                        width 75.5%
        @media screen and (min-width: 414px)
            .listsItem
                .listsCon
                    .listWords
                        width 78%
        @media screen and (min-width: 320px)
            .listsItem
                .chooseAll
                    .listWords
                        width 89%
        @media screen and (min-width: 345px)
            .listsItem
                .chooseAll
                    .listWords
                        width 90%
        @media screen and (min-width: 414px)
            .listsItem
                .chooseAll
                    .listWords
                        width 91%
</style>
