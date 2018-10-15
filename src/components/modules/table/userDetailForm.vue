<template>
    <div class="dialogDiv">
        <ul>
            <li>
                <i></i>
                <label>推广收益：{{tipsData.promote.total_earnings}}</label>
                <p>订单数:{{tipsData.promote.total_order}}</p>
            </li>
            <li>
                <i></i>
                <label>团队订单收益：{{tipsData.team.total_earnings}}</label>
                <p>订单数:{{tipsData.team.total_order}}</p>
            </li>
            <li>
                <i></i>
                <label>高级总监收益：{{tipsData.director.total_earnings}}</label>
                <p>订单数:{{tipsData.director.total_order}}</p>
            </li>
        </ul>
        <div class="searchDiv">
            <el-row>
                <el-col style="width: auto">
                    <label>时间</label>
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="updateDate">
                    </el-date-picker>
                </el-col>
                <el-col>
                    <label style="opacity: 0;">注册日期</label>
                    <el-button type="primary" @click="searchBtn">检索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="gridData">
            <el-table-column property="date" label="时间" align="center" width="160"></el-table-column>
            <el-table-column property="promote_earnings" label="推广订单收益" align="center" width="160"></el-table-column>
            <el-table-column property="created_at_label" label="收益订单详情" align="center" width="170">
                <template slot-scope="scope">
                    <p v-for="item,index in scope.row.order.promote">
                        <span>平台：{{item.title}}</span>
                        <span>收益：{{item.earnings}}</span>
                        <span>订单数：{{item.count}}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column property="team_earnings" label="团队订单收益" align="center" width="160"></el-table-column>
            <el-table-column property="created_at_label" label="收益订单详情" align="center" width="170">
                <template slot-scope="scope">
                    <p v-for="item,index in scope.row.order.team">
                        <span>平台：{{item.title}}</span>
                        <span>收益：{{item.earnings}}</span>
                        <span>订单数：{{item.count}}</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column property="director_earnings" label="高级总监收益" align="center" width="160"></el-table-column>
            <el-table-column property="created_at_label" label="收益订单详情" align="center" width="170">
                <template slot-scope="scope">
                    <p v-for="item,index in scope.row.order.director">
                        <span>平台：{{item.title}}</span>
                        <span>收益：{{item.earnings}}</span>
                        <span>订单数：{{item.count}}</span>
                    </p>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageDiv">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    export default {
        name: "userDetailForm",
        data() {
            return {
                tipsData: {},
                timeRange: '',            // 注册时间
                timeRangeFormat: '',            // 注册时间
                gridData: [],
                rows: 10,
                total: 0,
                currentPage: 1,
            }
        },
        mounted() {
            this.getTips()
            this.getList()
        },
        methods: {
            //
            getTips() {
                this.$post('User/getUserEarningsCount', {
                    uid: this.$route.query.user_id,
                })
                    .then(res => {
                        this.tipsData = res
                    })
            },
            // table
            getList() {
                this.$post('User/getUserDayStatisticsList', {
                    uid: this.$route.query.user_id,
                    count_date: this.timeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.gridData = res.list
                        this.total = res.total
                    })
            },
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            handleSizeChange(val) {
                this.rows = val
                this.getList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            }
        },
        watch: {
            $route(to, from) {
                if (this.$route.query.user_id) {
                    this.getList()
                }
            }
        }

    }
</script>

<style scoped lang="scss">
    .dialogDiv {
        ul {
            margin-top: -20px;
            margin-bottom: 20px;
            li {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 30px;
                line-height: 30px;
                background-color: #F0F3FA;
                color: #666;
                margin-bottom: 10px;
                padding: 0 20px;
                i {
                    display: block;
                    width: 14px;
                    height: 14px;
                    margin-right: 12px;
                }
                label {
                    margin-right: 54px;
                }
                &:nth-child(1) {
                    i {
                        background: url("../../../imgs/user/icon-1.png") no-repeat center /100%;
                    }
                }
                &:nth-child(2) {
                    i {
                        background: url("../../../imgs/user/icon-2.png") no-repeat center /100%;
                    }
                }
                &:nth-child(3) {
                    i {
                        background: url("../../../imgs/user/icon-3.png") no-repeat center /100%;
                    }
                }

            }
        }
    }
</style>
