<template>
    <div class="addYun">
        <p class="title c5B86FF"><b></b>新增爆款</p>
        <p>
            <label>设置推广时间：</label>
            <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="updateDate">
            </el-date-picker>
        </p>
        <p>
            <label>选择商品：</label>
            <el-button type="primary" round :disabled="isTimeRange" @click="chooseGoods">选择</el-button>
            <span style="font-size: 12px;color: #999;margin-left: 20px" v-if="isTimeRange">(请先设置推广时间)</span>
        </p>
        <div class="tableDiv">
            <label>已选择商品列表：</label>
            <el-table
                :data="chooseTableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="goods_id" label="ID" fixed align="center"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="cat_name" label="所属类目" align="center"></el-table-column>
                <el-table-column prop="platform_name" label="平台类型" align="center"></el-table-column>
                <el-table-column prop="money" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" class="ft409EFF" @click.stop="showDel(scope)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="btn">
            <el-button type="primary" round @click="sureAdd">确定添加</el-button>
            <el-button type="primary" round plain @click="clearData">清空列表</el-button>
        </div>
        <div class="dialogDiv">
            <el-dialog
                title="商品列表"
                :visible.sync="dialogVisible"
                width="800px">
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
                            <label style="opacity: 0;">平台类型：</label>
                            <el-button plain>检索</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="tableDiv">
                    <el-table
                        :data="tableData"
                        ref="multipleTable"
                        stripe
                        header-align="center"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="goods_id" label="ID" fixed align="center"></el-table-column>
                        <el-table-column prop="goods_name" label="商品名称" align="center">
                            <template slot-scope="scope">
                                <p>{{scope.row.goods_name}}</p>
                                <b v-if="scope.row.time_conflict=='1'" class="ftFE0000">该商品推荐已包含该时间段</b>
                                <p v-if="scope.row.is_select=='1'" class="ftFE0000">已选择</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cat_name" label="所属类目" align="center"></el-table-column>
                        <el-table-column prop="platform_name" label="平台类型" align="center"></el-table-column>
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
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "addYun",
        data() {
            return {
                timeRange: '',
                timeRangeFormat: '',
                isTimeRange: true,
                chooseTableData: [],
                dialogVisible: false,

                goodsName:'',
                goodsId:'',
                categoryes: [],
                categorye: '',
                platformTypes: [],
                platformType: '1',
                tableData: [],
                rows: 50,
                total: 0,
                currentPage: 1,
            }
        },
        mounted() {
            this.getPlatform()
            this.getCategory()
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
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
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
            // 点击选择
            chooseGoods() {
                this.dialogVisible = true
                this.getList()
            },
            // 商品列表
            getList() {
                this.$post('Goodshotpromotion/getSelectGoodsList', {
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
            // 选择
            handleSelectionChange(val) {
                let filterData = []
                let chooseTable = []
                chooseTable = val
                for (let i=0;i<chooseTable.length;i++) {
                    if (chooseTable[i].time_conflict=='1') {
                        filterData.push(chooseTable[i])
                        this.$message.error('您选择的商品已包含该时间段，已自动为您过滤该类商品')
                        chooseTable.splice(i,1)
                    }
                    this.chooseTableData = chooseTable
                }
                filterData.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            },
            // 确认添加
            sureAdd() {
                this.$post('Goodshotpromotion/add',{
                    time:this.timeRangeFormat,
                    goods_list:JSON.stringify(this.chooseTableData)
                })
                    .then(res=>{
                        this.$message.success('添加成功')
                        this.$router.push('/yun/index')
                        this.chooseTableData = []
                        this.timeRange = ''
                    })
            },
            // 清空列表
            clearData() {
                this.chooseTableData = []
            },
            // 删除商品
            showDel(val) {
                this.$message.success('删除成功')
                this.chooseTableData.splice(val.$index,1)
            }
        },
        watch: {
            timeRange(val) {
                if (val) {
                    this.isTimeRange = false
                } else {
                    this.isTimeRange = true
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .addYun {
        padding: 80px 100px;
        p {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 10px 0;
            label {
                font-size: 14px;
                color: #333;
                width: 120px;
            }
            .el-button {
                width: 120px;
                height: 30px;
            }
        }
        .title {
            b {
                display: block;
                width: 2px;
                height: 18px;
                margin-right: 10px;
                background-color: #5B86FF;;
            }
        }
        > .tableDiv {
            padding: 10px 0;
            label {
                display: block;
                font-size: 14px;
                color: #333;
                width: 120px;
                margin-bottom: 10px;
            }
        }
        .btn {
            .el-button {
                width: 120px;
            }
        }
        .dialogDiv {
            .searchDiv {
                .el-row {
                    margin-bottom: 20px;
                }
            }
        }
    }
</style>
