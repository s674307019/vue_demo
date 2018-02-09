<template>
    <div class="memberDetail">
        <div class="listsBox" v-show="memberDetail.mobile">
            <div class="listXs">
                <section class="listTitle">
                    <p>姓名</p>
                </section>
                <section class="listText">{{memberDetail.username}}</section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>昵称</p>
                </section>
                <section class="listText">{{memberDetail.nickName}}</section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>性别</p>
                </section>
                <section class="listText">{{sexFn(memberDetail.sex)}}</section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>生日</p>
                </section>
                <section class="listText">{{memberDetail.birthday}}</section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>手机号</p>
                </section>
                <section class="listText">{{memberDetail.mobile}}</section>
            </div>
            <router-link :to="{name:'CalendarBuyCard',query:{userId:userId}}" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>买卡记录</p>
                </section>
            </router-link>
        </div>
        <button @touchend="handleStatus=true">删除</button>
       <handle-box :handleStatus="handleStatus" :handleWords="'确定要删除吗?'" :confirmFn="deleteMemberFn" :cancelFn="cancelFn"></handle-box>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import HandleBox from '../common/handleBox'
    export default {
        name: 'memberDetail',
        components: {HandleBox},
        data() {
            return {
                userId:'',
                memberDetail:{},// 会员信息
                handleStatus:false
            }
        },
        created() {
            this.userId=this.$route.query.userId
            if(this.userId){
                this.getMemberFn(this.userId) // 获取会员信息
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            cancelFn(e){ // 取消
                e.preventDefault()
                this.handleStatus=false
            },
            getMemberFn(v){ // 获取会员信息
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/memberDetails`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        memberId:v
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.memberDetail=d.data
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
            sexFn(v){
                if(v==1){
                    return '男';
                }else if(v==2){
                    return '女'
                }else {
                    return '未知'
                }
            },
            deleteMemberFn(){ // 确定
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/deleteMember`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        memberId:_this.userId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data

                    if (d.code === 0){
                        _this.$router.go(-1)
                    }else {
                        _this.errorStatus=true
                        _this.errorMsg=d.msg
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.errorMsg='网络异常！'
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .memberDetail
        position fixed
        left 0
        top 0
        width 100%
        height 100%
        background-color $color9
        button
            $button(fixed,$white,#F00,100%)
</style>
