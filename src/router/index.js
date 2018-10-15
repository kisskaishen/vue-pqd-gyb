import Vue from 'vue';
import Router from 'vue-router';
import {getCookie} from "../config/util";


Vue.use(Router);

let router = new Router({
    mode: 'history',
    // linkActiveClass:'router-link-exact-active',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件', login: true},
            children: [
                {
                    path: '/index',
                    component: resolve => require(['../view/index/index.vue'], resolve),
                    meta: {title: '首页', login: true}
                },
                // 商品管理
                {
                    path: '/goods/index',
                    component: resolve => require(['../view/goods/index.vue'], resolve),
                    meta: {title: '商品列表', login: true},
                },
                {
                    path: '/goods/class',
                    component: resolve => require(['../view/goods/class.vue'], resolve),
                    meta: {title: '品类管理', login: true},
                },
                // 营销管理
                {
                    path: '/market/class',
                    component: resolve => require(['../view/market/class.vue'], resolve),
                    meta: {title: '分类管理', login: true}
                },
                {
                    path: '/market/material',
                    component: resolve => require(['../view/market/material.vue'], resolve),
                    meta: {title: '素材管理', login: true}
                },
                {
                    path: '/market/addMaterial',
                    component: resolve => require(['../view/market/addMaterial.vue'], resolve),
                    meta: {title: '新增素材', login: true}
                },
                {
                    path: '/market/editMaterial',
                    component: resolve => require(['../view/market/editMaterial.vue'], resolve),
                    meta: {title: '编辑素材', login: true}
                },
                {
                    path: '/market/watchMaterial',
                    component: resolve => require(['../view/market/watchMaterial.vue'], resolve),
                    meta: {title: '查看素材', login: true}
                },
                {
                    path: '/market/message',
                    component: resolve => require(['../view/market/message.vue'], resolve),
                    meta: {title: '消息管理', login: true}
                },
                // 用户管理
                {
                    path: '/user/index',
                    component: resolve => require(['../view/user/index.vue'], resolve),
                    meta: {title: '用户管理', login: true}
                },
                {
                    path: '/user/detail',
                    component: resolve => require(['../view/user/detail.vue'], resolve),
                    meta: {title: '用户详情', login: true}
                },
                // 订单管理
                {
                    path: '/order/index',
                    component: resolve => require(['../view/order/index.vue'], resolve),
                    meta: {title: '订单管理', login: true}
                },
                {
                    path: '/order/detail',
                    component: resolve => require(['../view/order/detail.vue'], resolve),
                    meta: {title: '订单详情', login: true}
                },
                // 资金管理
                {
                    path: '/fund/index',
                    component: resolve => require(['../view/fund/index.vue'], resolve),
                    meta: {title: '资金列表', login: true}
                },
                {
                    path: '/fund/cashCheck',
                    component: resolve => require(['../view/fund/cashCheck.vue'], resolve),
                    meta: {title: '提现审核', login: true}
                },
                {
                    path: '/coin/index',
                    component: resolve => require(['../view/coin/index.vue'], resolve),
                    meta: {title: '淘金币管理', login: true}
                },
                {
                    path: '/coin/setting',
                    component: resolve => require(['../view/coin/setting.vue'], resolve),
                    meta: {title: '发放设置', login: true}
                },
                {
                    path: '/setting/index',
                    component: resolve => require(['../view/setting/index.vue'], resolve),
                    meta: {title: '基础功能设置', login: true}
                },
                {
                    path: '/setting/commission',
                    component: resolve => require(['../view/setting/commission.vue'], resolve),
                    meta: {title: '佣金设置', login: true}
                },
                {
                    path: '/setting/cash',
                    component: resolve => require(['../view/setting/cash.vue'], resolve),
                    meta: {title: '提现设置', login: true}
                },
                {
                    path: '/banner/index',
                    component: resolve => require(['../view/banner/index.vue'], resolve),
                    meta: {title: '广告管理', login: true}
                },
                {
                    path: '/banner/addBanner',
                    component: resolve => require(['../view/banner/addBanner.vue'], resolve),
                    meta: {title: '添加广告', login: true}
                },
                {
                    path: '/banner/editBanner',
                    component: resolve => require(['../view/banner/editBanner.vue'], resolve),
                    meta: {title: '编辑广告', login: true}
                },
                {
                    path: '/manage/index',
                    component: resolve => require(['../view/manage/index.vue'], resolve),
                    meta: {title: '管理员列表', login: true}
                },
                {
                    path: '/system/index',
                    component: resolve => require(['../view/system/index.vue'], resolve),
                    meta: {title: '日志管理', login: true}
                },
                {
                    path: '/yun/index',
                    component: resolve => require(['../view/yun/index.vue'], resolve),
                    meta: {title: '爆款推荐', login: true}
                },
                {
                    path: '/yun/addYun',
                    component: resolve => require(['../view/yun/addYun.vue'], resolve),
                    meta: {title: '新增爆款', login: true}
                },
                {
                    path: '/yun/robot',
                    component: resolve => require(['../view/yun/robot.vue'], resolve),
                    meta: {title: '机器人管理', login: true}
                }
            ]
        },
        {
            path: '/download/index',
            component: resolve => require(['../view/download/index.vue'], resolve),
            meta: {title: '高拥宝下载页', login: false}
            // meta: {title: '高拥宝下载页'}
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    if (to.matched.some((item) => item.meta.login)) {
        let token = getCookie('token')
        if (!token && to.path !== '/login') {
            next('/login');
        } else {
            next()
        }
    } else {
        next()
    }

    if (to.meta.title) {
        window.document.title = to.meta.title
    } else {
        window.document.title = '高拥宝后台管理'
    }
})

export default router;
