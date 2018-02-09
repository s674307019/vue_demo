<template>
    <div class="inputMobile">
        <div class="inputValueBox">
            <h3>{{words}}</h3>
            <transition enter-active-class="shake" leave-active-class="rollOut">
                <p class="errorMsg animated" v-show="errorStatus">{{errorMsg}}</p>
            </transition>
            <p class="inputValue">
                <input type="tel" maxlength="11"
                       v-model="mobile">
                <span @touchend="clearMobile" v-show="mobile.length>0"><img src="../../assets/icons/btn_cancel@2x.png" alt=""></span>
            </p>
            <p class="next">
                <span @touchend="nextFn">下一步</span>
            </p>
        </div>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'inputMobile',
    data() {
        return {
            phoneRegular:/^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            mobile:'',
            words:'请输入新手机号',
            flag:'0', // 状态-是登陆还是修改手机号
            errorStatus:false, // 手机号输入对错状态
            errorMsg:'请输入正确的手机号', // 手机号输入对错-提示文本
        }
    },
    created() {
        this.flag=this.$route.params.flag
    },
    methods: {
        ...mapActions(['loadingShowA']),
        clearMobile(){ // 清除输入的手机号
            this.mobile = ''
        },
        nextFn(){ // 点击下一步跳转到输入验证码
            if (this.mobile.length===11){
                if (this.phoneRegular.test(this.mobile)){
                    this.errorStatus = false
                    this.getVerifyCodeFn()
                }else {
                    this.errorMsg = '请输入正确的手机号'
                    this.errorStatus = true
                }
            }else {
                this.errorMsg = '请输入11位手机号'
                this.errorStatus = true
            }
        },
        getVerifyCodeFn(){ // 获取验证码
            let _this=this
            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/verifycode/getResetMobileVerifyCode`,
                params:{mobile:_this.mobile,flag:_this.flag}
            }).then((res) => {
                _this.loadingShowA()
                let d=res.data
                console.log(d)
                if (d.code === 0){
                    sessionStorage.setItem('newMobile',this.mobile) // 保存手机号
                    sessionStorage.setItem('OLDDATE',null) // 设置为 第一次获取验证码
                    sessionStorage.setItem('newVerifyCode',d.data.verifyCode)

                    this.$router.replace({name:'CheckVerify',params:{flag:this.flag}})
                }else {
                    _this.errorMsg = d.msg
                    _this.errorStatus = true
                }
            }).catch((err) => {
                _this.loadingShowA()
                console.log(err)
                _this.errorMsg = '网络异常！'
                _this.errorStatus = true
            })
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
