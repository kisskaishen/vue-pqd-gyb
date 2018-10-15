<template>
    <div class="systemIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>日志等级</label>
                    <el-select v-model="logLevel" placeholder="请选择日志等级">
                        <el-option
                            v-for="item,index in logLeveles"
                            :label="item.value"
                            :key="item.value"
                            :value="item.key"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>日志标题</label>
                    <el-input v-model="logTitle" placeholder="日志标题"></el-input>
                </el-col>
                <el-col>
                    <label>日期</label>
                    <el-date-picker
                        v-model="date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col>
                    <label>日志数据</label>
                    <el-input v-model="logData" placeholder="日志数据"></el-input>

                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-button type="primary" round plain @click="searchBtn">检索</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="log_ip" label="IP" fixed align="center"></el-table-column>
                <el-table-column prop="timestamp" label="时间" fixed align="center"></el-table-column>
                <el-table-column prop="log_title" label="日志标题" fixed align="center"></el-table-column>
                <el-table-column prop="log_level" label="日志等级" align="center"></el-table-column>
                <el-table-column prop="log_data" width="400" label="日志内容" align="center"></el-table-column>
                <el-table-column prop="index" label="索引" align="center"></el-table-column>
                <el-table-column prop="log_module" label="模型" align="center"></el-table-column>
                <el-table-column prop="log_controller" label="控制器" align="center"></el-table-column>
                <el-table-column prop="log_action" label="方法" align="center"></el-table-column>
                <el-table-column prop="log_post" label="post数据" align="center"></el-table-column>
                <el-table-column prop="log_get" label="get数据" align="center"></el-table-column>
            </el-table>
        </div>
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
        name: "systemIndex",
        data() {
            return {
                logLeveles: [],
                logLevel: '',            // 日志等级
                logTitle: '',            // 日志标题
                date: '',            // 日期
                logData: '',            // 日志数据

                tableData: [],
                rows: 10,
                currentPage: 1,                 // 当前页数
                total: 0,                       // 总数据

            }
        },
        mounted() {
            this.getConfig()
            this.getList()
        },
        methods: {
            getConfig() {
                this.$post('log/searchConf', {})
                    .then(res => {
                        this.logLeveles = res.log_level
                    })
            },
            getList() {
                this.$post('log/list', {
                    log_title: this.logTitle,
                    day: this.date,
                    log_level: this.logLevel,
                    log_data: this.logData,
                    page: this.currentPage,
                    rows: this.rows,
                    keywords: this.userName
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getList()
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            },


        },
        watch: {}
    }
</script>

<style scoped lang="scss">
    .systemIndex {
        padding: 80px 100px;
    }
</style>
