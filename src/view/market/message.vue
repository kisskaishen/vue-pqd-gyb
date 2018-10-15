<template>
    <div class="marketMessage">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>发布状态：</label>
                    <el-select v-model="status">
                        <el-option
                            v-for="item,index in statuses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col style="width: auto">
                    <label>发布时间：</label>
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
            </el-row>
            <el-row>
                <el-button type="primary" plain round @click="searchBtn">检索</el-button>
                <el-button type="primary" round @click="addMessage">新增</el-button>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="msg_id" label="ID" align="center"></el-table-column>
                <el-table-column prop="msg_title" label="消息名称" align="center"></el-table-column>
                <el-table-column prop="msg_content" label="消息内容" align="center"></el-table-column>
                <el-table-column prop="publish_time" label="发布时间" align="center"></el-table-column>
                <el-table-column prop="status" label="发布状态" align="center"></el-table-column>
                <el-table-column prop="address" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.btn.view" @click="watchBtn(scope)">查看</el-button>
                        <el-button type="text" v-if="scope.row.btn.edit" @click="editBtn(scope)">编辑</el-button>
                        <el-button type="text" v-if="scope.row.btn.del" @click="deleteBtn(scope)">删除</el-button>
                    </template>
                </el-table-column>
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
        <div class="dialogDiv">
            <el-dialog
                :title="title"
                :visible.sync="openMessage"
                width="600px">
                <p>
                    <label>消息名称：</label>
                    <el-input v-model="messageName" placeholder="消息名称"></el-input>
                </p>
                <p>
                    <label>消息内容：</label>
                    <el-input type="textarea" v-model="messageContent" placeholder="消息内容"></el-input>
                </p>
                <p>
                    <label>发布：</label>
                    <el-radio-group v-model="publishType">
                        <el-radio label="1">实时发布</el-radio>
                        <el-radio label="2">定时发布</el-radio>
                    </el-radio-group>
                    <el-date-picker
                        v-if="publishType=='2'"
                        v-model="publishTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </p>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="openMessage = false">取 消</el-button>
                    <el-button type="primary" @click="sureAddMessage" v-if="title=='新增消息'">确 定</el-button>
                    <el-button type="primary" @click="sureEditMessage" v-if="title=='编辑消息'">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "message",
        data() {
            return {
                statuses: [
                    {label: '全部', value: ''},
                    {label: '已发布', value: '1'},
                    {label: '待发布', value: '2'},
                ],
                status: '',              // 发布状态

                timeRange: '',           // 发布时间
                timeRangeFormat: '',           // 发布时间

                tableData: [],
                currentPage: 1,
                total: 0,
                rows: 10,

                openMessage: false,
                title: '新增消息',
                messageName: '',
                messageContent: '',
                publishType: '1',
                publishTime: '',

                detailInfo: {},              // 消息详情
                msg_id: ''
            }
        },
        mounted() {
            this.getMessage()
        },
        methods: {
            // 消息列表
            getMessage() {
                this.$post('message/list', {
                    msg_status: this.status,
                    publish_time_map: this.timeRangeFormat,
                    rows: this.rows,
                    page: this.currentPage,
                })
                    .then(res => {
                        this.total = parseInt(res.total)
                        this.tableData = res.list
                    })
            },

            // 时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 切换页面
            handleCurrentChange(val) {
                this.currentPage = val
                this.getMessage()
            },
            // 每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getMessage()
            },
            getDetail(msg_id) {
                this.$post('message/detail', {
                    msg_id: msg_id
                })
                    .then(res => {
                        this.detailInfo = res
                        this.messageName = res.msg_title
                        this.messageContent = res.msg_content
                        this.publishType = res.status_id
                        this.publishTime = res.publish_time
                    })
            },
            // 删除
            deleteBtn(val) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$post('message/delete', {
                        msg_id: val.row.msg_id
                    })
                        .then(res => {
                            this.tableData.splice(val.$index, 1)
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getMessage()
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 查看
            watchBtn(val) {
                this.title = '查看消息'
                this.openMessage = true
                this.getDetail(val.row.msg_id)
            },
            // 编辑
            editBtn(val) {
                this.title = '编辑消息'
                this.openMessage = true
                this.msg_id = val.row.msg_id
                this.getDetail(val.row.msg_id)

            },
            // 新增
            addMessage() {
                this.openMessage = true
            },
            // 条件搜索
            searchBtn() {
                this.currentPage = 1
                this.getMessage()
            },

            // 新增确认弹框
            sureAddMessage() {
                this.$post('message/add', {
                    msg_title: this.messageName,
                    msg_content: this.messageContent,
                    publish_type: this.publishType,
                    publish_time: this.publishType == '2' ? this.publishTime : ''
                })
                    .then(res => {
                        this.$message.success('添加成功~')
                        this.openMessage = false
                        this.getMessage()
                    })
            },
            // 编辑确认弹框
            sureEditMessage() {
                this.$post('message/edit', {
                    msg_id: this.msg_id,
                    msg_title: this.messageName,
                    msg_content: this.messageContent,
                    publish_type: this.publishType,
                    publish_time: this.publishType == '2' ? this.publishTime : ''
                })
                    .then(res => {
                        this.$message.success('编辑成功~')
                        this.openMessage = false
                        this.getMessage()
                    })
            }
        },
        watch: {
            openMessage(val) {
                if (val==false) {
                    this.messageName = ''
                    this.messageContent = ''
                    this.publishType = '1'
                    this.publishTime = ''
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .marketMessage {
        padding: 80px 100px;
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
        .dialogDiv {
            .el-dialog {
                p {
                    padding: 12px 0;
                }
            }
        }
    }
</style>
