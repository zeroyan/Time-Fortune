/**
 * Created by zeroyan on 2018/7/12.
 */
/*
 棋盘格局
 -1 -> 空
 0-19 -> 20个格子
 */
var MAPDATA = [
    [10, 11, 12, 13, 14, 15],
    [9, -1, -1, -1, -1, 16],
    [8, -1, -1, -1, -1, 17],
    [7, -1, -1, -1, -1, 18],
    [6, -1, -1, -1, -1, 19],
    [5, 4, 3, 2, 1, 0]
];

var SCALE = 1.3;
var MAP_WIDTH = 680;
var MAP_HEIGHT = 680;
var MAP_OFFSETX = 305;
var MAP_OFFSETY = 50;
var GRID_WIDTH = 100;
var GRID_HEIGHT = 100;

function Map() {}
/*
 棋盘初始化
 */
Map.prototype.init = function (){
    //console.log("map init", imageCache);
    this.imageCache = imageCache;
    this.mapDataArray = MAPDATA;
    this._scale = SCALE;
    this.offsetX = MAP_OFFSETX;
    this.offsetY = MAP_OFFSETY;

    //this.image = image;
    this.widthNum = this.mapDataArray[0].length;//地图宽的元素数量
    this.heightNum = this.mapDataArray.length;//地图高的元素数量

    this.width = MAP_WIDTH;//绘制的地图宽度
    this.height = MAP_HEIGHT;//绘制的地图高度

    this.sw = GRID_WIDTH;//绘制出的图像宽度
    this.sh = GRID_HEIGHT;//绘制出的图像高度


    // 创建canvas
    this.canvas = document.getElementById("game_map");
    // 取得2d绘图上下文
    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    //this.color='#000000';

    var gridArray = [];
    var eventArray = new Array(25);
    //console.log(eventArray.length)
    for (var e_i=0; e_i<eventArray.length; e_i++){
        eventArray[e_i] = e_i+1;
    }
    shuffle(eventArray);
    this.eventArray = eventArray;
    //console.log(this.eventArray)


    var dw = this.sw * this._scale;//绘制出的图像宽度
    var dh = this.sh * this._scale;//绘制出的图像高度

    // 棋盘位置微调
    for (var i = 0; i < this.heightNum; i++) {
        var tempArray = [];
        for (var j = 0; j < this.widthNum; j++) {
            var flag = this.mapDataArray[i][j];
            var this_dx, this_dy, this_dw, this_dh;
            var this_dx_square = 0, this_dy_square = 0;
            if(flag == 10){
                this_dx = j * dw;
                this_dy = i * dh;
                this_dw = dw;
                this_dh = dh;
                this_dx_square = this_dx + 40;
                this_dy_square = this_dy + 45;
            } else if(10 < flag && flag < 15){
                this_dx = dw + (j-1) * dw * 0.8;
                this_dy = i * dh;
                this_dw = dw * 0.8;
                this_dh = dh;
                this_dx_square = this_dx + 5;
                this_dy_square = this_dy + 45;
                //console.log(flag, i, j, this_dx, this_dy, this_dw, this_dh)
                //tempArray[j] = new Grid(flag, i, j, this_dx, this_dy, this_dw, this_dh, this.context, this.imageCache);
            } else if (flag == 15){
                this_dx = dw + (j-1) * dw * 0.8;
                this_dy = i * dh;
                this_dw = dw;
                this_dh = dh;
                this_dx_square = this_dx + 5;
                this_dy_square = this_dy + 45;
                //tempArray[j] = new Grid(flag, i, j, this_dx, this_dy, this_dw, this_dh, this.context, this.imageCache);
            } else if (15 < flag && flag < 20){
                this_dx = dw + (j-1) * dw * 0.8;
                this_dy = dh + (i-1) * dh * 0.74;
                this_dw = dw;
                this_dh = dh * 0.74;
                this_dx_square = this_dx + 5;
                this_dy_square = this_dy + 15;
                //console.log(flag, i, j, this_dx, this_dy, this_dw, this_dh)
                //tempArray[j] = new Grid(flag, i, j, this_dx, this_dy, this_dw, this_dh, this.context, this.imageCache);
            } else if (flag == 0){
                this_dx = dw + (j-1) * dw * 0.8;
                this_dy = dh + (i-1) * dh * 0.74;
                this_dw = dw;
                this_dh = dh;
                this_dx_square = this_dx + 5;
                this_dy_square = this_dy + 15;
            } else if (0 < flag && flag < 5){
                this_dx = dw + (j-1) * dw * 0.8;
                this_dy = dh + (i-1) * dh * 0.74;
                this_dw = dw * 0.8;
                this_dh = dh;
                this_dx_square = this_dx + 5;
                this_dy_square = this_dy + 15;
            } else if (flag == 5) {
                this_dx = j * dw;
                this_dy = dh + (i-1) * dh * 0.74;
                this_dw = dw;
                this_dh = dh;
                this_dx_square = this_dx + 40;
                this_dy_square = this_dy + 15;
            } else if (5 < flag && flag < 10){
                this_dx = j * dw;
                this_dy = dh + (i-1) * dh * 0.74;
                this_dw = dw;
                this_dh = dh * 0.74;
                this_dx_square = this_dx + 40;
                this_dy_square = this_dy + 15;
            }
            //console.log(flag, i, j, this_dx, this_dy, this_dw, this_dh)
            tempArray[j] = new Grid(flag, i, j, this_dx, this_dy, this_dw, this_dh, this.context, this.imageCache,
                this_dx_square, this_dy_square);
        }
        gridArray[i] = tempArray;
    }
    this.gridArray = gridArray;
};
/*
 画每一个格子
 */
Map.prototype.draw = function (){
    for (var i = 0; i < this.heightNum; i++) {
        for (var j = 0; j < this.widthNum; j++) {
            var grid = this.gridArray[i][j];
            grid.draw();
        }
    }
};
/*
 计算gridId在第几行第几列
 */
Map.prototype.getijByIndex = function (index) {
    var i, j;
    if (0 <= index && index < 5){
        i = 5;
        j = 5 - index;
    }
    else if (5 <= index && index < 10){
        i = 10 - index;
        j = 0;
    }
    else if (10 <= index && index < 15){
        i = 0;
        j = index - 10;
    }
    else if (15 <= index && index < 20){
        i = index - 15;
        j = 5;
    }
    else {
        //console.log("error: gridid=", index);
        i = -1;
        j = -1;
    }
    return {'i': i, 'j': j}
};
/*
 获得棋盘左上角位置
 */
Map.prototype.getPositionByIndex = function (player, addOwner=true) {
    var _mapper = {
        0: [0, 0],
        1: [0, 1],
        2: [1, 0],
        3: [1, 1]
    };
    var player_offset = _mapper[player.id];
    var grid_ij = this.getijByIndex(player.gridId);
    var grid = this.gridArray[grid_ij.i][grid_ij.j];
    //console.log(player_offset, grid, player);
    return {'x': this.offsetX + grid.dx_sq + (player_offset[1] * 100 * 0.5),
            'y': this.offsetY +  grid.dy_sq + (player_offset[0] * 80 * 0.5),
            'i': grid_ij.i, 'j':grid_ij.j};
};
/*
 删除格子内用户
 */
Map.prototype.delPlayerPos = function (old_gridId, name) {
    var _old_grid_ij = this.getijByIndex(old_gridId);
    var old_grid = this.gridArray[_old_grid_ij.i][_old_grid_ij.j];
    old_grid.owner.remove(name);
};

/*
 点亮格子
 */
Map.prototype.light = function (pos) {
    var cur_grid = this.gridArray[pos.i][pos.j];
    cur_grid.light();
};

/*
 获得棋盘画布
 */
Map.prototype.getCanvas = function () {
    return this.canvas;
};


//地图的元素类
function Grid(flag, i, j, dx, dy, dw, dh, context, img, dx_sq, dy_sq) {
    this.flag = flag;//元素的策略标记，根据此标记逻辑层可以有自身的策略
    this.owner = [];//这个位置子属于谁
    this.i = i;
    this.j = j;
    this.dx = dx;//当前元素绘制在图像中的x坐标
    this.dy = dy;//当前元素绘制在图像中的y坐标
    this.dw = dw;//绘制出的图像宽度
    this.dh = dh;//绘制出的图像高度
    this.dx_sq = dx_sq;//绘制出的图像高度
    this.dy_sq = dy_sq;//绘制出的图像高度
    this.context = context;//绘制的canvas的context
    this.images = img;
    this.unfold = false;
}

Grid.prototype.draw = function () {
    //console.log('flag: ', this.flag, " i: ", this.i, " j: ", this.j);
    switch (this.flag) {
        case -1:
            break;
        default:
            //console.log(this.images, this.flag);
            this.context.drawImage(this.images[this.flag], this.dx, this.dy, this.dw, this.dh);
            break;
    }
};

Grid.prototype.light = function () {
    var flagAdd100 = this.flag + 100;
    this.context.drawImage(this.images[flagAdd100], this.dx, this.dy, this.dw, this.dh);
};

Grid.prototype.setFlag = function (flag) {
    this.flag = flag;
};

Grid.prototype.getFlag = function () {
    return this.flag;
};

Grid.prototype.setOwner = function (owner) {
    this.owner = owner;
};

Grid.prototype.getOwner = function () {
    return this.owner;
};

Grid.prototype.getPosition = function () {
    return {'x': this.dx, 'y': this.dy}
};

function shuffle(a) {
    var len = a.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = a[index];
        a[index] = a[len - i - 1];
        a[len - i - 1] = temp;
    }
}