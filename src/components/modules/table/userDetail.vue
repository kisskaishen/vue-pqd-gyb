<template>
    <div class="dialogDiv">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>用户昵称</label>
                    <el-input v-model="userNick" placeholder="请输入用户昵称"></el-input>
                </el-col>
                <el-col>
                    <label>手机号码</label>
                    <el-input v-model="userTel" placeholder="请输入手机号码"></el-input>
                </el-col>
                <el-col style="width: auto">
                    <label>注册日期</label>
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
            <el-table-column property="nickname" label="用户昵称" align="center" width="230"></el-table-column>
            <el-table-column property="mobile" label="会员手机号" align="center" width="230"></el-table-column>
            <el-table-column property="created_at_label" label="注册日期" align="center" width="230"></el-table-column>
            <el-table-column property="one_level" label="下级会员(人)" align="center" width="230"></el-table-column>
            <el-table-column property="big_level" label="下级运营总监(人)" align="center" width="230"></el-table-column>
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
        props:['dataType'],
        name: "userDetail",
        data() {
            return {
                userNick: '',            // 用户昵称
                userTel: '',            // 用户手机号
                timeRange: '',            // 注册时间
                timeRangeFormat: '',            // 注册时间
                userNick: '',            // 用户昵称
                gridData: [],
                rows: 10,
                total: 0,
                currentPage: 1,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            // table
            getList() {
                this.$post('User/getTeamList', {
                    uid:this.$route.query.user_id,
                    type:this.dataType || '1',
                    nickname:this.userNick,
                    mobile:this.userTel,
                    reg_time:this.timeRangeFormat,
                    page:this.currentPage,
                    rows:this.rows,
                })
                    .then(res => {
                        this.gridData = res.list
                        this.total = res.total
                        if (this.dataType=='1') {
                            this.$emit('listenTotal1',this.total)
                        } else if (this.dataType=='2') {
                            this.$emit('listenTotal2',this.total)
                        }
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
        watch:{
            $route(to, from) {
                if (this.$route.query.user_id) {
                    this.getList()
                    this.currentPage = 1
                    this.rows = 10
                }
            }
        }

    }
</script>

<style scoped lang="scss">
.el-table {
    width: 100%;
    .thead {
        tr {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            th {
                flex: 1;
            }
        }
    }
}
</style>
