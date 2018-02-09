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
import InputCode from '../common/inputCode'
export default {
    name: 'inputVerify',
    components: {InputCode},
    data() {
        return {
            phoneRegular:/^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            mobile:'', // 获取input框输入的手机号
            mobileStatus:false, // 状态-是登陆还是修改手机号
            verifyMsg:'点击重新发送',
            codeTimer:null, // 定时器名字
            codeTime:60, // 定时器时间
            code:[], // 单个验证码（Array）
            verifyCode:'', // 输入的验证码 String
//            getCode:'5678', // 获取的验证码 String
            getCode:'', // 获取的验证码 String
            errorStatus:false, //计算验证码输入状态
            errorMsg:'请输入正确的验证码', //错误提示
            loginIng:false // 登陆中状态显示
        }
    },
    created() {
        // 登录
        this.mobile=sessionStorage.getItem('MOBILEVAL')

        // 请求验证码  ----  判断是否是第一次进入该页面
        let oldDate=sessionStorage.getItem('OLDDATE') // 获取上一次请求验证码记录的时间
        let nowDate=Date.now() // 当前时间
        if (!oldDate){ // 如果是第一次进入，发送请求获取验证码
           this.getVerifyCodeFn()
        }else {
            if ((nowDate-oldDate)>60){ // 如果当前时间减去上一次请求验证码的时间大于1分钟，发送请求获取验证码
                this.verifyMsg = '点击重新发送'
            }else {
                this.codeTime=Date.now()-oldDate
                this.codeSetInterval()
            }
        }
    },
    methods: {
        successCode(v){
            this.verifyCode = v
            if (this.verifyCode===this.getCode){
                this.errorStatus=false
                // 执行登陆
                this.loginFn() // 登录
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
        getVerifyCodeFn(){ // 获取验证码
            let _this=this
            if (!this.codeTimer && this.codeTime===60){
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/verifycode/getVerifyCode`,
                    params:{mobile:_this.mobile}
                }).then((res) => {
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.errorStatus = false
                        _this.getCode = d.data.verifyCode
                        _this.codeSetInterval() // 启动定时器
                        sessionStorage.setItem('OLDDATE',Date.now())
                    }else {
                        _this.errorStatus = true
                        _this.errorMsg = d.msg
                    }
                }).catch((err) => {
                    // console.log(err)
                    _this.errorMsg = '网络异常！'
                    _this.errorStatus = true
                })
            }else {
                this.errorStatus = true
                this.errorMsg = '验证码已发送至您的手机，请注意查收'
                setTimeout(()=>{
                    this.errorStatus = false
                },2000)
            }
        },
        loginFn(){ // 发送登录请求
            this.loginIng=true
            let _this=this
            this.$http({
                method:'POST',
                url:`${_this.$URL}api/v1/store/login`,
                data:{mobile:_this.mobile,verifyCode:_this.getCode}
            }).then((res) => {
                _this.loginIng=false
                let d=res.data
//                console.log('登录返回信息',d)
                if (d.code === 0){
                    _this.loginIng=false
                    localStorage.setItem('ACCESSTOKEN',d.data.accessToken)// 保存---token
                    localStorage.setItem('TOKEN',d.data.qiNiuToken)// 保存---七牛token
                    localStorage.setItem('STOREID',d.data.storeId)// 保存---店铺ID
                    localStorage.setItem('REGISTERNO',d.data.registerNo)// 保存---注册号
                    localStorage.setItem('BUSINESSLICENSE',d.data.businessLicense)// 保存---营业执照
                    localStorage.setItem('BUSINESSLICENSEURL',d.data.businessLicenseUrl)// 保存---营业执照Url
                    localStorage.setItem('STORENAME',d.data.storeName)// 保存---店铺名字
                    localStorage.setItem('MOBILE',d.data.mobile)// 保存---手机号码
                    localStorage.setItem('LOGINMOBILE',d.data.loginMobile)// 保存---登录手机号码
                    localStorage.setItem('ADDRESS',d.data.address)// 保存---地址
                    localStorage.setItem('SHORTADDRESS',d.data.shortAddress)// 保存---地址简称
                    localStorage.setItem('STORELOGO',d.data.storeLogo)// 保存---店铺logo
                    localStorage.setItem('STORELOGOURL',d.data.storeLogoUrl)// 保存---店铺logo地址
                    localStorage.setItem('STOREIMAGES',JSON.stringify(d.data.storeImages))// 保存---店铺照片
                    localStorage.setItem('LNG',d.data.lng)// 保存---经度
                    localStorage.setItem('LAT',d.data.lat)// 保存---纬度
                    localStorage.setItem('ISPERFECTINFOMATION',d.data.isPerfectInformation)// 保存---是否已经完善信息，Y代表完善了信息，N代表没完善
                    localStorage.setItem('QINIUPREFIX',d.data.qiNiuPrefix)// 图片回显域名qiNiuPrefix

//                    _this.$store.state.STOREINFO={ // 登录信息
//                        'ACCESSTOKEN': d.data.accessToken, // ---token
//                        'TOKEN': d.data.qiNiuToken, // ---七牛token
//                        'STOREID': d.data.storeId, // ---店铺ID
//                        'REGISTERNO': d.data.registerNo, // ---注册号
//                        'BUSINESSLICENSE': d.data.businessLicense, // ---营业执照
//                        'BUSINESSLICENSEURL': d.data.businessLicenseUrl, // ---营业执照Url
//                        'STORENAME': d.data.storeName,// ---店铺名字
//                        'MOBILE': d.data.mobile, // ---手机号码
//                        'LOGINMOBILE': d.data.loginMobile, // ---登录手机号码
//                        'ADDRESS': d.data.address, // ---地址
//                        'STORELOGO': d.data.storeLogo, // ---店铺logo
//                        'STORELOGOURL': d.data.storeLogoUrl, // ---店铺logo地址
//                        'STOREIMAGES': d.data.storeImages, // ---店铺照片
//                        'LNG': d.data.lng, // ---经度
//                        'LAT': d.data.lat, // ---纬度
//                        'ISPERFECTINFOMATION': d.data.isPerfectInformation, // ---是否已经完善信息，Y代表完善了信息，N代表没完善
//                        'QINIUPREFIX': d.data.qiNiuPrefix // ---图片回显域名
//                    }

                    _this.auditResultFn(d.data.accessToken,d.data.storeId) // 店铺审核状态
//                    let webUrl=window.location.href.split('?')[0]
//                    window.location.replace(webUrl+'#/home') // 跳转到首页
                }else {
                    _this.errorStatus=true
                    _this.errorMsg=d.msg
                }
            }).catch((err) => {
                _this.loginIng=false
                _this.errorMsg='网络异常！'
                _this.errorStatus=true
                // console.log(err)
            })
        },
        auditResultFn(a,s){ // 查看审核状态
            let _this=this
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/store/auditResult`,
                headers:{
                    accessToken:a
                },
                params:{
                    storeId:s
                }
            }).then((res) => {
                let d=res.data
//                console.log(d)
                if (d.code===0){
                    // 店铺状态：0 待审核 1审核成功 2 审核失败
                    localStorage.setItem('stateStatusVal',d.data.state)
                    let webUrl=window.location.href.split('?')[0]
                    window.location.replace(webUrl+'#/home') // 跳转到首页
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
    @import "../../assets/stylus/login.styl"
    .inputVerify
        width 100%
        .inputValueBox
            .verifyCode
                margin 0 auto
                width 70%
</style>
