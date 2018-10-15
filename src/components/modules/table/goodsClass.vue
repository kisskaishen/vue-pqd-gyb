<template>
    <div class="table">
        <el-table
            :data="tableData"
            stripe
            header-align="center"
            highlight-current-row
            style="width: 100%">
            <el-table-column prop="cat_name" label="品类" align="center"></el-table-column>
            <el-table-column prop="is_show" label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.is_show=='1'?'显示':'不显示'}}
                </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="text" @click="isShowGoods(scope)">{{scope.row.is_show=='0'?'显示':'隐藏'}}</el-button>
                    <el-button type="text" @click="editGoods(scope)">修改</el-button>
                    <el-button type="text" @click="deleteGoods(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pageDiv">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "goodsClass",
        props: ['tableInfo'],
        data() {
            return {
                currentPage: 1,            // 页数
            }
        },
        mounted() {
        },
        computed: {
            tableData() {
                return this.tableInfo.list
            },
            total() {
                return this.tableInfo.total
            }
        },
        methods: {
            // 切换每一页显示条数
            handleSizeChange(val) {
                this.$emit('listenChangeSize', val)
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.$emit('listenChangePage', val)
            },
            // 隐藏/显示
            isShowGoods(val) {
                this.$post('GoodsCategory/changeField', {
                    cat_id: val.row.cat_id,
                    field: 'is_show',
                    value: val.row.is_show == '0' ? '1' : '0',
                })
                    .then(res => {
                        this.$message.success(val.row.is_show=='0'?'显示成功':'隐藏成功')
                        this.$emit('listenAgain',1)
                    })
            },
            // 修改商品类目
            editGoods(val) {
                this.$emit('listenShowDialog', val.row)
            },
            // 删除商品类目
            deleteGoods(val) {
                this.$emit('listenDelete', val)
            }
        }
    }
</script>

<style scoped lang="scss">
    .table {
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
    }
</style>
