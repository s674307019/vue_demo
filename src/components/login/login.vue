<template>
    <div class="login">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'login',
    components: {},
    data() {
        return {
        }
    },
    created() {
    },
    computed: {},
    watch: {},
    methods: {
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .login
        position fixed
        top 0
        left 0
        background-color #FFF
        width 100%
        height 100%
</style>
