<template>
    <div class="loginCanvas">
        <canvas id="canvas" style="border: 1px solid #cccccc"></canvas>
    </div>
</template>

<script>

    export default {
        name: "loginCanvas",
        methods: {}
    }
    $(function () {
        let c = document.getElementById('canvas');
        let cxt = c.getContext('2d');
        //画布的宽高(
        let w = parseFloat($(window).width());
        let h = parseFloat($(window).height());
        c.width = w;
        c.height = h;
        //小球的个数
        let num = 200;
        //小球的信息
        let data = [];

        //x轴坐标
        let x = [];
        //(290 138) (2 , 2)
        //生成100个不同的数字
        function createNum() {
            if (x.length > num - 1) {
                return
            }
            x.push(parseInt(Math.random() * (w - 10) + 2));
            x = [... new Set(x)];
            createNum();
        }

        createNum();

        //小球的信息
        function createNews() {
            for (let i = 0; i < x.length; i++) {
                data.push({
                    x: x[i], //x轴坐标
                    y: parseInt(Math.random() * (h - 10) + 2), // y轴坐标
                    ax: Math.random() * 2 - 1, //小球x轴方向的加速度
                    ay: Math.random() * 2 - 1, //小球y轴之间的加速度
                    r: parseInt(Math.random() * 4 + 1), //小球的半径
                })
            }
        }

        createNews();

        //鼠标移动的点的位置
        data.push({
            x: 9999,
            y: 9999,
            ax: 0,
            ay: 0,
            r: 4
        })

        //判断两点之间的距离
        function dir(obj1, obj2) {
//sqrt:平方根 pow(num,2):开平方
            return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2))
        }

        //生成小球
        function createDiv() {
//清除画布
            cxt.clearRect(0, 0, w, h);
            for (let i = 0; i < data.length; i++) {
                cxt.beginPath();
                cxt.fillStyle = '#ccc';
                cxt.lineWidth = 1;
                cxt.arc(data[i].x, data[i].y, data[i].r, 0, Math.PI * 2);
                cxt.fill();
            }
//画线
            for (let i = 0; i < data.length - 1; i++) {
                for (let j = 1; j < data.length; j++) {
                    if (dir(data[i], data[j]) < 80) {
                        cxt.beginPath();
                        cxt.strokeStyle = '#ccc';
                        cxt.moveTo(data[i].x, data[i].y);
                        cxt.lineTo(data[j].x, data[j].y);
                        cxt.stroke();
                    }
                }
            }
        }

        createDiv();

        setInterval(function () {

            for (let i = 0; i < data.length; i++) {
                if (data[i].x < data[i].r || data[i].x > w - data[i].r) { //边界的判断
                    data[i].ax *= -1;
                }
                if (data[i].y < data[i].r || data[i].y > h - data[i].r) {
                    data[i].ay *= -1;
                }
                for (let j = 0; j < data.length; j++) {
                    if (i === j) {
                        continue;
                    }
//圆心之间的距离和半径的比较
                    if (dir(data[i], data[j]) <= (data[i].r + data[j].r)) {
                        data[i].ax *= -1;
                        data[i].ay *= -1;
                    }
                }
                data[i].x += data[i].ax;
                data[i].y += data[i].ay;
            }
            createDiv();
        }, 20);
        // 生成鼠标移动的点的位置
        $(document).mousemove(function (e) {
// 鼠标点的位置
            let x = e.clientX;
            let y = e.clientY;
            data[data.length - 1].x = x;
            data[data.length - 1].y = y;
        })
    })

</script>

<style scoped>

</style>
