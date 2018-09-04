
/*
 玩家初始化
 */
function Player(player, id){
    this.id = id;
    this.name = player.name;
    this.gridId = player.girdId;
    this.balance = player.balance;
    this.token = player.token;
    this.bufferfly = player.bufferfly;
    this.backHistory = player.backHistory;
    this.manualDice = player.manualDice;
    this.diceCache = [];
    this.diceRest = 0;
}
/*
 把格子内的用户删除
 */
Player.prototype.clearCurrentGridOwner = function(map) {
    map.delPlayerPos(this.gridId, this.name);
};
/*
 玩家图标移动
 */
Player.prototype.move = function(step, canves, map) {
    //this.diceRest = step;
    var new_gridId_temp = this.gridId + step;
    var new_gridId = this.gridId + step;
    if (new_gridId >= 20) {
        console.log("20->0", new_gridId)
        new_gridId = 0;
    }
    map.delPlayerPos(this.gridId, this.name);
    var start = this.gridId + 1;
    //this.gridId = new_gridId;
    //console.log("new gridid=", new_gridId, " start=", start)
    for (start; start<=new_gridId_temp; start++){
        //console.log("player:", start)
        if (start >= 20) {
            new_gridId_temp -= 20;
            start -= 20;
        }
        var addOwnerFlag;
        //start == this.gridId ? addOwnerFlag = true : addOwnerFlag = false;
        this.gridId = start;
        var currentGridPostion = map.getPositionByIndex(this, addOwnerFlag);
        $("#img"+(this.id+1)).animate({left:currentGridPostion.x, top:currentGridPostion.y}, 50);
        this.dx = currentGridPostion.x;
        this.dy = currentGridPostion.y;

        if (start % 5 == 0) {
            if (start < new_gridId_temp) {
                this.diceRest = new_gridId_temp - start;
                //this.gridId -= this.diceRest;
            }else if (start == new_gridId_temp){
                var light_res = lightGrid(currentGridPostion, this.gridId, map);
            }
            $('.exchange').show();
            return {'gridId': -1, 'eventId': -1};
        }
    }
    this.diceRest = 0;
    //console.log("playe--", this.gridId, map.eventArray[this.gridId])
    var light_res = lightGrid(currentGridPostion, this.gridId, map);
    return light_res;
};
/*
 玩家移动结束，点亮对应格子，触发事件
 */
var lightGrid = function(currentGridPostion, this_gridId, map){
    var grid_i = currentGridPostion.i;
    var grid_j = currentGridPostion.j;
    var gridId = this_gridId;
    var event_id = map.eventArray[gridId];
    if (!map.gridArray[grid_i][grid_j].unfold){
        setTimeout(function(){
            var event = new TFEvent(event_id, map.sw*map._scale, map.sh*map._scale);
            map.light(currentGridPostion);
            event.img.css({
                left: map.gridArray[grid_i][grid_j].dx_sq + 305 +  "px",
                top : map.gridArray[grid_i][grid_j].dy_sq + 50 + "px"
            });
            event.img.appendTo($("#main"));
            if (event.arrow) {
                $('.arrow').css("background-image", "url(./images/arrow_up.png)");
            }else {
                $('.arrow').css("background-image", "url(./images/arrow_down.png)");
            }
            $('.event-content').hide().show(500).text(event.description);
            map.gridArray[grid_i][grid_j].unfold = true;
            event.addAction();
        }, 100);
    }else{
        console.log("已经有图片啦");
    }
    return {'gridId': gridId, 'eventId': event_id}
};
/*
 设置玩家当前位置
 */
Player.prototype.setPosition = function(map) {
    var currentGridPostion = map.getPositionByIndex(this);
    this.dx = currentGridPostion.x;
    this.dy = currentGridPostion.y;
    //console.log("player pos: ", currentGridPostion);
};
/*
 获得玩家时光回溯次数
 */
Player.prototype.getTimeHistoryNumber = function() {
    return this.backHistory;
};
/*
 玩家放置蝴蝶印记
 */
Player.prototype.putButterfly = function(canves) {
    var playerbfImgId = parseInt(this.id) +1;
    var playerBfId = this.id + "_" + this.bufferfly;
    var bfImage = $('<div data=' + this.bufferfly + ' id="bfimg' + playerBfId + '" class="role-image" style="background-image:url(images/butterfly' + playerbfImgId + '.png)"></div>');
    bfImage.appendTo($("#main"));
    var bf_x = this.dx;
    var bf_y = this.dy;
    bfImage.css({
        left: bf_x + "px",
        top : bf_y + "px"
    });
};
/*
 蝴蝶印记回溯结束，删除该印记
 */
Player.prototype.deleteButterflyImg = function(choseBfId) {
    $("#bfimg" + this.id + '_' + choseBfId).hide('fast');
};
/*
 玩家买入
 */
Player.prototype.buy = function(_balance, _radio) {
    var change_token = Math.floor((_balance / _radio) * 100) / 100;
    this.balance -= _balance;
    //this.balance -= _balance;
    if (this.balance < 0) this.balance = 0.0;
    this.token += change_token;
    //console.log(_balance, _radio, change_token);
    this.updateInfoBar();
};
/*
 玩家卖出
 */
Player.prototype.sell = function(_token, _radio) {
    var change_balance = Math.floor((_token * _radio) * 100) / 100;
    this.balance += change_balance;
    this.token -= _token;
    if (this.token < 0) this.token = 0.0;
    this.updateInfoBar();
};
/*
 更新玩家类中变量信息
 */
Player.prototype.update = function(player, map) {
    this.gridId = player.gridId;
    this.balance = player.balance;
    this.token = player.token;

    //this.bufferfly = player.bufferfly;
    //this.backHistory = player.backHistory;
    //this.manualDice = player.manualDice;
    //this.diceCache = player.diceCache;

    var currentGridPostion = map.getPositionByIndex(this, true);
    //var player_img = $("#img"+(this.id+1));
    //console.log("player update", currentGridPostion)
    var _x = currentGridPostion.x;
    var _y = currentGridPostion.y;
    //var start = this.gridId;

    $("#img"+(this.id+1)).css({
        left: _x + "px",
        top : _y + "px"
    });
    this.dx = _x;
    this.dy = _y;
};
/*
 更新玩家信息栏中信息
 */
Player.prototype.updateInfoBar = function (round) {
    //console.log(this.name);
    $('.player'+this.id+' .player-name').text(this.name);
    this.updateInfoDiceNumber(round);
    $('.player'+this.id+'>.player-bf').text(this.bufferfly);
    $('.player'+this.id+'>.player-bh').text(this.backHistory);
    $('.player'+this.id+'>.player-md').text(this.manualDice);
    $('.player'+this.id+'>.player-cash').text(this.balance.toFixed(2));
    $('.player'+this.id+'>.player-token').text(this.token.toFixed(2));
};
/*
 更新信息栏中天命点数
 */
Player.prototype.updateInfoDiceNumber = function(round){
    console.log("round:" + round);
    if (round != undefined){
        //console.log(round, this.diceCache);
        var rest_array = this.diceCache.slice(round, round + 4);
        //console.log(rest_array)
        console.log("updateInfoBar: ", rest_array.join(','));
        $('.player'+this.id+' .player-dice').text("天命点数: " + rest_array.join(','));
    }
};
Player.prototype.getScore = function(ratio) {
    return (this.token * ratio) + this.balance
};

/*
 玩家列表初始化
 */
function PlayerList(map, canvas){
    this.map = map;
    this.canvas = canvas;
}
PlayerList.prototype.init = function(players){
    this.playerArray = {};
    this.length = players.length;
    for(var i=0; i<players.length; i++){
        var _p = new Player(players[i], i);
        _p.setPosition(this.map);
        this.playerArray[players[i].id] = _p;
        _p.updateInfoBar(0);
    }
};
/*
 放置所有玩家
 */
PlayerList.prototype.putOnStartPos = function(){
    //console.log(this.canvas, this.playerArray);
    for(var i in this.playerArray){
        //console.log(i, this.playerArray[i]);
        var playerImgId = parseInt(i) +1;
        var roleImage = $('<div id="img' + playerImgId + '" class="role-image" style="background:url(images/avatar' + playerImgId + '.png) no-repeat 0 0; background-size: 20px, 20px"></div>');
        roleImage.appendTo($("#main"));
        this.playerArray[i].img = roleImage;
        //console.log(this.playerArray[i].dx, this.playerArray[i].dy)
        roleImage.css({
            left: this.playerArray[i].dx  + "px",
            top : this.playerArray[i].dy  + "px"
        });
    }
};
/*
 对应玩家移动
 */
PlayerList.prototype.move = function(userid, step){
    //console.log("playlist move", userid, step)
    var player = this.playerArray[userid];
    var res = player.move(step, this.canvas, this.map);
    return res;
    //return ;
};
/*
 对应玩家放置蝴蝶印记
 */
PlayerList.prototype.putButterfly = function(userid) {
    var player = this.playerArray[userid];
    player.putButterfly(this.canvas);
};
/*
 获得所有玩家信息
 */
PlayerList.prototype.getPlayerInfo = function() {
    var res = {};
    for(var i in this.playerArray){
        res[i] = {
            'gridId': this.playerArray[i].gridId,
            'balance': this.playerArray[i].balance,
            'token': this.playerArray[i].token,
            'bufferfly': this.playerArray[i].bufferfly,
            'backHistory': this.playerArray[i].backHistory,
            'manualDice': this.playerArray[i].manualDice,
            //'diceCache': [...this.playerArray[i].diceCache]
            'diceCache': this.playerArray[i].diceCache
        };
    }
    return res;
};
/*
 所有玩家时光回溯
 */
PlayerList.prototype.back2History = function(info, choseBfId, round) {
    for(var i in this.playerArray){
        var player = this.playerArray[i];
        player.clearCurrentGridOwner(this.map);
        player.update(info[i], this.map);
        player.updateInfoBar(round);
        //console.log(player);
    }
};
PlayerList.prototype.updateButterflyImage = function(info_str) {
    var oldBfimgSet = $("div[id^='bfimg']:visible");
    for(var i=0; i<oldBfimgSet.length; i++){
        $(oldBfimgSet[i]).hide();
    }
    //console.log("info: ", info)
    var info = info_str.split(',');

    for(var j=0; j<info.length; j++){
        var bf_id = 'div[id="' + info[j] + '"]';
        //console.log(bf_id)
        $(bf_id).show();
        //$(info[j]).show();
    }
};
PlayerList.prototype.getWinner = function (ratio) {
    //todo 平分？
    var playerid = -1;
    var max_score = -1;
    for(var i in this.playerArray){
        var player = this.playerArray[i];
        var _s = player.getScore(ratio);
        if (_s > max_score) {
            max_score = _s;
            playerid = player.id;
        }
    }
    return playerid;
};
