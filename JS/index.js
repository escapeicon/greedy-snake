//index->javascript
let score = 0; //分数
let level = 0; //等级
let speed = 200; //速度
let lastDirection = ""; // 存储上一次按钮的方向
let times = 0; //操作标志位
let dirX = true; //X轴方向
let dirY = true; //Y轴方向
//最高分
let maxPerson = {
    name: "张三",
    score: 0,
    level: 0,
};

let timer; //计时器

//蛇的位置
let snakeLeft = 150;
let snakeTop = 150;

//视口宽度
let screen = document.getElementsByClassName("activeArea")[0].offsetWidth;

let numTop; //食物上随机数
let numLeft; //食物左随机数

resetGame(); //重置游戏

//判断是否为当前用户
// if (!localStorage.getItem("name")) {
//     signUp();
// }

//随机食物位置
function randomFood() {
    numTop = Math.round(Math.random() * (Math.floor(screen / 10) - 1)) * 10; //食物上随机数
    numLeft = Math.round(Math.random() * (Math.floor(screen / 10) - 1)) * 10; //食物左随机数
    if (!isClashSelf(numTop, numLeft)) {
        $(".food").css("top", numTop);
        $(".food").css("left", numLeft);
        return;
    }
    randomFood();
}

//蛇的移动

/**按键移动 */
document.addEventListener("keyup", function (ev) {
    times += 1; //按一次键加一
    if ((ev.key === "w" || ev.key === "ArrowUp") && times === 1 && dirX) {
        //上键
        turnBack("w");
        snakeDir("w");
    } else if (
        (ev.key === "s" || ev.key === "ArrowDown") &&
        times === 1 &&
        dirX
    ) {
        //下键
        turnBack("s");
        snakeDir("s");
    } else if (
        (ev.key === "d" || ev.key === "ArrowRight") &&
        times === 1 &&
        dirY
    ) {
        //右键
        turnBack("d");
        snakeDir("d");
    } else if (
        (ev.key === "a" || ev.key === "ArrowLeft") &&
        times === 1 &&
        dirY
    ) {
        //左键
        turnBack("a");
        snakeDir("a");
    }
});

//禁止掉头方法
function turnBack(dir) {
    if ($(".snake li").length > 1) {
        if ("ws".includes(dir)) {
            dirX = false;
            dirY = true;
        } else {
            dirX = true;
            dirY = false;
        }
    }
}

/**按钮移动 */
$(".buttonArea button").each(function () {
    $(this).click(function () {
        times += 1; // 按一次键加一

        if (times === 1) {
            const currentDirection = $(this).attr("id"); // 当前按钮的方向

            // 判断当前按钮方向与上一次按钮方向是否相反
            if (
                (currentDirection === "up" && lastDirection === "down") ||
                (currentDirection === "down" && lastDirection === "up") ||
                (currentDirection === "left" && lastDirection === "right") ||
                (currentDirection === "right" && lastDirection === "left")
            ) {
                // 方向相反，不执行相应操作
                return;
            }

            snakeDir(currentDirection);
            lastDirection = currentDirection; // 更新上一次按钮方向
        }
    });
});

/**
 * 蛇的运动，通过计时器实现
 */
function snakeDir(dir) {
    clearTimeout(timer);
    timer = setTimeout(function fn() {
        times = 0; //判断上次操作是否进入事件循环
        if (dir === "w" || dir === "up") {
            snakeTop -= 10;
        }
        if (dir === "s" || dir === "down") {
            snakeTop += 10;
        }
        if (dir === "a" || dir === "left") {
            snakeLeft -= 10;
        }
        if (dir === "d" || dir === "right") {
            snakeLeft += 10;
        }

        lastDirection = dir;

        //判定是否触碰到食物
        if (snakeLeft === numLeft && snakeTop === numTop) {
            addSnake();
            randomFood();
            score++;
            $("#score p").text("分数" + score);

            if (!parseInt(score % 5)) {
                //每的五分加一级
                level++;
                $("#level p").text("等级" + level);

                if (speed > 60) {
                    speed -= 20;
                }
            }
        }
        //移动最后一个li的位置&&将第一个li位置挪到下一步
        $(".snake").append($(".snake li:first"));
        $(".snake li:first").css("top", snakeTop);
        $(".snake li:first").css("left", snakeLeft);

        //判断是否撞墙
        if (
            snakeLeft >= screen ||
            snakeTop >= screen ||
            snakeLeft < 0 ||
            snakeTop < 0
        ) {
            death();
            return;
        }

        //判断是否撞自己
        if ($(".snake li").length > 4) {
            if (isClashSelf(snakeTop, snakeLeft)) {
                death();
                return;
            }
        }

        timer = setTimeout(fn, speed);
    }, speed);
}

/**
 *
 * @param {*} top
 * @param {*} left
 * @returns 布尔值 判断是否给定值与蛇的身体重合
 */
function isClashSelf(top, left) {
    let flag = false;
    $(".snake li:not(:first)").each(function () {
        if (top === this.offsetTop && left === this.offsetLeft) {
            flag = true;
        }
    });
    return flag;
}

/**
 * 添加蛇的身体
 */
function addSnake() {
    // 获取蛇尾的位置
    let tailTop = $(".snake li:last").css("top");
    let tailLeft = $(".snake li:last").css("left");

    // 添加新的li元素到蛇尾位置
    $(".snake").append($("<li>"));
    $(".snake li:last").css("top", tailTop);
    $(".snake li:last").css("left", tailLeft);
}

/**
 * 重置蛇的身体位置
 */
function resetSnake() {
    $(".snake li:not(:first)").remove();
    snakeLeft = 150;
    snakeTop = 150;
    $(".snake li").css("top", snakeTop);
    $(".snake li").css("left", snakeLeft);
}

//点击调用暂停功能
$("#pause").click(pauseFun);
//点击调用继续功能
$("#startGame").click(continueFun);

//暂停功能
function pauseFun() {
    $(".pauseArea").css("display", "grid"); //调出暂停界面
    $(".img img").css("visibility", "visible"); //显示图片
    $("#stateDisplay").css("visibility", "hidden"); //隐藏游戏状态
    setDisplay(score, level); //重置暂停界面分数
    clearTimeout(timer); //停止蛇的移动
}

//继续功能
function continueFun() {
    $(".pauseArea").css("display", "none"); //关闭暂停界面
    snakeDir(lastDirection); //开始蛇的移动
}

//重启按钮
$("#continue").click(function () {
    lastDirection = ""; //重置上一次的按键
    $(".pauseArea").css("display", "none"); //关闭暂停界面
    $("#startGame").attr("disabled", false); //关闭禁用按钮
    resetGame(); //重置游戏数据
});

//重置暂停界面的分数展示
function setDisplay(score, level) {
    $("#scoreRes").text("分数:" + score);
    $("#levelRes").text("等级:" + level);
}

//蛇死亡
function death() {
    setDisplay(score, level); //重置分数等级
    clearTimeout(timer); //关闭蛇的移动
    $(".pauseArea").css("display", "grid"); //调出暂停界面
    $("#stateDisplay").css("visibility", "visible"); //调出状态
    $(".img img").css("visibility", "hidden"); //显示图片//关闭图像展示
    $("#startGame").attr("disabled", true); //禁用继续按钮
    isMax(score, level); //比较分数
}

//重置游戏
function resetGame() {
    randomFood(); //重置食物位置
    resetSnake(); //重置蛇长度
    lastDirection = ""; //重置上一次按键
    setMaxPerson(); //设置最高用户排名
    $("#stateDisplay").css("visibility", "visible"); //显示游戏状态文字
    speed = 200; //重置速度为200
    score = 0; //重置分数
    level = 0; //重置等级
    setDisplay(score, level); //重置暂停面板的分数等级显示
    $("#score p").text("分数" + score); //重置游戏界面分数
    $("#level p").text("等级" + level); //重置游戏界面等级
    clearTimeout(timer); //停止蛇的移动
    dirX = true; //重置防掉头的标志位
    dirY = true; //重置防掉头的标志位
}

//重启游戏
function reGame() {
    setDisplay(score, level); //设置本局游戏分数和等级
    $(".pauseArea").css("display", "grid"); //打开暂停界面
    resetGame();
}

//拟注册
function signUp() {
    let name = prompt("清填写昵称"); //获取昵称
    localStorage.setItem("name", name); //给本地存储用户
}

//判断最高分
function isMax(score, level) {
    let preScore = maxPerson.score; //添加之前的用户分数
    if (score > preScore) {
        maxPerson.name = maxPerson = {
            name: localStorage.getItem("name"),
            score,
            level,
        };
    }
    setMaxPerson();
}

//设置排名最高的用户
function setMaxPerson() {
    $("#name").text("昵称：" + maxPerson.name);
    $("#maxScore").text("最高分数：" + maxPerson.score);
    $("#maxLevel").text("最高等级：" + maxPerson.level);
}

//暂停继续事件
$(document).keydown(function (ev) {
    if (ev.which === 32) {
        pauseFun();
    } else if (ev.which === 27) {
        continueFun();
    }
});
