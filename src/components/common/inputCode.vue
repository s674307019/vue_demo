<template>
    <div class="inputCodeBox">
        <span v-for="(c,i) in codeSize"><input class="code" type="button" readonly
                     v-model="inputCodeArr[i]"></span>
        <input class="inputCode" type="tel" maxlength="1"
               v-model="inputCode"
               :style="{'left':inputCodeLeft+'%'}"
               @keyup="inputCodeKeyup">
    </div>
</template>

<script>
    export default {
        name: 'inputTest',
        data() {
            return {
                codeSize:4, // 显示几个验证码
                inputCodeArr:[], // 输入的验证码集合
                inputCode:'', // 输入的验证码
                inputCodeLeft:0 // 初始化第一次输入位置
            }
        },
        methods: {
            inputCodeKeyup(e){
                if(e.keyCode===8){
                    this.inputCodeArr=[]
                    this.inputCodeLeft=0
                }else if((e.keyCode>=48&&e.keyCode<=57)||(e.keyCode>=96&&e.keyCode<=105)) {
                    let num=Number(this.inputCode)
                    if (num>=0 && num<=9){ // 只能输入 0-9的数字
                        if (this.inputCodeArr.length<4){
                            this.inputCodeArr.push(this.inputCode)
                        }
                        // 注意：先执行push，在移动
                        if (this.inputCodeArr.length<4){
                            this.inputCodeLeft+=25
                            this.inputCode=''
                        }
                        if(this.inputCodeArr.length===4){
                            this.$emit('successCode',this.inputCodeArr.join(''))
                        }
                    }
                }else {
                    this.inputCode=''
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .inputCodeBox
        width 100%
        position relative
        font-size 0
        span
            display inline-block
            vertical-align middle
            width 25%
            input
                margin 0 auto
                background-color #FFF
                appearance none
                outline none
                border-top 0
                border-left 0
                border-right 0
                border-radius 0
                border-bottom 2px solid #B2B2B2
                text-align center
                color #3C3C3C
                font-size 24px
                font-weight 600
                width 55%
                height 40px
        .inputCode
            position absolute
            top 0
            left 0
            border 0
            background none
            appearance none
            outline none
            text-align center
            color #3C3C3C
            font-weight 600
            font-size 24px
            width 25%
            height 38px
</style>
