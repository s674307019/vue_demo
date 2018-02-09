<template>
    <div class="mine">
        <div class="header">
            <span class="hBg"><img :src="urlPic+headerPic" alt=""></span>
            <span class="hBg2"></span>
            <section class="hText">
                <router-link to="/myInfo" tag="span" class="hPic"><img :src="urlPic+headerPic" alt=""></router-link>
                <h3>{{storeName}}</h3>
            </section>
        </div>
        <div class="listsBox">
            <router-link to="/orderCard/beConfirmed" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>会员卡订单</p>
                </section>
            </router-link>
            <router-link to="/orderProject/waitRefund" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>商品订单</p>
                </section>
            </router-link>
            <router-link to="/myWallet" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>我的钱包</p>
                </section>
            </router-link>
            <router-link to="/consumerLists/consumerProject" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>消费清单</p>
                </section>
            </router-link>
            <router-link to="/setting" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>设置</p>
                </section>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mine',
    components: {},
    data() {
        return {
            urlPic:this.$store.state.STOREINFO.QINIUPREFIX,
            headerPic:'', // 店铺logo
            storeName:'' // 店铺名字
        }
    },
    created() {
        this.headerPic=this.$store.state.STOREINFO.STORELOGO
        this.storeName=this.$store.state.STOREINFO.STORENAME

        this.auditResultFn()
    },
    methods:{
        auditResultFn(){ // 查看审核状态
            let _this=this
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
                let d=res.data
//                console.log(d)
                if (d.code===0){
                    // 店铺状态：0 待审核 1审核成功 2 审核失败
                    localStorage.setItem('stateStatusVal',d.data.state)
                    _this.$store.state.stateStatusVal=d.data.state
                    if (d.data.state==='0'){
                        _this.$store.state.shopChecking=true
                    }else if(d.data.state==='1'){
                        if (d.data.isRead==='N'){
                            _this.$store.state.shopChecking=false
                            _this.$store.state.checkPass=true
                        }
                    }else {
                        let reason=d.data.auditResult.split(',') // 决绝理由
                        let words=''
                        reason.forEach((c,i)=>{
                            words+=`<p>${c}</p>`
                        })
                        _this.$store.state.declineWords=words

                        _this.$store.state.checkNotPass=true
                    }
                }
            }).catch((err) => {
                _this.$store.state.errorMsg='网络异常！'
                _this.$store.state.errorStatus=true
                console.log(err)
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .mine
        padding-bottom 50px
        width 100%
        font-size 0
        .header
            position relative
            width @width
            height 235px
            overflow hidden
            .hBg
                position absolute
                top 0
                left 0
                z-index -2
                display block
                width 100%
                height 235px
                overflow hidden
                img
                    display block
                    margin -5% 0 0 -5%
                    filter blur(5px)
                    width 110%
                    height 110%
            .hBg2
                position absolute
                top 0
                left 0
                z-index -1
                display block
                width 100%
                height 235px
                box-shadow 0 -30px 20px rgba(0,0,0,.2) inset
            .hText
                display flex
                flex-direction column
                margin-top 35px
                width 100%
                text-align center
                .hPic
                    margin 0 auto
                    width 132px
                    img
                        border-radius 6px
                        border 2px solid $white
                        width 132px
                        height 132px
                h3
                    margin-top 27px
                    font-size 17px
                    color $white
</style>
