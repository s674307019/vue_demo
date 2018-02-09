<template>
    <div class="home">
        <div class="turnover">
            <section>
                <p>今日营业额</p>
                <h3>￥{{turnover}}</h3>
                <!--<router-link to="/cashiering" tag="button">收银</router-link>-->
                <button @touchend="cashieringFn">收银</button>
            </section>
        </div>
        <div class="menu">
            <ul>
                <router-link to="/manageClubCard/whole" tag="li">
                    <section>
                        <img src="../../assets/icons/icon_merchant_card@2x.png" alt="">
                        <p>会员卡管理</p>
                    </section>
                </router-link>
                <router-link to="/manageMember" tag="li">
                    <section>
                        <img src="../../assets/icons/icon_merchant_vip@2x.png" alt="">
                        <p>会员管理</p>
                    </section>
                </router-link>
                <router-link to="/statistics" tag="li">
                    <section>
                        <img src="../../assets/icons/icon_merchant_count@2x.png" alt="">
                        <p>统计分析</p>
                    </section>
                </router-link>
            </ul>
            <ul>
                <router-link to="/manageGoods" tag="li">
                    <section>
                        <img src="../../assets/icons/icon_merchant_goods@2x.png" alt="">
                        <p>商品管理</p>
                    </section>
                </router-link>
                <router-link to="/message" tag="li">
                    <section>
                        <img src="../../assets/icons/icon_merchant_mms@2x.png" alt="">
                        <p>发送消息</p>
                    </section>
                </router-link>
                <li></li>
            </ul>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'home',
    data() {
        return {
            turnover:'0.00', // 今日营业额
            stateStatus:'1' // 店铺审核是否成功
        }
    },
    created() {
//        console.log(this.$store.state.STOREINFO)
        if (!this.$store.state.STOREINFO.ACCESSTOKEN){ // 检测到用户未登陆，则跳转到登录页
            this.$router.replace('/login/inputMobile')
            return
        }else {
            if (this.$store.state.STOREINFO.ISPERFECTINFOMATION==='N'){ // 检查有没有输入店铺信息
                this.$router.replace('/shopCertify')
                return
            }else {
                this.turnoverToday() // 请求今日营业额数据
            }
        }
    },
    methods: {
        ...mapActions(['loadingShowA','wxConfigFnA']),
        turnoverToday(){ // 请求今日营业额数据
            let _this=this
            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/store/storeAccount/turnover`,
                headers:{
                    accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                },
                params:{
                    storeId:_this.$store.state.STOREINFO.STOREID
                }
            }).then((res) => {
                _this.loadingShowA()
                let d=res.data
//                console.log(d)
                if (d.code===0){
                    _this.turnover=d.data.turnover

                    _this.auditResultFn() // 查看审核状态

                    _this.wxConfigFnA() // 请求微信签名
                }
            }).catch((err) => {
                _this.loadingShowA()
                _this.$store.state.errorMsg='网络异常！'
                _this.$store.state.errorStatus=true
                console.log(err)
            })
        },
        auditResultFn(){ // 查看审核状态
            let _this=this
//            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/store/auditResult`,
                headers:{
                    accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                },
                params:{
                    storeId:_this.$store.state.STOREINFO.STOREID
                }
            }).then((res) => {
//                _this.loadingShowA()
                let d=res.data
//                console.log(d)
                if (d.code===0){
                    // 店铺状态：0 待审核 1审核成功 2 审核失败
                    localStorage.setItem('stateStatusVal',d.data.state)
                    _this.$store.state.stateStatusVal=d.data.state
                    if (d.data.state==='0'){
                        _this.stateStatus='0'
                        _this.$store.state.shopChecking=true
                    }else if(d.data.state==='1'){
                        _this.stateStatus='1'
                        if (d.data.isRead==='N'){
                            _this.$store.state.shopChecking=false
                            _this.$store.state.checkPass=true
                        }
                    }else {
                        let reason=d.data.auditResult.split(',') // 拒绝理由
                        let words=''
                        reason.forEach((c,i)=>{
                            words+=`<p>${c}</p>`
                        })
                        _this.$store.state.declineWords=words

                        _this.$store.state.checkNotPass=true
                    }
                }
            }).catch((err) => {
//                _this.loadingShowA()
                _this.$store.state.errorMsg='网络异常！'
                _this.$store.state.errorStatus=true
                console.log(err)
            })
        },
        cashieringFn(){ // 点击收银
            if (this.stateStatus==='1'){
                this.$router.push('/cashiering')
            }else {
                this.$store.state.errorMsg='您还不能进行此操作'
                this.$store.state.errorStatus=true
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .home
        padding-bottom 60px
        background-color $white
        width 100%
        .turnover
            $flex()
            background linear-gradient(90deg,$color5,$color6)
            color $color7
            text-align center
            border-top 1px solid rgba(137,137,137,0.50)
            width 100%
            height 270px
            section
                flex 1
                p
                    font-size 15px
                    line-height 21px
                h3
                    line-height 42px
                    font-size 30px
                    margin 12px 0 37px 0
                button
                    font-size 15px
                    border 1px solid $color8
                    background-color $white
                    border-radius 16px
                    width 114px
                    height 32px
        .menu
            background-color $white
            margin -16px auto 0 auto
            box-shadow 0 0 20px #f0f0f0
            border-radius 7px
            width 89.6%
            height 290px
            ul
                $flex()
                width 100%
                height 50%
                &:first-child
                    $border(bottom)
                li
                    flex 1
                    $flex()
                    text-align center
                    width 30%
                    height 100%
                    vertical-align bottom
                    $border(right)
                    cursor pointer
                    &:last-child
                        border-right 0
                    img
                        height 35px
                        vertical-align bottom
                    p
                        margin-top 15px
                        line-height 14px
                        color $black
                        font-size 12px
        @media screen and (min-height: 672px) // iPhone 6p、7p手机
            .turnover
                height 339px
</style>
