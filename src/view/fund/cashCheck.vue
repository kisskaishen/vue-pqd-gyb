<template>
    <div class="fundCashCheck">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="申请中" name="1">
                <fund-cashing :index="activeName"></fund-cashing>
            </el-tab-pane>
            <el-tab-pane label="提现成功" name="2">
                <fund-cashed :index="activeName"></fund-cashed>
            </el-tab-pane>
            <el-tab-pane label="拒绝提现" name="3">
                <reject-cash :index="activeName"></reject-cash>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import fundCashing from '../../components/modules/fund/fundCashing'
    import fundCashed from '../../components/modules/fund/fundCashed'
    import RejectCash from '../../components/modules/fund/rejectCash'

    export default {
        name: "cashCheck",
        data() {
            return {
                activeName: '1'
            }
        },
        components: {fundCashing, fundCashed, RejectCash},
        methods: {
            handleClick(val) {
                this.activeName = val.name
            }
        }
    }
</script>

<style scoped lang="scss">
    .fundCashCheck {
        padding: 80px 100px;
    }
</style>
