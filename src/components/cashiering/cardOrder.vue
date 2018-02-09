<template>
    <div class="resultScanning" v-show="resultData.buyerName">
        <div class="textMsg">
            <section class="tList">
                <div class="text">
                    <p>昵称：{{resultData.buyerName}}</p>
                    <p>手机号：{{resultData.buyerMobile}}</p>
                </div>
                <img class="img" :src="resultData.buyerAvatarUrl" alt="">
            </section>
            <section class="tList">
                <div class="text">
                    <p>卡类型：{{resultData.cardTypeName}}</p>
                    <p v-if="resultData.cardType==='2'">折扣率：{{resultData.discount/10}}</p>
                    <p>卡名称：{{resultData.cardName}}</p>
                    <p>有效期：{{resultData.effectiveDate}}</p>
                </div>
            </section>
            <section class="tList">
                <div class="text">
                    <p v-if="resultData.cardType==='2'">剩余金额：<span class="money">&#165;{{resultData.remainAmount}}</span></p>
                    <p v-else>剩余卡次：<span class="money">{{resultData.remainTimes}}</span></p>
                </div>
            </section>
        </div>
        <div class="consumerItem">
            <p><span>消费项目(商品)</span></p>
            <router-link to="/chooseGoodsItem" tag="span" class="img"><img src="../../assets/icons/btn_add_black@2x.png" alt=""></router-link>
        </div>
        <div class="goods" v-show="goodsLists.length>0">
            <div class="gList" v-for="(gls,i) in goodsLists" :key="gls.goodsId">
                <p class="goodsName">商品名：{{gls.goodsName}}</p>
                <span class="delete" @touchend="deleteGoodsFn(i)"></span>
                <span class="img"><img :src="gls.goodsImageUrl" alt=""></span>
                <section class="gText">
                    <span class="money">会员价：&#165;{{gls.price}}</span>
                    <p class="amount">
                        <span @touchend="subtract(i)">−</span>
                        <input type="number" min="1"
                               v-model="numberCount[i]" @blur="checkInputFn(i)" @keyup="checkInputFn(i)">
                        <span @touchend="plus(i)">+</span>
                    </p>
                </section>
            </div>
        </div>
        <div class="subtotal" v-show="goodsLists.length>0">
            <span v-if="resultData.cardType==='2'">金额小计</span>
            <span v-else>数量小计</span>
            <span class="money" v-if="resultData.cardType==='2'">&#165;{{subtotalMoney}}</span>
            <span class="money" v-else>{{subtotalTimes}}</span>
        </div>
        <div class="buyBox" style="background-color: #FFF;"  v-show="goodsLists.length>0">
            <span class="total" v-if="resultData.cardType==='2'">合计：</span>
            <span class="total" v-else>合计次数：</span>
            <span class="count" v-if="resultData.cardType==='2'">&#165;{{subtotalMoney}}</span>
            <span class="count" v-else>{{subtotalTimes}}</span>
            <span class="buyNow">
                <span class="buyOnLine" @touchend="checkPayFn">确认消费</span>
            </span>
        </div>
        <deal-success v-show="dealSuccess"></deal-success>
        <deal-fail v-show="dealFail" :failMsg="failMsg" :dealFailFn="dealFailFn"></deal-fail>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

    import DealSuccess from './dealSuccess'
    import DealFail from './dealFail'
    export default {
        name: 'resultScanning',
        components: {DealSuccess,DealFail},
        data() {
            return {
                cardType:'', // 卡类型
                discount:'', // 卡折扣
                remainAmount:0, // 卡金额
                remainTimes:0, // 卡次数
                numberCount:[], // 数量
                cardNo:'',
                resultData:{},
                goodsLists:[],
                cardId:'',
                subtotalMoney:0, // 小计-钱
                subtotalTimes:0, // 小计-次数
                dealSuccess:false, // 消费成功
                dealFail:false, // 消费失败
                failMsg:''
            }
        },
        created() {
            this.cardNo=this.$store.state.consumNo // vuex-保存的数据(商品消费码)
            if (!this.cardNo){
                this.$router.back()
            }
            this.getDataFn()
        },
        methods: {
            ...mapActions(['loadingShowA']),
            dealFailFn(e){
                e.preventDefault()
                this.dealFail=false
            },
            checkInputFn(ind){ // 验证输入
                let nc=this.numberCount[ind].toString()
                if (nc){
                    let inNum=nc.replace(/\D/g,'')
                    if (parseInt(inNum)===0){
                        this.$store.state.errorMsg='消费次数必须是大于1的整数'
                        this.$store.state.errorStatus=true
                        this.numberCount[ind]=0
                    }
                }else {
                    this.$store.state.errorMsg='消费次数必须是大于1的整数'
                    this.$store.state.errorStatus=true
                    this.numberCount[ind]=0
                }
                this.totalFn()
            },
            totalFn(){ // 总计
                let total=0
                if (this.cardType==='2'){ // 折扣卡
                    this.goodsLists.forEach((c,i)=>{
                        total+=this.numberCount[i]*c.price
                    })
                    let sub=(total*(this.discount/100)).toFixed(2)
                    if (sub>parseFloat(this.remainAmount)){
                        this.$store.state.errorMsg='消费金额不能大于剩余金额'
                        this.$store.state.errorStatus=true
                    }
                    this.subtotalMoney=sub
                }else { // 次卡
                    this.goodsLists.forEach((c,i)=>{
                        total+=parseInt(this.numberCount[i])
                    })
                    if (total>parseInt(this.remainTimes)){
                        this.$store.state.errorMsg='消费次数不能大于卡次数'
                        this.$store.state.errorStatus=true
                    }
                    this.subtotalTimes=total
                }
            },
            plus(ind){ // 数量增加
                if (this.cardType==='2'){
                    let remainAmount=parseFloat(this.remainAmount)
                    if (remainAmount>0){
                        let totalAmount=0
                        this.goodsLists.forEach((c,i)=>{
                            totalAmount+=parseInt(this.numberCount[i])
                        })
                        if (totalAmount<remainAmount){
                            this.numberCount[ind]=parseInt(this.numberCount[ind])+1
                        }else {
                            this.$store.state.errorMsg='消费金额不能大于剩余金额'
                            this.$store.state.errorStatus=true
                        }
                    }else {
                        this.$store.state.errorMsg='消费次数不能大于卡次数'
                        this.$store.state.errorStatus=true
                    }
                }else {
                    let remainTimes=parseInt(this.remainTimes)
                    if (remainTimes>0){
                        let totalTimes=0
                        this.goodsLists.forEach((c,i)=>{
                            totalTimes+=parseInt(this.numberCount[i])
                        })
                        if (totalTimes<remainTimes){
                            this.numberCount[ind]=parseInt(this.numberCount[ind])+1
                        }else {
                            this.$store.state.errorMsg='消费次数不能大于卡次数'
                            this.$store.state.errorStatus=true
                        }
                    }else {
                        this.$store.state.errorMsg='消费次数不能大于卡次数'
                        this.$store.state.errorStatus=true
                    }
                }
                this.totalFn()
            },
            subtract(ind){ // 数量减少
                if (parseInt(this.numberCount[ind])>1){
                    this.numberCount[ind]=parseInt(this.numberCount[ind])-1
                    this.totalFn()
                }
            },
            getDataFn(){ // 根据卡号查询卡
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/cashier/search/card`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        cardNo:_this.cardNo
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.resultData=d.data
                        _this.cardType=d.data.cardType
                        _this.remainTimes=d.data.remainTimes
                        _this.remainAmount=d.data.remainAmount
                        _this.discount=d.data.discount

                        if (d.data.cardType==='2'){
                            if (Number(d.data.remainAmount)===0){
                                _this.$store.state.errorMsg='剩余余额不足'
                                _this.$store.state.errorStatus=true
                            }
                        }else {
                            if (d.data.remainTimes==='0'){
                                _this.$store.state.errorMsg='剩余卡次不足'
                                _this.$store.state.errorStatus=true
                            }
                        }
                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$store.state.errorMsg=''
                        },3000)

                        // vuex-保存的数据(商品列表)
                        if (this.$store.state.chooseGoods){
                            this.goodsLists=this.$store.state.chooseGoods

                            this.goodsLists.forEach((c,i)=>{
                                this.numberCount.push(1)
                            })
                            this.totalFn()
                        }
                    }else {
                        _this.$store.state.errorMsg=d.msg
//                        _this.$store.state.errorMsg='请输入正确的卡号'
                        _this.$store.state.errorStatus=true
                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$router.back()
                        },2000)
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            deleteGoodsFn(ind){
                this.$store.state.chooseGoods.splice(ind,1)
                this.totalFn()
            },
            checkPayFn(){ // 验证输入参数
                if (this.goodsLists.length===0){
                    this.$store.state.errorMsg='请添加消费项目'
                    this.$store.state.errorStatus=true
                }else {
                    if (this.numberCount.indexOf(0)===-1 && this.numberCount.indexOf('0')===-1){ // 判断numberCount是否有0
                        if (this.cardType==='2'){
                            if (this.subtotalMoney>parseFloat(this.remainAmount)){
                                this.$store.state.errorMsg='消费金额不能大于卡金额'
                                this.$store.state.errorStatus=true
                            }else {
                                let goodsList=[]
                                this.goodsLists.forEach((c,i)=>{
                                    goodsList.push({goodsId:c.goodsId,goodsNum:this.numberCount[i]})
                                })
                                let dataPost={ // 折扣卡
                                    userCardId:this.resultData.userCardId,
                                    useAmount:this.subtotalMoney,
                                    goodsList:goodsList
                                }
                                this.confirmPayFn(dataPost)
                            }
                        }else {
                            if (this.subtotalTimes>parseFloat(this.remainTimes)){
                                this.$store.state.errorMsg='消费次数不能大于卡次数'
                                this.$store.state.errorStatus=true
                            }else {
                                let goodsList=[]
                                this.goodsLists.forEach((c,i)=>{
                                    goodsList.push({goodsId:c.goodsId,goodsNum:this.numberCount[i]})
                                })
                                let dataPost={ // 次卡
                                    userCardId:this.resultData.userCardId,
                                    useTimes:this.subtotalTimes,
                                    goodsList:goodsList
                                }
                                this.confirmPayFn(dataPost)
                            }
                        }
                    }else {
                        this.$store.state.errorMsg='消费次数不能为空'
                        this.$store.state.errorStatus=true
                    }
                }
            },
            confirmPayFn(dataPost){ // 确认消费
                let _this=this
                _this.loadingShowA()

                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/cashier/use/card`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:dataPost
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                        console.log(d)
                    if (d.code === 0){
                        _this.dealSuccess=true
                        setTimeout(()=>{
                            _this.dealSuccess=false
                            _this.$store.state.consumNo=''
                            _this.$router.back()
                        },2000)
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
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .resultScanning
        background-color $color9
        padding-bottom 50px
        width 100%
        .textMsg
            padding 10px
            background-color $white
            width @width
            .tList
                margin-bottom 12px
                color $color7
                font-size 14px
                width @width
                &:last-child
                    margin-bottom 0
                .text
                    display inline-block
                    vertical-align middle
                    p
                        line-height 20px
                        .money
                            color #F00
                .img
                    float right
                    border-radius 50%
                    height 36px
                    height 36px
        .consumerItem
            padding 7px 10px
            font-size 0
            p
                display inline-block
                vertical-align middle
                font-size 14px
                color $color7
            .img
                float right
                vertical-align middle
                img
                    width 16px
                    height 16px
        .goods
            background-color #FFF
            width 100%
            .gList
                position relative
                padding 14px 0
                margin-left 42px
                width @width
                font-size 0
                border-bottom 1px solid $color9
                .goodsName
                    margin-bottom 10px
                    font-size 14px
                    color $color7
                    width 100%
                .delete
                    position absolute
                    top 50%
                    left -27px
                    display block
                    background url("../../assets/icons/btn_delete@2x.png") center no-repeat
                    background-size 20px
                    width 20px
                    height 20px
                .img
                    margin-right 16px
                    img
                        width 112px
                        height 64px
                .gText
                    font-size 14px
                    display inline-block
                    vertical-align top
                    .money
                        margin 2px 0 14px 0
                        display block
                        font-size 14px
                        color $color7
                    .amount
                        border 1px solid #dfdfdf
                        width 108px
                        height 30px
                        font-size 0
                        span
                            display inline-block
                            vertical-align top
                            width 28px
                            height 28px
                            line-height @height
                            text-align center
                            color $color7
                            font-size 21px
                            &:first-child
                                background-color #fafafa
                            &:last-child
                                background-color $color6
                        input
                            border 0
                            text-align center
                            width 50px
                            height 28px
        .subtotal
            padding 14px 12px
            color $color7
            font-size 14px
            background-color #FFF
            .money
                float right
                color #F00
</style>
