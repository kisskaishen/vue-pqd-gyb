<template>
    <div class="yunIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>商品ID：</label>
                    <el-input v-model="goodsId" placeholder="请输入商品ID"></el-input>
                </el-col>
                <el-col>
                    <label>商品名称：</label>
                    <el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
                </el-col>
                <el-col>
                    <label>所属类目：</label>
                    <el-select v-model="categorye" placeholder="请选择">
                        <el-option
                            v-for="item,index in categoryes"
                            :label="item.cat_name"
                            :key="item.cat_id"
                            :value="item.cat_id"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>推荐时间：</label>
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
                <el-col>
                    <label>平台类型：</label>
                    <el-select v-model="platformType" placeholder="请选择">
                        <el-option
                            v-for="item,index in platformTypes"
                            :label="item.platform_name"
                            :key="item.platform_id"
                            :value="item.platform_id"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>状态：</label>
                    <el-select v-model="status" placeholder="请选择">
                        <el-option
                            v-for="item,index in statuses"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row class="tipsBtn">
                <el-button type="primary" round plain @click="searchBtn">检索</el-button>
                <el-button type="primary" round @click="addYun">新增</el-button>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="待推荐/推荐中" name="4">
                    <div class="tableDiv">
                        <el-table
                            :data="tableData"
                            stripe
                            header-align="center"
                            style="width: 100%">
                            <el-table-column prop="goods_id" label="ID" fixed align="center"></el-table-column>
                            <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
                            <el-table-column prop="cat_name" label="所属类目" align="center"></el-table-column>
                            <el-table-column prop="platform_name" label="平台类型" align="center"></el-table-column>
                            <el-table-column prop="view_time" label="推荐时间" align="center">

                            </el-table-column>
                            <el-table-column prop="select_type_name" label="状态" align="center"></el-table-column>
                            <el-table-column prop="sort" label="排序" align="center">
                                <template slot-scope="scope">
                                    <p class="ft409EFF" @click.stop="topClick(scope)">置顶</p>
                                    <p class="ft67c23a" @click.stop="upClick(scope)">上移</p>
                                    <p class="fte6a23c" @click.stop="downClick(scope)">下移</p>
                                    <p class="ftf56c6c" @click.stop="bottomClick(scope)">置底</p>
                                </template>
                            </el-table-column>
                            <el-table-column prop="money" label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" class="ft409EFF" @click.stop="showDetail(scope.row.id)">详情
                                    </el-button>
                                    <el-button type="text" class="ft409EFF" @click.stop="showDel(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已过期" name="3">
                    <div class="tableDiv">
                        <el-table
                            :data="tableData"
                            stripe
                            header-align="center"
                            style="width: 100%">
                            <el-table-column prop="goods_id" label="ID" fixed align="center"></el-table-column>
                            <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
                            <el-table-column prop="cat_name" label="所属类目" align="center"></el-table-column>
                            <el-table-column prop="platform_name" label="平台类型" align="center"></el-table-column>
                            <el-table-column prop="view_time" label="推荐时间" align="center">

                            </el-table-column>
                            <el-table-column prop="select_type_name" label="状态" align="center"></el-table-column>
                            <el-table-column prop="select_type_name" label="排序" align="center">
                                <template slot-scope="scope">
                                    <p class="ft409EFF" @click.stop="topClick(scope)">置顶</p>
                                    <p class="ft67c23a" @click.stop="upClick(scope)">上移</p>
                                    <p class="fte6a23c" @click.stop="downClick(scope)">下移</p>
                                    <p class="ftf56c6c" @click.stop="bottomClick(scope)">置底</p>
                                </template>
                            </el-table-column>
                            <el-table-column prop="select_type_name" label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" class="ft409EFF" @click="showDetail(scope.row.id)">详情
                                    </el-button>
                                    <el-button type="text" class="ft409EFF" @click="showDel(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div class="dialogDiv">
                <el-dialog
                    :title="title"
                    :visible.sync="dialogVisible"
                    width="30%">
                    <ul class="detailUlDiv" v-if="title=='明细'">
                        <li><label>商品ID：</label><span>{{goodsDetailInfo.goods_id}}</span></li>
                        <li><label>所属类目：</label><span>{{goodsDetailInfo.cat_name}}</span></li>
                        <li><label>商品名称：</label><span>{{goodsDetailInfo.goods_name}}</span></li>
                        <li><label>推荐时间：</label>
                            <span v-for="item,index in goodsDetailInfo.view_times">
                                <span>{{item.time_label}}</span>
                                <span class="cde0000">({{item.type_name}})</span>

                            </span>
                        </li>
                    </ul>
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
                goodsId: '',         // 商品id
                goodsName: '',         // 商品名称
                categoryes: [],
                categorye: '',         // 所属分类
                timeRange: '',           // 推荐时间
                timeRangeFormat: '',           // 推荐时间格式化
                platformTypes: [],
                platformType: '1',                // 所属平台
                statuses: [
                    {label: '全部', value: '4'},
                    {label: '推荐中', value: '1'},
                    {label: '待推荐', value: '2'}
                ],
                status: '4',
                activeName: '4',

                tableData: [],
                rows: 10,
                total: 0,
                currentPage: 1,

                title: '',
                dialogVisible: false,
                goodsDetailInfo: {},             // 商品详情
                id: '',                 // 取消绑定id
            }
        },
        mounted() {
            this.getPlatform()
            this.getCategory()
            this.getList()
        },
        methods: {
            // 平台列表
            getPlatform() {
                this.$post('Platform/list', {})
                    .then(res => {
                        this.platformTypes = res
                    })
            },
            // 所属类目
            getCategory() {
                this.$post('GoodsCategory/list', {
                    platform_id: this.platformType
                })
                    .then(res => {
                        this.categoryes = res.list
                    })
            },
            // 推荐时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 切换
            handleClick(tab, event) {
                this.status = tab.name
                this.rows = 10
                this.total = 0
                this.currentPage = 1
                this.goodsId = ''
                this.goodsName = ''
                this.categorye = ''
                this.timeRangeFormat = ''
                this.platformType = '1'
                this.getList()
                if (tab.name == '3') {
                    this.statuses = [
                        {label: '全部', value: '3'},
                        {label: '已过期', value: '3'}
                    ]
                    this.status = '3'
                } else if (tab.name == '4') {
                    this.statuses = [
                        {label: '全部', value: '4'},
                        {label: '推荐中', value: '1'},
                        {label: '待推荐', value: '2'}
                    ]
                    this.status = '4'
                }
            },
            // 爆款推荐商品列表
            getList() {
                this.$post('Goodshotpromotion/goodslist', {
                    goods_id: this.goodsId,
                    goods_name: this.goodsName,
                    cat_id: this.categorye,
                    time: this.timeRangeFormat,
                    platform_id: this.platformType,
                    select_type: this.status,
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
            // 新增爆款页面
            addYun() {
                this.$router.push('addYun')
            },
            // 置顶
            topClick(val) {
                this.sortChange(val.row.id, val.row.index, '1')
            },
            // 上移
            upClick(val) {
                this.sortChange(val.row.id, val.row.index, '3')
            },
            // 下移
            downClick(val) {
                this.sortChange(val.row.id, val.row.index, '4')
            },
            // 置底
            bottomClick(val) {
                this.sortChange(val.row.id, val.row.index, '2')
            },
            sortChange(id, index, where) {
                this.$post('Goodshotpromotion/setsortflag', {
                    id: id,
                    index: index,
                    sort_flag: where
                })
                    .then(res => {
                        this.$message.success('操作成功~')
                        this.getList()
                    })
            },
            // 点击详情显示详情弹框
            showDetail(val) {
                this.title = '明细'
                this.goodsDetail(val)
            },
            // 商品详情
            goodsDetail(id) {
                this.$post('Goodshotpromotion/detail', {
                    id: id
                })
                    .then(res => {
                        this.goodsDetailInfo = res
                        this.dialogVisible = true
                    })
            },
            // 删除
            showDel(val) {
                this.id = val
                this.title = ''
                this.dialogVisible = true

            },
            // 确认删除
            sureDel() {
                this.$post('Goodshotpromotion/delGoods', {
                    id: this.id
                })
                    .then(res => {
                        this.$message.success('删除成功~')
                        this.dialogVisible = false
                        this.getList()
                    })
            }
        },
        watch: {
            activeName(val) {
                console.log(val)
            },
            $route(to, from) {
                if (to.fullPath == '/yun/index') {
                    this.getList()
                }
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
                border-bottom: 1px solid #eee;
                li {
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
