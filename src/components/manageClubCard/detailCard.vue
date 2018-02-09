<template>
    <div class="detailCard">
        <ul class="cardList">
            <li class="lists">
                <section class="listMain">
                    <p class="title" :class="colors[cardType-1]">
                        <img :src="storeLogo" alt="">
                        <span>{{cardName}}</span>
                    </p>
                    <p class="listMsg">
                        <span v-if="cardType==1">次卡</span>
                        <span v-else-if="cardType==2">折扣卡</span>
                        <span v-else>体验卡</span>
                        <span class="msgIndate">{{effectiveDate}}前有效</span>
                    </p>
                </section>
            </li>
        </ul>
        <div class="cardDetail">
            <div class="text">
                <section v-if="cardType==2" class="words">
                    <p>折扣率</p>
                    <span>{{discount/10}}</span>
                </section>
                <section v-else class="words">
                    <p>次数</p>
                    <span>{{cardTimes}}</span>
                </section>
                <section class="wid1px"></section>
                <section class="words">
                    <p>售价</p>
                    <span>{{faceValue}}</span>
                </section>
            </div>
        </div>
        <div class="listsBox">
            <div class="listXs" v-show="cardType!=='3'">
                <section class="listTitle">
                    <p>是否积分</p>
                </section>
                <section class="listText">
                    <switch-bar :switchStatus="integration" :switchFn="integrationFn"></switch-bar>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>是否上架</p>
                </section>
                <section class="listText">
                    <switch-bar :switchStatus="putaway" :switchFn="putawayFn"></switch-bar>
                </section>
            </div>
            <div class="listXs listHeightAuto">
                <section class="listTitle">
                    <p>使用说明</p>
                </section>
                <figure class="describe" v-html="useExplain">
                </figure>
            </div>
        </div>
        <router-link :to="{name:'EditorCard',query:{cardId:cardId}}" tag="button" replace v-show="!putaway">编辑</router-link>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import SwitchBar from '../common/switchBar'
    export default {
        name: 'detailCard',
        components: {SwitchBar},
        data() {
            return {
                colors:['color1','color2','color3'],
                cardId:'', // 卡Id
                cardType:'', // 卡类型
                cardName:'', // 卡名
                cardImage:'', // 卡片图片
                storeLogo:'', // 店铺logo url
                effectiveDate:'', // 有效期
                cardTimes:'', // 次数
                discount:'', // 折扣
                faceValue:'', // 售价
                isReturnScore:'', // 是否返还积分,Y 返回积分 N不返回
                state:'', // 状态：0下架 1上架
                useExplain:'', // 使用说明
                integration:true, //积分
                putaway:null //是否上架
            }
        },
        created() {
            let cardId=this.$route.query.cardId
            this.getMemberDataFn(cardId)
        },
        methods: {
            ...mapActions(['loadingShowA']),
            wordsReplaceFn(w){ // 替换p标签
                let str1=w.replace(/(<p>)/g,'')
                let str2=str1.replace(/(<\/p>)/g,'\n')
                return str2
            },
            integrationFn(){ // 是否积分
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/card/returnScore`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        cardId:_this.cardId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    if (d.code === 0){
                        this.integration = !this.integration
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
            putawayFn(){ // 是否上架
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/card/shelf`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        cardId:_this.cardId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    if (d.code === 0){
                        this.putaway = !this.putaway
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
            getMemberDataFn(c){ // 获取数据
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/card/cardDetails`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        cardId:c
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.cardId=d.data.cardId
                        _this.cardName=d.data.cardName
                        _this.cardImage=d.data.cardImage
                        _this.cardType=d.data.cardType
                        _this.storeLogo=d.data.storeLogo
                        _this.effectiveDate=d.data.effectiveDate
                        _this.cardTimes=d.data.cardTimes
                        _this.discount=d.data.discount
                        _this.faceValue=d.data.faceValue
                        _this.integration=d.data.isReturnScore==='Y'?true:false
                        _this.putaway=d.data.state==='1'?true:false
                        _this.useExplain=d.data.useExplain
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
    @import "../../assets/stylus/cards.styl"
    .detailCard
        background-color $white
        width 100%
        .cardList
            padding-bottom 0
            .lists
                margin-bottom 0
        .cardDetail
            margin-bottom 20px
            $border(top)
            .text
                margin 15px 0
                padding 0 25%
                $flex()
                .words
                    flex 1
                    font-size 14px
                    text-align center
                    p
                        margin-bottom 3px
                        color $color3
                    span
                        font-size 17px
                        color #151515
                .wid1px
                    background-color $color9
                    width 1px
                    height 20px
        button
            $button(fixed,$color6,$color7,100%)
</style>
