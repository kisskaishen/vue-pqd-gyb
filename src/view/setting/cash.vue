<template>
    <div class="settingCash">
        <p class="ft409EFF ft16 title">佣金设置</p>
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <p>会员：</p>
                </el-col>
                <el-col>
                    <label>手续费：</label>
                    <el-input v-model="info.member" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p>运营总监：</p>
                </el-col>
                <el-col>
                    <label>手续费：</label>
                    <el-input v-model="info.director" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <label style="opacity: 0">1</label>
                    <el-button type="primary" round @click="saveSetting">确定</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cash",
        data() {
            return {
                info: {},
            }
        },
        mounted() {
            this.getSetting()
        },
        methods: {
            getSetting() {
                this.$post('Commission/cashSet', {})
                    .then(res => {
                        this.info = res.info
                    })
            },
            saveSetting() {
                this.$post('Commission/cashSet', {
                    member_cost: this.info.member,
                    director_cost: this.info.director
                })
                    .then(res => {
                        this.$message.success('设置成功')
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    .settingCash {
        padding: 80px 100px;
        .title {
            height: 16px;
            line-height: 16px;
            padding-left: 10px;
            border-left: 2px solid #409EFF;
        }
        .searchDiv {
            margin-top: 36px;
            margin-bottom: 60px;
            .el-row {
                align-items: flex-end;
                margin-bottom: 20px;
                .el-col {
                    margin-right: 0;
                    p {
                        font-size: 14px;
                        color: #333;
                        width: 200px;
                        margin-bottom: 8px;
                    }
                    .to-right {
                        display: block;
                        margin: 0 auto 12px;
                        width: 14px;
                        height: 12px;
                        background: url("../../imgs/icon-to-right.png") no-repeat center /100%;
                    }
                    .ft12 {
                        display: block;
                        margin-left: 10px;
                        margin-bottom: 8px;
                    }
                }
                .toRight {
                    width: 120px;
                }
            }
        }
    }

</style>
