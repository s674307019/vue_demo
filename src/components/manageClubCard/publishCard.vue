<template>
    <div class="publishCard">
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>卡类别</p>
                </section>
                <section class="listText">
                    <select class="select" v-model="cardType">
                        <option value="-1">请选择</option>
                        <option value="次卡">次卡</option>
                        <option value="折扣卡">折扣卡</option>
                        <option value="体验卡">体验卡</option>
                    </select>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>卡片名称</p>
                </section>
                <section class="listText">
                    <input type="text" placeholder="请输入卡片名称" maxlength="5" v-model="cardName">
                </section>
            </div>
            <!--<div class="listXs uploadBox">-->
                <!--<section class="listTitle">-->
                    <!--<p>卡片封面</p>-->
                <!--</section>-->
                <!--<section class="listText">-->
                    <!--<span class="uploadRight">-->
                        <!--<span class="uploadBtn">点击此处上传</span>-->
                        <!--<img class="img" v-show="cardImage.length>0" :src="urlPic+cardImage" ref="cardImage" alt="">-->
                        <!--<span class="btn">-->
                            <!--<div id="cardImageBox"><div id="cardImage" style="width: 100%;height: 100%;">上传</div></div>-->
                        <!--</span>-->
                    <!--</span>-->
                <!--</section>-->
            <!--</div>-->
            <div class="listXs">
                <section class="listTitle">
                    <p>售价</p>
                </section>
                <section class="listText">
                    <input type="number" max="99999999" v-model="faceValue" placeholder="请输入卡片售价金额" @keyup="faceValueFn">
                </section>
            </div>
            <div class="listXs" v-show="cardType==='次卡' || cardType==='体验卡'">
                <section class="listTitle">
                    <p>总次数</p>
                </section>
                <section class="listText">
                    <input type="tel" maxlength="4" v-model="cardTimes" placeholder="请输入总次数" @keyup="cardTimesFn">
                </section>
            </div>
            <div class="listXs" v-show="cardType==='折扣卡'">
                <section class="listTitle">
                    <p>折扣</p>
                </section>
                <section class="listText">
                    <input type="number" maxlength="3" v-model="discount" placeholder="请输入折扣" @blur="discountFn">
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>有效日期</p>
                </section>
                <section class="listText">
                    <input class="effectiveDate" id="datePinker" type="button"
                           v-model="effectiveDate" readonly placeholder="请选择有效期"
                           :data-lcalendar="effectiveDateStr">
                </section>
            </div>
            <div class="listXs" v-show="cardType==='次卡' || cardType==='折扣卡'">
                <section class="listTitle">
                    <p>是否积分</p>
                </section>
                <section class="listText">
                    <switch-bar :switchStatus="isScore" :switchFn="isScoreFn"></switch-bar>
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>是否上架</p>
                </section>
                <section class="listText">
                    <switch-bar :switchStatus="isValid" :switchFn="isValidFn"></switch-bar>
                </section>
            </div>
        </div>
        <div class="useNotes">
            <section class="title">使用须知</section>
            <section class="content">
                <textarea maxlength="200" v-model="useExplain" placeholder="使用时间人数等" @keyup="useExplainKeyUpFn"></textarea>
                <span class="limit">2-200字</span>
            </section>
        </div>
        <button @touchend="checkPublishCardFn">确定</button>
        <div class="publishBox" v-show="publishSuccess" @touchend="publishSuccess=false">
            <div class="publishStatus">
                <p>{{publishWords}}</p>
            </div>
        </div>
        <div class="publishBox" v-show="publishFail">
            <div class="publishStatus2">
                <p>{{publishFailWords}}</p>
                <div class="btn">
                    <span @touchend="publishFail=false">取消</span>
                    <span @touchend="checkPublishCardFn">重发</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import SwitchBar from '../common/switchBar'
    export default {
        name: 'publishCard',
        components: {SwitchBar},
        data() {
            return {
                publishSuccess:false, // 发布成功
                publishWords:'', // 发布成功-提示文字
                publishFail:false, // 发布失败
                publishFailWords:'', // 发布失败-提示文字
                urlPic:this.$store.state.STOREINFO.QINIUPREFIX, // 卡片图片的域名地址
                QiniuUploadToken:'', // 七牛上传文件token
                cardId:'',
                cardName:'', // 卡名
                cardType:'-1', // 卡类型
                faceValue:'', // 面值
//                cardImage:'', // 卡片图片
                cardTimes:'', // 次数
                discount:'', // 折扣
                effectiveDate:'', // 有效期
                effectiveDateStr:'', // 有效期开始时间
                isScore:true, // 是否积分,默认积分
                isValid:true, // 是否上架，默认为Y
                useExplain:'' // 使用说明
            }
        },
        created() {
            let date=this.timeFn()
            this.effectiveDate=date
            this.effectiveDateStr=`${date},3999-12-31`

//            this.getQiniuUploadToken() // 获取七牛token,并初始化七牛上传
        },
        mounted(){
            // 组件挂载完成初始化日期
            let calendar = new lCalendar()
            calendar.init({
                'trigger': '#datePinker', //标签id
                'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            })
        },
        methods: {
            ...mapActions(['loadingShowA']),
            isScoreFn(){ // 是否积分
                this.isScore = !this.isScore
            },
            isValidFn(){ // 是否上架
                this.isValid=!this.isValid
            },
            cardTypeFn(v){ // 卡类型转换
                if (v==='次卡'){
                    return 'FREQUENCY_CARD'
                }else if (v==='折扣卡'){
                    return 'DISCOUNT_CARD'
                }else {
                    return 'EXPERIENCE_CARD'
                }
            },
            timeFn(){ // 日期格式化函数
                let de = new Date()
                return de.getFullYear()+'-'
                    +((de.getMonth()+1)>=10?(de.getMonth()+1):'0'+(de.getMonth()+1))+'-'
                    +(de.getDate()>=10?de.getDate():'0'+de.getDate())
            },
            wordsSplitFn(w){ // 按照回车拆分，组合成字符串
                let arr=w.split(/\n/g)
                let str=''
                arr.forEach((c,i)=>{
                    str+=`<p>${c}</p>`
                })
                return str
            },
            checkPublishCardFn(){
                if (this.cardType==='-1'){
                    this.$store.state.errorMsg='请选择卡类型'
                    this.$store.state.errorStatus=true
                    return false
                }else if (!this.cardName){
                    this.$store.state.errorMsg='请输入卡名称'
                    this.$store.state.errorStatus=true
                    return false
                }else if (!this.faceValue){
                    this.$store.state.errorMsg='请输入售价'
                    this.$store.state.errorStatus=true
                    return false
                }else if (Number(this.faceValue)>100000000){
                    this.$store.state.errorMsg='售价应小于100000000'
                    this.$store.state.errorStatus=true
                    return false
                }else if ((this.cardType==='次卡' || this.cardType==='体验卡') && !this.cardTimes){
                    this.$store.state.errorMsg='请输入总次数'
                    this.$store.state.errorStatus=true
                    return false
                }else if (this.cardType==='折扣卡' && !this.discount){
                    this.$store.state.errorMsg='请输入折扣'
                    this.$store.state.errorStatus=true
                    return false
                }else if (this.cardType==='折扣卡' && (this.discount<0.1 || this.discount>9.9)){
                    this.$store.state.errorMsg='折扣应在0.1-9.9之间'
                    this.$store.state.errorStatus=true
                    return false
                }else if (this.effectiveDate==='3099-12-31'){
                    this.$store.state.errorMsg='请选择有效日期'
                    this.$store.state.errorStatus=true
                    return false
                }else if (!this.useExplain){
                    this.$store.state.errorMsg='请输入使用说明'
                    this.$store.state.errorStatus=true
                    return false
                }else if (this.useExplain.length<2){
                    this.$store.state.errorMsg='使用说明至少两个字符'
                    this.$store.state.errorStatus=true
                    return false
                }else {
                    this.$store.state.errorStatus=false
                    this.publishCardFn()
                }
            },
            publishCardFn(){ // 确定-发布卡片
                let _this=this
                _this.loadingShowA()
                let dataPost={}
                if (_this.cardType==='次卡'){
                    dataPost={ // 次卡数据
                        cardType:_this.cardTypeFn(_this.cardType),
                        cardName:_this.cardName,
                        faceValue:_this.faceValue,
                        cardTimes:_this.cardTimes,
                        effectiveDate:`${_this.effectiveDate} 24:00:00`,
                        isScore:_this.isScore?'Y':'N',
                        isShelves:_this.isValid?'Y':'N',
                        useExplain:_this.wordsSplitFn(_this.useExplain)
                    }
                }else if(_this.cardType==='折扣卡'){
                    dataPost={ // 折扣卡数据
                        cardType:_this.cardTypeFn(_this.cardType),
                        cardName:_this.cardName,
                        faceValue:_this.faceValue,
                        discount:Number(_this.discount)*10,
                        effectiveDate:`${_this.effectiveDate} 24:00:00`,
                        isScore:_this.isScore?'Y':'N',
                        isShelves:_this.isValid?'Y':'N',
                        useExplain:_this.wordsSplitFn(_this.useExplain)
                    }
                }else {
                    dataPost={ // 体验卡数据
                        cardType:_this.cardTypeFn(_this.cardType),
                        cardName:_this.cardName,
                        faceValue:_this.faceValue,
                        cardTimes:_this.cardTimes,
                        effectiveDate:`${_this.effectiveDate} 00:00:00`,
                        isShelves:_this.isValid?'Y':'N',
                        useExplain:_this.wordsSplitFn(_this.useExplain)
                    }
                }
//                console.log(dataPost)
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/card/addOrEditCard`,
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
                        // 清空输入数据
                        _this.cardName=''
                        _this.cardType='-1'
                        _this.faceValue=''
//                        _this.cardImage=''
                        _this.cardTimes=''
                        _this.discount=''
                        _this.effectiveDate=''
                        _this.isScore=true
                        _this.isValid=true
                        _this.useExplain=''

                        _this.publishWords='发布成功'
                        _this.publishSuccess=true // 发布成功状态
                        setTimeout(()=>{
                            _this.publishSuccess=false
                            _this.$router.back() // 跳转到上一页
                        },2000)
                    }else {
                        _this.publishFailWords=d.msg
                        _this.publishFail=true
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            faceValueFn(){ // 售价
                this.faceValue=this.faceValue.replace(/[^\d.]/g,'')
                let fv=this.faceValue
                if (parseFloat(fv)>100000000){
                    this.$store.state.errorMsg='售价应小于100000000'
                    this.$store.state.errorStatus=true
                }else {
                    this.faceValue=fv.trim().slice(0,fv.indexOf('.') === -1
                        ? fv.length
                        : fv.indexOf('.') + 3)
                }
            },
            cardTimesFn(){ // 次数
                this.cardTimes=this.cardTimes.replace(/\D/g,'')
            },
            discountFn(){ // 折扣
                this.discount=this.discount.replace(/[^\d.]/g,'')
                let fv=this.discount
                if (Number(fv)>9.9 || Number(fv)<0.1){
                    this.$store.state.errorMsg='折扣只能输入0.1-9.9之间'
                    this.$store.state.errorStatus=true
                }else {
                    this.discount=fv.trim().slice(0,fv.indexOf('.') === -1
                        ? fv.length
                        : fv.indexOf('.') + 2)
                }
            },
            useExplainKeyUpFn(){ // 使用须知 限制输入
                this.useExplain=this.useExplain.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.\。\，\、\,\;\；\:\'\“\”\：\：\n]/g,'')
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .publishCard
        margin-bottom 50px
        width 100%
        height 100%
        .listsBox
            .listXs
                &:last-child
                    border-bottom 0
                .listText
                    .select
                        vertical-align top
                        appearance none
                        background none
                        border 0
                        font-size 17px
                        height 54px
                    .effectiveDate
                        appearance none
                        width 90%
                        text-align right
            .uploadBox
                height 86px
                line-height @height
                .listText
                    .uploadRight
                        display inline-block
                        vertical-align top
                        float right
                        text-align right
                        font-size 0
                        position relative
                        span
                            display inline-block
                            vertical-align middle
                            text-align center
                            font-size 12px
                            color $color7
                            border 1px solid #CCCCCC
                            width 90px
                            height 65px
                            line-height @height
                        .img
                            position absolute
                            top 11px
                            right 1px
                            z-index 1
                            width 90px
                            height 65px
                        .btn
                            position absolute
                            top 11px
                            right 1px
                            z-index 10
                            opacity 0
        .useNotes
            .title
                padding 10px 15px
                font-size 14px
                color $color7
            .content
                position relative
                width 100%
                textarea
                    padding 10px 15px
                    border 0
                    outline none
                    font-size 14px
                    width 100%
                    height 100px
                .limit
                    position absolute
                    right 6px
                    bottom 8px
                    font-size 12px
                    color $color3
        button
            $button(fixed,$color6,$color7,100%)
        .publishBox
            position fixed
            top 0
            left 0
            z-index 10
            background-color rgba(0,0,0,.3)
            width 100%
            height 100%
            .publishStatus
                position absolute
                top 35%
                left 50%
                margin-left -72px
                background url("../../assets/icons/img_succesd@2x.png") center 30% no-repeat #FFF
                background-size 43px 39px
                color #151515
                width 145px
                height 152px
                border-radius 4px
                text-align center
                p
                    margin-top 70%
                    font-size 14px
            .publishStatus2
                position absolute
                left 50%
                top 40%
                margin-left -135px
                background-color $white
                border-radius 12px
                text-align center
                width 270px
                height 110px
                font-size 0
                p
                    padding 22px 0%
                    $border(bottom)
                    font-size 17px
                    color #030303
                .btn
                    $flex()
                    span
                        flex 1
                        padding 10px 0
                        font-size 17px
                        color #0076FF
                        &:first-child
                            $border(right)
</style>
