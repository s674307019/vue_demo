<template>
    <div class="month">
        <div class="dataBox">
            <h3 class="totalText">总计：{{total}}(人)</h3>
            <div class="chartShadow" style="width: 1200px;">
                <!--<IEcharts style="width: 1200px;height: 400px; margin-left: -60px;background-color: #FFF;" ref="month"-->
                          <!--:option="month.option" :loading="month.loading"-->
                <!--&gt;</IEcharts>-->
            </div>
        </div>
        <div class="landscape">请横屏查看</div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    // import IEcharts from 'vue-echarts-v3/src/full.vue'
    export default {
        name: 'month',
        // components: {IEcharts},
        props:{
            cardType:{
                type:String
            }
        },
        data() {
            return {
                docHeight:'',
                total:0,
                timeArr:[], // 当前月天，1-31号
                dataArr:[],
                month:{
                    loading: false,
                    option: {
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: '#FFF',
                            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
                            textStyle:{
                                color:'#3C4144'
                            }
                        },
                        legend:{
                        },
                        xAxis: [{
                            boundaryGap: false,
                            data: [],
                            axisLine: { // 轴线
                                show: false
                            },
                            axisTick:{ // 轴刻度
                                show:false
                            },
                            splitLine: { // 网格线
                                show: false
                            }
                        }],
                        yAxis: [{
                            name: '人数',
                            axisLine: { // 轴线
                                show: false
                            },
                            axisTick:{ // 轴刻度
                                show:false
                            },
                            splitLine: { // 网格线
                                show: false
                            }
                        }],
                        series: [{
                            name: '开卡人数',
                            type: 'line',
                            symbolSize: 8,
                            data: [],
                            itemStyle: {
                                normal: {
                                    color: '#3ACA60',
                                    lineStyle: {
                                        color: '#3ACA60'
                                    }
                                }
                            }
                        }]
                    },
                }
            }
        },
        created() {
            this.docHeight=document.documentElement.clientHeight

            let monthNumber=this.getCountDays() // 当前月天数
            for (let i=0;i<monthNumber;i++){
                this.timeArr.push(i+1)
            }
            for (let i=0;i<monthNumber;i++){
                this.dataArr.push(0)
            }
            this.month.option.xAxis[0].data=this.timeArr // 格式化eCharts数据
//            this.month.option.series[0].data=this.dataArr // 格式化eCharts数据


            this.getStatiticsDataFn('months',this.cardType) // 请求数据
        },
        mounted(){
            window.onresize=this.$refs.month.resize
        },
        computed: {},
        watch: {
            cardType(nVal,oVal){
                if(nVal){
                    this.dataArr=[]
                    this.getStatiticsDataFn('months',this.cardType)
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            getCountDays() { // 返回当月的天数
                let curDate = new Date()
                let curMonth = curDate.getMonth()
                curDate.setMonth(curMonth + 1)
                curDate.setDate(0)
                return curDate.getDate()
            },
            timeFn(v){ // 日期格式化函数- 获取当前日
                let de = new Date(v)
                return de.getDate()
            },
            getStatiticsDataFn(dt,ct){
                let _this=this
                _this.loadingShowA()
                _this.total=0
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/userCensus`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        dateKey:dt,
                        cardType:ct
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        let monthData=d.data
                        monthData.forEach((c,i)=>{
                            _this.total+=c.num
                        })

                        let month=monthData.map((c,i)=>{ // 几号
                            return _this.timeFn(c.joinTime)
                        })
                        let data=monthData.map((c,i)=>{ // 几号对应的数据
                            return c.num
                        })

                        _this.timeArr.forEach((c1,i1)=>{
                            month.forEach((c2,i2)=>{
                                if (c2===c1){
                                    _this.dataArr[i1]=data[i2]
                                }
                            })
                        })

//                        console.log(_this.dataArr)
                        _this.month.option.series[0].data=_this.dataArr
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
    .month
        width 100%
        .dataBox
            padding-bottom 17px
            width @width
            .totalText
                margin-left 15px
                color #C2C2C2
                font-size 17px
            .dataChart
                width 100%
                overflow auto
            .chartShadow
                box-shadow 0 1px 1px rgba(70,65,83,.2)
        .landscape
            text-align center
            font-size 17px
            color #333
            width @width
</style>
