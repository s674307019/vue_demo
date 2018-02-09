<template>
    <div class="chooseTemplate">
        <div class="sentItem">
            <div class="sentList">
                <section class="select checked"></section>
                <div class="listWords">
                    <section class="title">
                        <span class="arrow"></span>
                        <p>生日祝福</p>
                    </section>
                    <section class="content">
                        <p>尊敬的VIP 会员，为庆祝本店XX 店重张，xx月xx日至xx日在白云区分店，xx月xx日在朝阳区、东安区、西城区、南城区分店，购物享7.2 折优惠。祝您周末愉快!#</p>
                    </section>
                </div>
            </div>
            <div class="sentList">
                <section class="select"></section>
                <div class="listWords">
                    <section class="title">
                        <span class="arrow"></span>
                        <p>卡次不足</p>
                    </section>
                    <section class="content">
                        <p>尊敬的VIP 会员，为庆祝本店XX 店重张，xx月xx日至xx日在白云区分店，xx月xx日在朝阳区、东安区、西城区、南城区分店，购物享7.2 折优惠。祝您周末愉快!#</p>
                    </section>
                </div>
            </div>
            <div class="sentList">
                <section class="select"></section>
                <div class="listWords">
                    <section class="title">
                        <span class="arrow"></span>
                        <p>余额不足</p>
                    </section>
                    <section class="content">
                        <p>尊敬的VIP 会员，为庆祝本店XX 店重张，xx月xx日至xx日在白云区分店，xx月xx日在朝阳区、东安区、西城区、南城区分店，购物享7.2 折优惠。祝您周末愉快!#</p>
                    </section>
                </div>
            </div>
        </div>
        <router-link to="/addTemplate" tag="div" class="addBtn"><img src="../../assets/icons/btn_add@2x.png" alt=""></router-link>
        <button>确定</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'chooseTemplate',
        components: {},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
            }
        },
        created() {

        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            getMemberFn(pn){
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/memberList`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        pageNo:pn,
                        pageSize:10,
                        keyword:_this.searchVal
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.memberList=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有会员列表'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.memberList=_this.memberList.concat(d.data.list)
//                            if (d.data.list.length===0){
//                                _this.hasNoMore=true
//                            }else {
//                                _this.hasNoMore=false
//                            }
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
            moreViewFn(){ // 查看更多
                if (this.moreView==='查看更多'){
                    this.pageNo ++
                    this.getMemberFn(this.pageNo)
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/sent.styl"
    .chooseTemplate
        padding-bottom 80px
        width 100%
        .sentItem
            .sentList
                .select
                    margin-right 23px
                    display inline-block
                    vertical-align middle
                    background url("../../assets/icons/btn_circle@2x.png") center no-repeat
                    background-size 18px
                    width 18px
                    height 18px
                .checked
                    background-image url("../../assets/icons/btn_check@2x.png")
                .listWords
                    vertical-align middle
                    width 85.4%
                    .title
                        .arrow
                            top 11px
                        p
                            color $color7
                            font-size 14px
        .addBtn
            margin 77px auto 0 auto
            width 80px
            img
                width 80px
                height 80px
        button
            $button(fixed,$color6,$color7,100%)
</style>
