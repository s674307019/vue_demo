<template>
    <div class="noneList" v-show="reminderStatusG">{{reminderWordsG}}</div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'noneList',
        components: {},
        data() {
            return {
            }
        },
        created() {
        },
        computed: {
            ...mapGetters(['reminderWordsG','reminderStatusG'])
        },
        watch: {},
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .noneList
        position fixed
        top 35%
        background none
        text-align center
        font-size 16px
        color #333
        text-shadow 0 1px 0 #FFF
        width 100%
</style>
