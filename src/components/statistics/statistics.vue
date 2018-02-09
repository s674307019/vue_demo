<template>
    <div class="statistics">
        <div class="header">
            <section class="totalTitle">收入总计</section>
            <section class="totalCount">&#165;{{countAmount}}</section>
            <section class="addMember">新增会员<span>{{totalNumber}}</span></section>
        </div>
        <div class="sDate">
            <span><input id="datePinker" type="button"
                         v-model="startDate" readonly
                         :data-lcalendar="datePinkerStr"></span>
            <span>至</span>
            <span><input id="datePinker2" type="button"
                         v-model="endDate" readonly
                         :data-lcalendar="datePinkerStr"></span>
        </div>
        <div class="analyze">数据分析</div>
        <div class="listsBox">
            <router-link to="/statisticsData/dataWeek" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>开通会员统计</p>
                </section>
            </router-link>
            <router-link to="/statisticsExperienceData" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>体验卡销售统计</p>
                </section>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'statistics',
        components: {},
        data() {
            return {
                endDate:'', // 默认为当前日期(结束日期)
                startDate:'', // 选择的日期(开始日期)
                watchStatus:false,
                datePinkerStr:'',
                errorStatus:false, // 错误信息提醒
                errorMsg:'',
                loadingShow:false,
                countAmount:'', // 总收入
                totalNumber:'' // 新增会员数
            }
        },
        created() {
            // 格式化日期
            let date=this.timeFn()
            // 当月1号
            let otf=date.slice(0,7)+'-01'
            this.endDate=date
            this.startDate=otf
            this.datePinkerStr=`2010-01-01,${this.endDate}`
            // 请求数据
            this.getStatisticsFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
        },
        mounted(){
            // 组件挂载完成初始化日期
            let calendar = new lCalendar()
            calendar.init({
                'trigger': '#datePinker', //标签id
                'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            })
            let calendar2 = new lCalendar()
            calendar2.init({
                'trigger': '#datePinker2', //标签id
                'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            })
        },
        watch: {
            startDate(nv,ov){ // 监听开始日期变化
                let s=this.contrastFn(nv)
                let e=this.contrastFn(this.endDate)
                if(this.watchStatus){
                    if(s>e){
                        this.$store.state.errorMsg='开始日期不能大于结束日期'
                        this.$store.state.errorStatus=true
                    }else {
                        // 请求数据
                        this.getStatisticsFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
                    }
                }
            },
            endDate(nv,ov){ // 监听开始日期变化
                let s=this.contrastFn(this.startDate)
                let e=this.contrastFn(nv)
                if(this.watchStatus){
                    if(s>e){
                        this.$store.state.errorMsg='结束日期不能小于开始日期'
                        this.$store.state.errorStatus=true
                    }else {
                        // 请求数据
                        this.getStatisticsFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
                    }
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            timeFn(){ // 日期格式化函数
                let de = new Date()
                return de.getFullYear()+'-'
                    +((de.getMonth()+1)>=10?(de.getMonth()+1):'0'+(de.getMonth()+1))+'-'
                    +(de.getDate()>=10?de.getDate():'0'+de.getDate())
            },
            contrastFn(v){ // 比较时间，格式化时间
                let n=parseInt(v.replace(/-/g,''))
                return n
            },
            getStatisticsFn(st,et){ // 获取数据
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/statisticalAnalysis`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        startTime:st,
                        endTime:et
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.countAmount=d.data.countAmount?d.data.countAmount:'0.00' // 总收入
                        if (_this.countAmount.toString().indexOf('.')===-1){
                            _this.countAmount=_this.countAmount.toString()+'.00'
                        }
                        _this.totalNumber=d.data.totalNumber?d.data.totalNumber:'0' // 新增会员数

                        this.watchStatus=true
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
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .statistics
        width 100%
        position relative
        .header
            padding-top 72px
            background-color #FFE493
            width @width
            height 245px
            text-align center
            .totalTitle
                font-size 15px
                color $black
            .totalCount
                margin-top 20px
                font-size 30px
                font-weight 600
                color $black
            .addMember
                margin-top 50px
                font-size 12px
                font-weight 600
                color #545454
                line-height 17px
                span
                    margin-left 16px
                    font-size 14px
        .sDate
            position absolute
            top 0
            left 0
            background-color rgba(255,255,255,.6)
            width 100%
            height 40px
            line-height @height
            text-align center
            font-size 0
            span
                color #FF8000
                font-size 15px
                &:nth-of-type(2)
                    color #151515
                    margin 0 20px
                input
                    border 0
                    background none
                    color #FF8000
                    font-size 15px
                    text-align center
                    width 80px
        .analyze
            padding 11px 16px
            background-color $color9
            color $color7
            font-size 14px
</style>
