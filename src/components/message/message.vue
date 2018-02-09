<template>
    <div class="message">
        <div class="messageBox">
            <div class="lists">
                <section class="title">
                    <span>发送对象</span>
                    <router-link to="/sent" tag="span">已发送的消息</router-link>
                </section>
                <section class="addSend">
                    <input type="text" placeholder="添加发送对象" readonly v-model="memberStr" />
                    <span class="addIconBtn" @touchend="toChooseMember"></span>
                </section>
            </div>
            <div class="lists">
                <section class="title" >
                    <span >发送内容</span>
                    <router-link to="/chooseTemplate" tag="span"></router-link>
                </section>
                <section class="addSend">
                    <textarea maxlength="140" v-model="content" placeholder="请输入发送内容" @keyup="contentLength" @blur="contentLength"></textarea>
                    <span class="wordsCount">{{conNum}}-140</span>
                </section>
            </div>
        </div>
        <button @touchend="sendAllMessage">确认发送</button>
        <sentting :senttingStatus="senttingStatus" :progressVal="progressVal"></sentting>
        <sent-success v-show="sentSuccess" :sentSuccessFn="sentSuccessFn"></sent-success>
        <sent-fail v-show="sentFail" :sentFailFn="sentFailFn" :sentFailWords="sentFailWords"></sent-fail>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import Sentting from './sentting' // 发送中
    import SentSuccess from './sentSuccess' // 发送成功
    import SentFail from './sentFail' // 发送失败

    export default {
        name: 'message',
        components: {Sentting,SentSuccess,SentFail},
        data() {
            return {
                senttingStatus:false, // 发送中状态
                progressVal:0, // 发送中进度
                sentSuccess:false, // 发送成功
                sentFail:false, // 发送失败
                sentFailWords:'', // 发送失败文字
                indexId:0,
                selectMember:[],
                memberStr:'',
                memberId:[],
                content:'', // 输入发送内容
                conNum:0, // 输入发送内容的字数
                randNum:'' // 消息标识
            }
        },
        created() {
            if (this.$store.state.contentText){ // 发送的内容
                this.content=this.$store.state.contentText
                this.contentLength()
            }
            this.selectMember=JSON.parse(sessionStorage.getItem('selectMemberList'))
            this.memberStrFn()
            this.memberMobileFn()
            sessionStorage.removeItem('selectMemberList')
        },
        methods: {
            ...mapActions(['loadingShowA']),
            randomNumFn(){ // 生成随机数
                let Range = 10000 - 1000
                let Rand = Math.random()
                return(1000 + Math.round(Rand * Range))
            },
            sentSuccessFn(){ // 发送成功，关闭成功提示
                this.sentSuccess=false
            },
            sentFailFn(){ // 发送失败，关闭失败提示
                this.sentFail=false
            },
            toChooseMember(){ // 调转到选择会员列表
                if (this.content){
                    this.$store.state.contentText=this.content
                }
                this.$router.push('/chooseMember')
            },
            contentLength(){
                let emojireg = this.content
//                this.content = emojireg .replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,'') // 替换特殊字符
                this.content = emojireg .replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\!\。\，\?\？\"\“\”\:\：\;\；\(\)\（\）\.]/g,'') // 替换特殊字符

                this.conNum=this.content.length // 计数
            },
            memberStrFn(){
                if(this.selectMember){
                    this.selectMember.forEach((c,i)=>{
                        this.memberStr+=c.name+' '
                    })
                }
            },
            memberMobileFn(){
                if(this.selectMember){
                    this.selectMember.forEach((c,i)=>{
                        this.memberId.push(c.userId)
                    })
                }
            },
            sendAllMessage(){ // 验证输入框有没有内容
                if(this.memberId.length===0){
                    this.$store.state.errorMsg='<span>请添加发送对象！</span>'
                    this.$store.state.errorStatus=true
                }else {
                    if(!this.content){
                        this.$store.state.errorMsg='<span>请输入发送内容！</span>'
                        this.$store.state.errorStatus=true
                    }else {
                        this.confirmSendFn() // 确认发送
                    }
                }

            },
            confirmSendFn(){ // 确认发送
                this.randNum=this.randomNumFn()
                this.sendMessage(this.indexId,this.randNum)
            },
            sendMessage(id,rand){ // 发送消息
                let _this=this
                _this.senttingStatus=true
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/message/sendMessage`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        userId:_this.memberId[id],
                        content:_this.content,
                        messageTag:rand
                    }
                }).then((res) => {
                    let d=res.data;
//                    console.log(d)
                    if (d.code === 0){
                        if (this.progressVal===0){ // 执行进度条
                            this.progressFn()
                        }
                        if (_this.indexId+1<_this.memberId.length){
                            _this.indexId++
                            _this.sendMessage(_this.indexId,_this.randNum)
                        }else {
                            _this.memberStr=null
                            _this.indexId=0
                            _this.content=''
                            _this.$store.state.contentText=''
                            _this.memberId=[]

                            _this.progressVal=100
                            setTimeout(()=>{
                                _this.senttingStatus=false
                                _this.sentSuccess=true // 发送成功
                            },500)
                        }
                    }else {
                        _this.senttingStatus=false
                        _this.sentFailWords=`第${_this.indexId+1}条发送失败,${d.msg}` // 发送失败
                        _this.sentFail=true
                    }
                }).catch((err) => {
                    _this.senttingStatus=false
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })

            },
            progressFn(){ // 进度条执行方法
                this.timer=setInterval(() => {
                    if (this.progressVal<49){
                        this.progressVal ++
                    }else {
                        clearInterval(this.timer)
                        this.timer=setInterval(() => {
                            if(this.progressVal>=49 && this.progressVal<=69){
                                this.progressVal ++
                            }else {
                                clearInterval(this.timer)
                                this.timer=setInterval(() => {
                                    if(this.progressVal>=69 && this.progressVal<79){
                                        this.progressVal ++
                                    }else {
                                        clearInterval(this.timer)
                                        this.timer=setInterval(() => {
                                            if(this.progressVal>=79 && this.progressVal<89){
                                                this.progressVal ++
                                            }else {
                                                clearInterval(this.timer)
                                                this.timer=setInterval(() => {
                                                    if(this.progressVal>=89 && this.progressVal<99){
                                                        this.progressVal ++
                                                    }else {
                                                        clearInterval(this.timer)
                                                    }
                                                },500)
                                            }
                                        },400)
                                    }
                                },300)
                            }
                        },200)
                    }
                },50)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .message
        width 100%
        .messageBox
            width @width
            .lists
                .title
                    width @width
                    padding 8px 7px 8px 13px
                    font-size 0
                    span
                        font-size 14px
                        color $color7
                        &:last-child
                            float right
                            color #FFB500
                .addSend
                    background-color $white
                    width @width
                    font-size 0
                    input
                        padding 5px 0 5px 13px
                        border 0
                        outline 0
                        color $color7
                        font-size 17px
                        width 60%
                        height 55px
                    .addIconBtn
                        margin 13px 10px 0 0
                        float right
                        display inline-block
                        width 28px
                        height 28px
                        background url("../../assets/icons/btn_add_black@2x.png") center no-repeat
                        background-size 28px
                    textarea
                        padding 5px 13px
                        border 0
                        outline none
                        width 100%
                        height 110px
                    .wordsCount
                        display block
                        padding 0 8px 5px 0
                        text-align right
                        font-size 12px
                        color $color3
        button
            $button(fixed,$color6,$color7,100%)
</style>
