<template>
    <div class="settingCommission">
        <p class="ft409EFF ft16 title">佣金设置</p>
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <p>佣金比例：</p>
                </el-col>
                <el-col>
                    <label>会员等级：</label>
                    <el-input v-model="memberInfo.commission" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col class="toRight"><i class="to-right"></i></el-col>
                <el-col>
                    <label>运营总监等级：</label>
                    <el-input v-model="directorInfo.commission" placeholder="运营总监等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col><span class="ft12 ftccc">注：基数按平台接入佣金计算</span></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p>下级会员奖励：</p>
                </el-col>
                <el-col>
                    <label>会员等级：</label>
                    <el-input v-model="memberInfo.direct_commission" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col class="toRight"><i class="to-right"></i></el-col>
                <el-col>
                    <label>运营总监等级：</label>
                    <el-input v-model="directorInfo.direct_commission" placeholder="运营总监等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col><span class="ft12 ftccc">注：基数按终端用户实得佣金计算</span></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <p>间接会员奖励：</p>
                </el-col>
                <el-col>
                    <label>会员等级：</label>
                    <el-input v-model="memberInfo.indirect_commission" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col class="toRight"><i class="to-right"></i></el-col>
                <el-col>
                    <label>运营总监等级：</label>
                    <el-input v-model="directorInfo.indirect_commission" placeholder="运营总监等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col><span class="ft12 ftccc">注：基数按终端用户实得佣金计算</span></el-col>

            </el-row>
            <el-row>
                <el-col>
                    <p>直属运营总监团队奖励：</p>
                </el-col>
                <el-col>
                    <label style="opacity: 0">1</label>
                    <el-input v-model="directorInfo.team_commission" placeholder="会员等级"></el-input>
                </el-col>
                <el-col style="width: 40px"><span class="ft12 ft666">%</span></el-col>
                <el-col><span class="ft12 ftccc">注：基数按终端用户实得佣金计算</span></el-col>
            </el-row>
            <el-row>
                <el-col>
                    <label style="opacity: 0">1</label>
                    <el-button type="primary" round @click="saveSetting">确定</el-button>
                </el-col>
            </el-row>
        </div>
        <hr>
        <p class="ft409EFF ft16 title">分佣示例表</p>
        <p class="ft333 ft14 tips">例：第三方佣金10.00元</p>
        <div class="tableDiv">
            <ul>
                <li class="thead">
                    <p>会员分佣：</p>
                    <p>运营总监分佣：</p>
                </li>
                <li>
                    <p class="ft12 ft999">
                        <span>会员分佣</span>
                        <span class="ft409EFF">2.5</span>
                        <span>元</span>
                    </p>
                    <p class="ft12 ft999">
                        <span>会员分佣</span>
                        <span class="ft409EFF">5</span>
                        <span>元</span>
                    </p>
                </li>
                <li>
                    <p class="ft12 ft999">
                        <span>下级会员奖励</span>
                        <span class="ft409EFF">0.5</span>
                        <span>元</span>
                    </p>
                    <p class="ft12 ft999">
                        <span>下级会员奖励</span>
                        <span class="ft409EFF">2.5</span>
                        <span>元</span>
                    </p>
                </li>
                <li>
                    <p class="ft12 ft999">
                        <span>平台赚得佣金</span>
                        <span class="ft409EFF">7.5</span>
                        <span>元</span>
                    </p>
                    <p class="ft12 ft999">
                        <span>间接会员奖励</span>
                        <span class="ft409EFF">1.5</span>
                        <span>元</span>
                    </p>
                </li>
                <li>
                    <p class="ft12 ft999">
                    </p>
                    <p class="ft12 ft999">
                        <span>直属运营总监团队奖励</span>
                        <span class="ft409EFF">0.3</span>
                        <span>元</span>
                    </p>
                </li>
                <li>
                    <p class="ft12 ft999">
                    </p>
                    <p class="ft12 ft999">
                        <span>平台赚得佣金</span>
                        <span class="ft409EFF">0.7</span>
                        <span>元</span>
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "commission",
        data() {
            return {
                memberInfo: {},              // 会员对象
                directorInfo: {},            // 总监对象
                mem: [],                     // 会员传过去的数组
                dire: [],                    // 总监传过去的数组
            }
        },
        mounted() {
            this.getSetting()
        },
        methods: {
            getSetting() {
                this.$post('Commission/editSave', {})
                    .then(res => {
                        this.memberInfo = res.member
                        this.directorInfo = res.director
                    })
            },
            saveSetting() {
                this.mem['commission'] = this.memberInfo.commission
                this.mem['direct'] = this.memberInfo.direct_commission
                this.mem['indirect'] = this.memberInfo.indirect_commission

                this.dire['commission'] = this.directorInfo.commission
                this.dire['direct'] = this.directorInfo.direct_commission
                this.dire['indirect'] = this.directorInfo.indirect_commission
                this.dire['team'] = this.directorInfo.team_commission

                this.$post('Commission/editSave', {
                    mem: this.mem,
                    dire: this.dire
                })
                    .then(res => {
                        this.$message.success('设置成功')
                    })
            }
        }
    }
</script>

<style scoped lang="scss">
    .settingCommission {
        padding: 40px 100px;
        .title {
            margin-top: 40px;
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
        hr {
            height: 10px;
            background-color: #F0F3FA;
            border: none;
        }
        > .tips {
            margin: 40px 0 30px;
        }
        .tableDiv {
            ul {
                li {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    p {
                        width: 160px;
                        margin-right: 200px;
                        line-height: 14px;
                        margin-bottom: 20px;
                    }
                }
                .thead {
                    p {
                        font-size: 14px;
                    }
                }

            }
        }
    }
</style>
