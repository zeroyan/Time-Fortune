/**
 * Created by zeroyan on 2018/7/12.
 */
var MAPDATA = [
    [0, 1, 1, 1, 1, 0],
    [1, -1, -1, -1, -1, 1],
    [1, -1, -1, -1, -1, 1],
    [1, -1, -1, -1, -1, 1],
    [1, -1, -1, -1, -1, 1],
    [0, 1, 1, 1, 1, 0]
];

var SCALE = 0.8;
var MAP_WIDTH = 500;
var MAP_HEIGHT = 500;
var MAP_OFFSETX = 350;
var MAP_OFFSETY = 50;
var GRID_WIDTH = 100;
var GRID_HEIGHT = 100;

function Map() {}

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
    this.color='#000000';

    var gridArray = [];
    var eventArray = new Array(25);
    console.log(eventArray.length)
    for (var e_i=0; e_i<eventArray.length; e_i++){
        eventArray[e_i] = e_i+1;
    }
    shuffle(eventArray);
    this.eventArray = eventArray;
    console.log(this.eventArray)


    var dw = this.sw * this._scale;//绘制出的图像宽度
    var dh = this.sh * this._scale;//绘制出的图像高度

    //console.log(this.imageCache);
    for (var i = 0; i < this.heightNum; i++) {
        var tempArray = [];
        for (var j = 0; j < this.widthNum; j++) {
            var flag = this.mapDataArray[i][j];
            var dx = j * dw;
            var dy = i * dh;
            tempArray[j] = new Grid(flag, i, j, dx, dy, dw, dh, this.context, this.imageCache);
        }
        gridArray[i] = tempArray;
    }
    this.gridArray = gridArray;
};

Map.prototype.draw = function (){
    for (var i = 0; i < this.heightNum; i++) {
        for (var j = 0; j < this.widthNum; j++) {
            var grid = this.gridArray[i][j];
            grid.draw();
        }
    }
};

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
        i = -1;
        j = -1;
    }
    return {'i': i, 'j': j}
};

Map.prototype.getPositionByIndex = function (index, name, addOwner=true) {
    //console.log("player gridid", index);
    if (index >= 20) index = index % 20;
    var grid_ij = this.getijByIndex(index);
    //console.log("player grid_ij", index, grid_ij);
    var _grid = this.gridArray[grid_ij.i][grid_ij.j];
    //console.log("player grid ", _grid);
    //console.log("map owner:  ", _grid.owner);
    var _grid_owner_offset;
    if (addOwner){
        _grid.owner.push(name);
        _grid_owner_offset = _grid.owner.length
    }else {
        _grid_owner_offset = _grid.owner.length + 1
    }
    //_grid.owner.length == 0 ? _grid_owner_offset = 1 : _grid_owner_offset = _grid.owner.length
    //console.log("player grid_own",_grid.owner);
    //console.log("player grid_pos", _grid.dx, _grid.dy, _grid.dx + this.offsetX+_grid_owner_offset * 15);
    return {'x': 5 + _grid.dx + this.offsetX + _grid_owner_offset * 10,
        'y': 5 + _grid.dy + this.offsetY + _grid_owner_offset * 10,'i': grid_ij.i, 'j':grid_ij.j};
    //return {'x': this.offsetX + _grid.owner.length * 5, 'y': this.offsetY + _grid.owner.length * 5}
};

Map.prototype.delPlayerPos = function (old_gridId, name) {
    //console.log("player gridid", index);
    var _old_grid_ij = this.getijByIndex(old_gridId);
    //console.log("player grid_ij", grid_ij);
    var old_grid = this.gridArray[_old_grid_ij.i][_old_grid_ij.j];
    //console.log("player grid ", _grid);
    //console.log("map owner:  ", old_grid.owner);
    old_grid.owner.remove(name);
    //console.log("map owner after:  ", old_grid.owner);

    //var _new_grid_ij = this.getijByIndex(new_gridId);
    //var new_grid = this.gridArray[_new_grid_ij.i][_new_grid_ij.j];
    //new_grid.owner.push(name);


    //return {'x': 5 + _grid.dx + this.offsetX + _grid.owner.length * 15,
    //    'y': 5 + _grid.dy + this.offsetY + _grid.owner.length * 15};
    //return {'x': this.offsetX + _grid.owner.length * 5, 'y': this.offsetY + _grid.owner.length * 5}
};

Map.prototype.drawByIndex = function (index) {

};

Map.prototype.drawBgByImage = function (imgInfo) {};


Map.prototype.getCanvas = function () {
    return this.canvas;
};


//地图的元素类
function Grid(flag, i, j, dx, dy, dw, dh, context, img) {
    this.flag = flag;//元素的策略标记，根据此标记逻辑层可以有自身的策略
    this.owner = [];//这个位置子属于谁
    this.i = i;
    this.j = j;
    this.dx = dx;//当前元素绘制在图像中的x坐标
    this.dy = dy;//当前元素绘制在图像中的y坐标
    this.dw = dw;//绘制出的图像宽度
    this.dh = dh;//绘制出的图像高度
    this.context = context;//绘制的canvas的context
    this.images = img;
    this.unfold = false;
}


Grid.prototype.draw = function () {
    //console.log('flag: ', this.flag, " i: ", this.i, " j: ", this.j);
    switch (this.flag) {
        case -1:
            break;
        case 0:
            //_img = this.images[0];
            //console.log(this.dx, this.dy, this.images[0], this.dw, this.dh);
            this.context.drawImage(this.images[0], this.dx, this.dy, this.dw, this.dh);
            break;
        case 1:
            //console.log(this.dx, this.dy, this.images[1], this.dw, this.dh);
            this.context.drawImage(this.images[1], this.dx, this.dy, this.dw, this.dh);
            break;
    }
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

Grid.prototype.getPosition = function (dx, dy) {
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