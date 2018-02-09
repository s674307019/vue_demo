<template>
    <div class="cashiering">
        <div class="inputText">
            <input type="tel" placeholder="输入消费码/卡号" v-model="inputNumber">
            <span @touchend="scanQRCodeFn"></span>
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'cashiering',
        components: {},
        data() {
            return {
                inputNumber:'', // 输入消费码/卡号
                searchNumber:'' // 搜索值
            }
        },
        created() {
            this.inputNumber=this.$store.state.consumNo
        },
        watch: {
            searchNumber(nv,ov){
                this.checkNoFn()
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            searchBtnFn(){
                if (this.inputNumber){
                    this.searchNumber=this.inputNumber
                }else {
                    this.$store.state.errorMsg='请输入消费码或卡号'
                    this.$store.state.errorStatus=true
                }
            },
            checkNoFn(){ // 检验输入的号码
                // 1.商品 2.卡片
                if (this.searchNumber){
                    let num=this.searchNumber.substr(0,1)
                    if (num==='1'){
                        this.$store.state.consumNo=this.searchNumber
                        this.$router.push({name:'GoodsOrder'})
                    }else if(num==='2') {
                        this.$store.state.consumNo=this.searchNumber
                        this.$store.state.chooseGoods=[]
                        this.$router.push({name:'CardOrder'})
                    }else {
                        this.$store.state.errorMsg='请输入正确的消费码或卡号'
                        this.$store.state.errorStatus=true
                    }
                }else {
                    this.$store.state.errorMsg='请输入消费码或卡号'
                    this.$store.state.errorStatus=true
                }
            },
            scanQRCodeFn(){ // 微信扫一扫
                let _this=this
//                _this.loadingShowA()
                _this.$wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ['qrCode','barCode'], // 可以指定扫二维码还是一维码，默认二者都有
                    success(res) {
//                        _this.loadingShowA()
                        let result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
//                        alert(typeof result)
                        _this.searchNumber=result
                    },
                    fail(err){
//                        _this.loadingShowA()
                        _this.$store.state.errorMsg='扫描二维码失败'
                        _this.$store.state.errorStatus=true
                        console.log('扫描二维码失败：',err)
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .cashiering
        width 100%
        .inputText
            padding 10px 8px
            background-color #FFDC71
            width 100%
            font-size 0
            input
                vertical-align middle
                border 0
                outline none
                border-top-left-radius 5px
                border-bottom-left-radius 5px
                border-top-right-radius 0
                border-bottom-right-radius 0
                background url("../../assets/icons/icon_search.png") 10px center no-repeat #FFF
                background-size 13px
                font-size 14px
                text-indent 2em
                width 80.8%
                height 30px
            span
                display inline-block
                vertical-align middle
                background url("../../assets/icons/btn_saoyisao@2x.png") center no-repeat #FFF
                background-size 18px
                border-top-right-radius 5px
                border-bottom-right-radius 5px
                width 30px
                height 30px
            img
                margin-left 12px
                vertical-align middle
                width 24px
                height 24px
        @media screen and (min-width: 320px)
            .inputText
                input
                    width 78%
        @media screen and (min-width: 375px)
            .inputText
                input
                    width 81.5%
        @media screen and (min-width: 414px)
            .inputText
                input
                    width 83%
</style>
