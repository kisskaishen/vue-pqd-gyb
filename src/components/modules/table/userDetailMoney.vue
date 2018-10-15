<template>
    <div class="dialogDiv">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>平台类型</label>
                    <el-select v-model="platformType" placeholder="请选择平台类型">
                        <el-option
                            v-for="item,index in platformTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>订单编号</label>
                    <el-input v-model="orderNumber" placeholder="请输入订单标号"></el-input>
                </el-col>
                <el-col>
                    <label>收支类型</label>
                    <el-select v-model="moneyType" placeholder="请选择收支类型">
                        <el-option
                            v-for="item,index in moneyTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
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
            <el-table-column property="nickname" label="时间" align="center"></el-table-column>
            <el-table-column property="mobile" label="收支类型" align="center"></el-table-column>
            <el-table-column property="created_at_label" label="数量" align="center"></el-table-column>
            <el-table-column property="one_level" label="事项" align="center"></el-table-column>
            <el-table-column property="big_level" label="明细" align="center"></el-table-column>
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
        name: "userDetail",
        data() {
            return {
                platformTypes:[],
                platformType:'',         // 平台类型
                orderNumber: '',            // 订单表号

                moneyTypes:[],
                moneyType:'',               // 收支类型

                timeRange: '',            // 注册时间
                timeRangeFormat: '',            // 注册时间
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
                    uid: this.$route.query.user_id,
                    type: this.type || '1',
                    nickname: this.userNick,
                    mobile: this.userTel,
                    reg_time: this.timeRangeFormat,
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
            },
            handleCurrentChange(val) {
                this.currentPage = val
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            }
        }

    }
</script>

<style scoped lang="scss">

</style>
