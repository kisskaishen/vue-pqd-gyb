<template>
    <div class="recommend">

    </div>
</template>

<script>
    export default {
        name: "recommend",
        data() {
            return {


            }
        },
        mounted() {
            this.getList()
        },
        methods: {


            // 审核时间
            checkUpdateDate(val) {
                this.checkTimeRangeFormat = val.join('/')
            },

        }
    }
</script>

<style scoped lang="scss">
    .fundCash {
        margin-top: 40px;
    }
</style>
