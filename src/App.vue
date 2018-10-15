<template>
    <div id="app">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>
<style lang="scss">
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css"; /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
    .content {
        .searchDiv {
            .el-row {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 40px;
                .el-col {
                    width: 200px;
                    margin-right: 6%;
                    &:nth-child(4) {
                        margin-right: 0;
                    }
                    .el-select, .el-input {
                        width: 200px;
                    }
                    > label {
                        display: block;
                        line-height: 12px;
                        color: #999;
                        font-size: 12px;
                        margin-bottom: 14px;
                    }
                    .el-button {
                        width: 120px;
                    }
                }
                > .el-button {
                    width: 120px;
                    margin-right: 60px;
                }
            }
            .tipsBtn {
                margin: 0;
                margin-bottom: 20px;
            }
            .tipsRow {
                margin-top: 20px;
            }
        }
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
    }
</style>
