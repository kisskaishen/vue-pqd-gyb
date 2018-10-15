<template>
    <div class="yunIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>会员ID：</label>
                    <el-input v-model="memberId" placeholder="请输入会员ID"></el-input>
                </el-col>
                <el-col>
                    <label>会员昵称：</label>
                    <el-input v-model="memberNick" placeholder="请输入会员昵称"></el-input>
                </el-col>
                <el-col>
                    <label>手机号：</label>
                    <el-input v-model="memberTel" placeholder="请输入手机号"></el-input>
                </el-col>
                <el-col>
                    <label>角色类型：</label>
                    <el-select v-model="roleType" placeholder="请选择">
                        <el-option
                            v-for="item,index in roleTypes"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <label>机器人微信号：</label>
                    <el-input v-model="robotWechat" placeholder="请输入机器人微信号"></el-input>
                </el-col>
                <el-col>
                    <label>机器人昵称：</label>
                    <el-input v-model="robotNick" placeholder="请输入机器人昵称"></el-input>
                </el-col>
                <el-col>
                    <label>当前状态：</label>
                    <el-select v-model="status" placeholder="请选择">
                        <el-option
                            v-for="item,index in statuses"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label style="opacity: 0;">当前状态：</label>
                    <el-button type="primary" round @click="searchBtn">检索</el-button>
                </el-col>
            </el-row>

            <div class="tableDiv">
                <el-table
                    :data="tableData"
                    stripe
                    header-align="center"
                    style="width: 100%">
                    <el-table-column prop="id" label="ID" fixed align="center"></el-table-column>
                    <el-table-column prop="nickname" label="会员昵称" align="center"></el-table-column>
                    <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
                    <el-table-column prop="role_name" label="角色类型" align="center"></el-table-column>
                    <el-table-column prop="wx_name" label="会员微信号" align="center"></el-table-column>
                    <el-table-column prop="robot_name" label="机器人微信号" align="center"></el-table-column>
                    <el-table-column prop="robot_nickname" label="机器人昵称" align="center"></el-table-column>
                    <el-table-column prop="wx_group_count" label="加入群数" align="center"></el-table-column>
                    <el-table-column prop="status_name" label="当前状态" align="center"></el-table-column>
                    <el-table-column prop="created_at" label="获取时间" align="center"></el-table-column>
                    <el-table-column prop="money" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" class="ft409EFF" @click.stop="showDetail(scope.row)">详情
                            </el-button>
                            <el-button type="text" class="ft409EFF" @click.stop="showDel(scope.row.id)">取消绑定
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


            <div class="dialogDiv">
                <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    width="640px">
                    <ul class="detailUlDiv" v-if="title=='明细'">
                        <li><label>会员昵称：</label><span>{{goodsDetailInfo.nickname}}</span></li>
                        <li><label>手机号码：</label><span>{{goodsDetailInfo.mobile}}</span></li>
                        <li><label>角色：</label><span>{{goodsDetailInfo.role_name}}</span></li>
                        <li><label>会员微信号：</label><span>{{goodsDetailInfo.robot_name}}</span></li>
                        <li><label>机器人昵称：</label><span>{{goodsDetailInfo.robot_nickname}}</span></li>
                        <li><label>加入群数：</label><span>{{goodsDetailInfo.wx_group_count}}</span></li>
                    </ul>
                    <ul class="qunUlDiv" v-if="title=='明细'">
                        <li v-for="item,index in goodsDetailInfo.wx_group_list">
                            <label>群ID：{{item.id}}</label>
                            <span>群名称：{{item.group_name}}</span>
                            <span>(入群时间：{{item.add_time}})</span>
                        </li>
                    </ul>
                    <p v-if="title=='明细'" class="statusP"><label>当前状态：</label><span class="cde0000">{{goodsDetailInfo.status_name}}</span></p>
                    <p v-else class="deleteP">
                        <img src="../../imgs/yun/icon-close.png" alt="关闭">
                        <span>删除后将无法恢复，是否确认删除？</span>
                    </p>
                    <div slot="footer" class="dialog-footer">
                        <el-button round @click="dialogVisible = false">取 消</el-button>
                        <el-button round type="primary" @click="dialogVisible = false" v-if="title=='明细'">确 定
                        </el-button>
                        <el-button round type="danger" @click="sureDel" v-else>确 定</el-button>
                    </div>
                </el-dialog>
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
    </div>
</template>

<script>
    export default {
        name: "yunIndex",
        data() {
            return {
                memberId: '',         // 会员id
                memberNick: '',         // 会员昵称
                memberTel: '',         // 会员手机号
                roleTypes: [],
                roleType: 0,         // 角色分类
                robotWechat: '',           // 机器人微信号
                robotNick: '',           // 机器人昵称
                statuses: [
                    {label: '全部', value: ''},
                    {label: '正常', value: '1'},
                    {label: '失效', value: '2'}
                ],
                status: '',

                tableData: [],
                rows: 10,
                total: 0,
                currentPage: 1,

                title: '',
                dialogVisible: false,
                goodsDetailInfo: {},             // 商品详情
                id:'',              // 取消绑定id
            }
        },
        mounted() {
            this.getRoleType()
            this.getList()
        },
        methods: {
            // 角色类型
            getRoleType() {
                this.$post('User/conf', {})
                    .then(res => {
                        this.roleTypes = res.role
                    })
            },
            // 机器人列表
            getList() {
                this.$post('Userrobot/list', {
                    uid: this.memberId,
                    nickname: this.memberNick,
                    mobile: this.memberTel,
                    role_id: this.roleType,
                    robot_name: this.robotWechat,
                    robot_nickname: this.robotNick,
                    status: this.status,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.currentPage = 1
                this.rows = val
                this.getList()
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = 1
                this.currentPage = val
                this.getList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            },
            // 点击详情显示详情弹框
            showDetail(val) {
                this.title = '明细'
                this.goodsDetailInfo = val
                this.dialogVisible = true

                console.log(val)
            },
            // 删除
            showDel(val) {
                this.title = ''
                this.id = val
                this.dialogVisible = true

            },
            // 确认删除
            sureDel() {
                this.$post('Userrobot/setCancel', {
                    id: this.id
                })
                    .then(res => {
                        this.$message.success('取消绑定成功~')
                        this.getList()
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    .yunIndex {
        padding: 80px 100px;
        .tableDiv {
            p {
                cursor: pointer;
            }
        }
        .dialogDiv {
            .detailUlDiv {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-items: flex-start;
                li {
                    width: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    margin-bottom: 10px;
                    label, span {
                        font-size: 14px;
                        color: #333;
                        padding: 4px 0;
                    }
                    span {
                        padding-left: 20px;
                    }
                }
            }
            .qunUlDiv {
                li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding: 8px 0;
                    font-size: 12px;
                    color: #666;
                    label {
                        width: 80px;
                    }
                    span {
                        width: 160px;
                        overflow: hidden;
                        -ms-text-overflow: ellipsis;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .statusP {
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .deleteP {
                img {
                    display: block;
                    margin: 0 auto 22px;
                    width: 82px;
                    height: 82px;

                }
                span {
                    display: block;
                    text-align: center;
                }
            }
            .el-button {
                width: 80px;
            }
        }

    }
</style>
