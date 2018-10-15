<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'icon-index',
                        index: '/index',
                        title: '系统首页'
                    },
                    {
                        icon: 'icon-goods',
                        index: '1',
                        title: '商品管理',
                        subs: [
                            {
                                index: '/goods/class',
                                title: '品类管理'
                            },
                            {
                                index: '/goods/index',
                                title: '商品列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-market',
                        index: '2',
                        title: '营销管理',
                        subs: [
                            {
                                index: '/market/class',
                                title: '分类管理'
                            },
                            {
                                index: '/market/material',
                                title: '素材管理'
                            },
                            // {
                            //     index: '/market/addMaterial',
                            //     title: '新增素材'
                            // },
                            {
                                index: '/market/message',
                                title: '消息管理'
                            }
                        ]
                    },
                    {
                        icon: 'icon-user',
                        index: '3',
                        title: '用户管理',
                        subs: [
                            {
                                index: '/user/index',
                                title: '用户列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-order',
                        index: '4',
                        title: '订单管理',
                        subs: [
                            {
                                index: '/order/index',
                                title: '订单列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-fund',
                        index: '5',
                        title: '资金管理',
                        subs: [
                            {
                                index: '/fund/index',
                                title: '资金列表'
                            },
                            {
                                index: '/fund/cashCheck',
                                title: '提现审核'
                            }
                        ]
                    },
                    // {
                    //     icon: 'el-icon-rank',
                    //     index: '6',
                    //     title: '淘金币管理',
                    //     subs: [
                    //         {
                    //             index: '/coin/index',
                    //             title: '淘金币列表'
                    //         },
                    //         {
                    //             index: '/coin/setting',
                    //             title: '发放设置'
                    //         }
                    //     ]
                    // },
                    {
                        icon: 'icon-setting',
                        index: '7',
                        title: '基础功能设置',
                        subs: [
                            {
                                index: '/setting/commission',
                                title: '佣金设置'
                            },
                            {
                                index: '/setting/cash',
                                title: '提现设置'
                            }
                        ]
                    },
                    {
                        icon: 'icon-banner',
                        index: '8',
                        title: '广告管理',
                        subs: [
                            {
                                index: '/banner/index',
                                title: '广告列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-manage',
                        index: '9',
                        title: '权限管理',
                        subs: [
                            {
                                index: '/manage/index',
                                title: '管理员列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-system',
                        index: '10',
                        title: '日志管理',
                        subs: [
                            {
                                index: '/system/index',
                                title: '日志列表'
                            }
                        ]
                    },
                    {
                        icon: 'icon-yun',
                        index: '11',
                        title: '云发单管理',
                        subs: [
                            {
                                index: '/yun/index',
                                title: '爆款推荐'
                            },
                            {
                                index: '/yun/robot',
                                title: '机器人管理'
                            }
                        ]
                    },

                    // {
                    //     icon: 'el-icon-warning',
                    //     index: 'permission',
                    //     title: '权限测试'
                    // },
                    // {
                    //     icon: 'el-icon-error',
                    //     index: '404',
                    //     title: '404页面'
                    // }
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
<style>
    .sidebar ul li ul li {
        padding-left: 60px !important;
    }
</style>
<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 230px;
    }

    .sidebar > ul {
        height: 100%;
    }

    .sidebar > ul span {
        margin-left: 22px;
    }

    i {
        display: inline-block;
        width: 20px;
        height: 20px;
    }

    .icon-index {
        background: url("../../imgs/aside/white/icon-index.png") no-repeat center /100%;
    }

    .icon-goods {
        background: url("../../imgs/aside/white/icon-goods.png") no-repeat center /100%;
    }

    .icon-market {
        background: url("../../imgs/aside/white/icon-market.png") no-repeat center /100%;
    }

    .icon-user {
        background: url("../../imgs/aside/white/icon-user.png") no-repeat center /100%;
    }

    .icon-order {
        background: url("../../imgs/aside/white/icon-order.png") no-repeat center /100%;
    }

    .icon-fund {
        background: url("../../imgs/aside/white/icon-fund.png") no-repeat center /100%;
    }

    .icon-setting {
        background: url("../../imgs/aside/white/icon-setting.png") no-repeat center /100%;
    }

    .icon-banner {
        background: url("../../imgs/aside/white/icon-banner.png") no-repeat center /100%;
    }

    .icon-manage {
        background: url("../../imgs/aside/white/icon-manage.png") no-repeat center /100%;
    }

    .icon-system {
        background: url("../../imgs/aside/white/icon-system.png") no-repeat center /100%;
    }

    .icon-yun {
        background: url("../../imgs/aside/white/icon-system.png") no-repeat center /100%;
    }

</style>
