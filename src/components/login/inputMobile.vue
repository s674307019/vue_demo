<template>
    <div class="inputMobile">
        <div class="inputValueBox">
            <h3>{{words}}</h3>
            <transition enter-active-class="shake" leave-active-class="rollOut">
                <p class="errorMsg animated" v-show="errorStatus">{{errorMsg}}</p>
            </transition>
            <p class="inputValue">
                <input type="tel" maxlength="11"
                       v-model="mobile" @keyup="mobileKeyUp">
                <span @touchend="clearMobile" v-show="mobile.length>0"><img src="../../assets/icons/btn_cancel@2x.png" alt=""></span>
            </p>
            <p class="next">
                <span @touchend="nextFn">下一步</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'inputMobile',
    components: {},
    data() {
        return {
            phoneRegular:/^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            mobile:'',
            words:'请输入手机号',
            mobileStatus:false, // 状态-是登陆还是修改手机号
            errorStatus:false, // 手机号输入对错状态
            errorMsg:'请输入正确的手机号', // 手机号输入对错-提示文本
        }
    },
    created() {
        this.mobileStatus=this.$route.params.changeMobile
        if (this.mobileStatus){ // 修改手机号
            this.words='输入新手机号'
        }else {
            if (this.$store.state.STOREINFO.ACCESSTOKEN){ // 检测到用户已登陆，则跳转到首页
                this.$router.replace('/home')
            }
        }
    },
    methods: {
        clearMobile(){ // 清除输入的手机号
            this.mobile = ''
        },
        nextFn(){ // 点击下一步跳转到输入验证码
            if (this.mobile.length===11){
                if (this.phoneRegular.test(this.mobile)){
                    this.errorStatus = false
                    sessionStorage.setItem('MOBILEVAL',this.mobile) // 保存手机号
                    sessionStorage.setItem('OLDDATE','') // 设置为 第一次获取验证码
                    this.$router.push('/login/inputVerify')
                }else {
                    this.errorMsg = '请输入正确的手机号'
                    this.errorStatus = true
                }
            }else {
                this.errorMsg = '请输入11位手机号'
                this.errorStatus = true
            }
        },
        mobileKeyUp(){
            this.mobile=this.mobile.replace(/\D/g,'')
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/login.styl"
    .inputMobile
        width 100%
</style>
