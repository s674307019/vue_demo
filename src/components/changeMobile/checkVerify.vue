<template>
    <div class="inputVerify">
        <div class="inputValueBox">
            <h3>请输入验证码</h3>
            <p class="inputText">
                <span>{{mobile}}</span>&nbsp;&nbsp;<span @touchend="getVerifyCodeFn">{{verifyMsg}}</span>
            </p>
            <transition enterActiveClass="shake" leaveActiveClass="rollOut">
                <p class="errorMsg animated" v-show="errorStatus">{{errorMsg}}</p>
            </transition>
            <div class="verifyCode" style="margin-top: 40px;">
                <input-code @successCode="successCode"></input-code>
            </div>
            <p class="loading" v-show="loginIng">
                <img src="../../assets/icons/img_waitting@2x.png" alt=""><span>登录中</span>
            </p>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import InputCode from '../common/inputCode'
export default {
    name: 'inputVerify',
    components: {InputCode},
    data() {
        return {
            mobile:'', // 获取input框输入的手机号
            flag:'0', // 状态-是登陆还是修改手机号
            verifyMsg:'点击重新发送',
            codeTimer:null, // 定时器名字
            codeTime:60, // 定时器时间
            verifyCode:'', // 输入的验证码 String
//            getCode:'5678', // 获取的验证码 String
            getCode:'', // 获取的验证码 String
            errorStatus:false, //计算验证码输入状态
            errorMsg:'请输入正确的验证码', //错误提示
            loginIng:false // 登陆中状态显示
        }
    },
    created() {
        this.flag=this.$route.params.flag
        if (this.flag==='mobile'){ // flag: 1/mobile代表修改店铺号码，2/loginMobile代表修改登录号码
            this.mobile=this.$store.state.STOREINFO.MOBILE
            this.checkMobileVerifyFn('1')
        }else if (this.flag==='loginMobile') {
            this.mobile=this.$store.state.STOREINFO.LOGINMOBILE
            this.checkMobileVerifyFn('2')
        }else {
            // 获取的验证码
            this.getCode=sessionStorage.getItem('newVerifyCode')
            // 输入的手机号
            this.mobile=sessionStorage.getItem('newMobile')

            this.codeSetInterval() // 启动定时器
        }
    },
    methods: {
        ...mapActions(['loadingShowA']),
        successCode(v){
            this.verifyCode = v
            if (this.verifyCode===this.getCode){
                this.errorStatus=false
                if (this.flag==='mobile'){
                    // 修改店铺手机号
                    sessionStorage.setItem('oldVerifyCode',this.verifyCode)
                    this.$router.replace({name:'CheckMobile',params:{flag:'1'}})
                }else if (this.flag==='loginMobile') {
                    // 修改登录手机号
                    sessionStorage.setItem('oldVerifyCode',this.verifyCode)
                    this.$router.replace({name:'CheckMobile',params:{flag:'2'}})
                }else {
                    // 修改店铺、登录手机号
                    this.changeMobileFn(this.flag)
                }
            }else {
                this.errorStatus=true
                this.errorMsg='验证码不正确'
            }
        },
        codeSetInterval(){ // 定时器，设置倒计时
            this.codeTimer=setInterval(()=>{
                if (this.codeTime>0){
                    this.codeTime --
                    this.verifyMsg = `${this.codeTime}s后重新发送`
                }else {
                    clearInterval(this.codeTimer)
                    this.codeTime = 60
                    this.verifyMsg = '点击重新发送'
                }
            },1000)
        },
        getVerifyCodeFn(f){ // 获取验证码
            let _this=this
            let codeUrl=''
            if (this.flag==='loginMobile' || this.flag==='mobile'){
                codeUrl='getVerifyCode'
            }else {
                codeUrl='getResetMobileVerifyCode'
            }
            if (!this.codeTimer && this.codeTime===60){
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/verifycode/${codeUrl}`,
                    params:{mobile:_this.mobile,flag:f}
                }).then((res) => {
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.errorStatus = false
                        _this.getCode = d.data.verifyCode
                        sessionStorage.setItem('oldVerifyCode',d.data.verifyCode)
                        _this.codeSetInterval() // 启动定时器
                        sessionStorage.setItem('OLDDATE',Date.now())
                    }else {
                        _this.errorStatus = true
                        _this.errorMsg = d.msg
                    }
                }).catch((err) => {
                    console.log(err)
                    _this.errorStatus = true
                    _this.errorMsg = '网络异常！'
                })
            }else {
                this.errorStatus = true
                this.errorMsg = '验证码已发送至您的手机，请注意查收'
                setTimeout(()=>{
                    this.errorStatus = false
                },2000)
            }
        },
        changeMobileFn(f){ // 修改手机号请求
            let _this=this
            _this.loadingShowA()
            let dataPost={
                oldMobile:'',
                newMobile:sessionStorage.getItem('newMobile'),
                verifyCode:sessionStorage.getItem('oldVerifyCode'),
                newVerifyCode:sessionStorage.getItem('newVerifyCode'),
                flag:f
            }
            if (f==='1'){
                dataPost.oldMobile=_this.$store.state.STOREINFO.MOBILE
            }else {
                dataPost.oldMobile=_this.$store.state.STOREINFO.LOGINMOBILE
            }
            this.$http({
                method:'POST',
                headers:{
                    accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                },
                url:`${_this.$URL}api/v1/store/updateMobile`,
                params:{
                    storeId:_this.$store.state.STOREINFO.STOREID
                },
                data:dataPost
            }).then((res) => {
                _this.loadingShowA()
                let d=res.data
                if (d.code === 0){
                    _this.verifyCode=''
                    if (f==='1'){
                        _this.$store.state.errorMsg='店铺手机号修改成功'
                        _this.$store.state.errorStatus=true
                        localStorage.setItem('MOBILE',_this.mobile)
                        _this.$store.state.STOREINFO.MOBILE=_this.mobile

                        // 清除零时数据
                        sessionStorage.removeItem('newMobile')
                        sessionStorage.removeItem('newVerifyCode')
                        sessionStorage.removeItem('oldVerifyCode')

                        setTimeout(()=>{
                            _this.$store.state.errorMsg=''
                            _this.$store.state.errorStatus=false
                            _this.$router.replace('/myInfo')
                        },1500)
                    }else {
                        _this.$store.state.errorMsg='登录手机号修改成功'
                        _this.$store.state.errorStatus=true
                        localStorage.setItem('LOGINMOBILE',_this.mobile)
                        _this.$store.state.STOREINFO.LOGINMOBILE=_this.mobile

                        setTimeout(()=>{
                            _this.$store.state.errorMsg=''
                            _this.$store.state.errorStatus=false
                            _this.$router.replace('/accountAndSecurity')
                        },1500)
                    }
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
        checkMobileVerifyFn(f){ // 验证修改的手机号
            // 请求验证码  ----  判断是否是第一次进入该页面
            let oldDate=sessionStorage.getItem('OLDDATE') // 获取上一次请求验证码记录的时间
//            console.log(oldDate)
            sessionStorage.removeItem('OLDDATE')
            let nowDate=Date.now() // 当前时间
            if (!oldDate){ // 如果是第一次进入，发送请求获取验证码
//                if (this.flag==='loginMobile' || this.flag==='mobile'){
//                    this.getVerifyCodeFn(f,'getVerifyCode')
//                }else {
//                    this.getVerifyCodeFn(f,'getResetMobileVerifyCode')
//                }
                this.getVerifyCodeFn(f)
            }else {
                if ((nowDate-oldDate)>60){ // 如果当前时间减去上一次请求验证码的时间大于1分钟，发送请求获取验证码
                    this.verifyMsg = '点击重新发送'
                }else {
                    this.codeTime=Date.now()-oldDate
                    this.codeSetInterval()
                }
            }
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/login.styl"
    .inputVerify
        width 100%
        .inputValueBox
            .verifyCode
                margin 0 auto
                width 70%
</style>
