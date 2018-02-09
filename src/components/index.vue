<template>
    <div class="index"></div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'index',
        data() {
            return {
            }
        },
        created() {
            // 微信授权
            let _this=this
            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/wx/auth/url`,
                // params:{url:'http://192.168.0.29:9001/#/home'}
//                params:{url:'http://twy.blue-cube.cn/store/index.html#/home'}
//                params:{url:'http://qinzi.blue-cube.cn/store/index.html#/home'}
               params:{url:'http://ka.genshang.cn/store/index.html#/home'}
            }).then((res) => {
                _this.loadingShowA()
                let d=res.data
//                console.log('授权信息',d)
                if (d.code === 0){
                    let authUrl=d.data.authUrl // 授权成功跳转地址
                    window.location.href=authUrl
                }else {
                    _this.$store.state.errorMsg=d.msg
                    _this.$store.state.errorStatus=true
                }
            }).catch((err) => {
                _this.loadingShowA()
                _this.$store.state.errorMsg='微信授权错误'
                _this.$store.state.errorStatus=true
                // console.log(err)

                _this.wxAuthFail() // 微信授权失败
            })
        },
        methods: {
            ...mapActions(['loadingShowA']),
            wxAuthFail(){ // 如果微信授权失败或错误，重新获取授权
                setTimeout(()=>{
                    window.location.reload()
                },1500)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
