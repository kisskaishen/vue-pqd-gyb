<template>
    <div class="crumbDiv">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!--<el-breadcrumb-item :to="{ path: crumb1Path }">{{crumb1}}</el-breadcrumb-item>-->
            <el-breadcrumb-item>{{crumb1}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="crumb2">{{crumb2}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
    export default {
        name: "crumb",
        data() {
            return {
                crumb1: '',
                crumb1Path: '',
                crumb2: '',
                crumb2Path: '',
            }
        },
        mounted() {
            this.getCrumbData()
        },
        methods: {
            getCrumbData() {
                switch (this.$route.path) {
                    case '/index':
                        this.crumb1 = '首页'
                        this.crumb2 = ''
                        break;
                    case '/goods/class':
                        this.crumb1 = '商品管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/goods/index':
                        this.crumb1 = '商品管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/market/class':
                        this.crumb1 = '营销管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/market/material':
                        this.crumb1 = '营销管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/market/addMaterial':
                        this.crumb1 = '营销管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/market/message':
                        this.crumb1 = '营销管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/user/index':
                        this.crumb1 = '用户管理'
                        this.crumb2 = '用户列表'
                        break;
                    case '/user/detail':
                        this.crumb1 = '用户管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/order/index':
                        this.crumb1 = '订单管理'
                        this.crumb2 = '订单列表'
                        break;
                    case '/order/detail':
                        this.crumb1 = '订单管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/fund/index':
                        this.crumb1 = '资金管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/fund/cashCheck':
                        this.crumb1 = '资金管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/coin/index':
                        this.crumb1 = '淘金币管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/coin/setting':
                        this.crumb1 = '淘金币管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/setting/commission':
                        this.crumb1 = '基础功能设置'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/setting/cash':
                        this.crumb1 = '基础功能设置'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/banner/index':
                        this.crumb1 = '广告管理'
                        this.crumb2 = '广告列表'
                        break;
                    case '/banner/addBanner':
                        this.crumb1 = '广告管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/banner/editBanner':
                        this.crumb1 = '广告管理'
                        this.crumb2 = this.$route.meta.title
                        break;

                    case '/manage/index':
                        this.crumb1 = '权限管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/system/index':
                        this.crumb1 = '日志管理'
                        this.crumb2 = '日志列表'
                        break;
                    case '/yun/index':
                        this.crumb1 = '云发单管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/yun/addYun':
                        this.crumb1 = '云发单管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                    case '/yun/robot':
                        this.crumb1 = '云发单管理'
                        this.crumb2 = this.$route.meta.title
                        break;
                }
            }
        },
        watch: {
            $route(to, from) {
                this.getCrumbData()
            }
        }
    }
</script>

<style scoped>

</style>
