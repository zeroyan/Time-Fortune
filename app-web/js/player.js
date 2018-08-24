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

Player.prototype.clearCurrentGridOwner = function(map) {
    map.delPlayerPos(this.gridId, this.name);
    //this.deleteButterflyImg();
};

//function sleep(n)
//{
//    console.log("sleep", n)
//    var start=new Date().getTime();
//    while(true) if(new Date().getTime()-start>n) break;
//}

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
    this.gridId = new_gridId;
    console.log("new gridid=", new_gridId, " start=", start)

    for (start; start<=new_gridId_temp; start++){
        //console.log("player:", start)
        var addOwnerFlag;
        start == this.gridId ? addOwnerFlag = true : addOwnerFlag = false;
        var currentGridPostion = map.getPositionByIndex(start, this.name, addOwnerFlag);
        //console.log(this.id+1)
        //var player_img = $("#img"+(this.id+1));
        console.log("currentGridPostion", currentGridPostion)
        //$("#img"+(this.id+1)).css({
        //    left: currentGridPostion.x + "px",
        //    top : currentGridPostion.y + "px"
        //});
        $("#img"+(this.id+1)).animate({left:currentGridPostion.x, top:currentGridPostion.y}, 50);
        this.dx = currentGridPostion.x;
        this.dy = currentGridPostion.y;

        if (start % 5 == 0) {
            if (start < new_gridId_temp) {
                this.diceRest = new_gridId_temp - start;
                this.gridId -= this.diceRest;
            }
            $('.exchange').show();
            return {'gridId': -1, 'eventId': -1};
        }

        //for (var k =0; k < 2000; k++) {console.log(1111)}

        //var _id = this.id;
        //setTimeout(function () {
        //    console.log("#img"+(_id+1))
        //    $("#img"+(_id+1)).css({
        //        left: currentGridPostion.x + "px",
        //        top : currentGridPostion.y + "px"
        //    });
        //}, 1000);
        //player_img.css({
        //    top: this.dx + "px",
        //    left : this.dy + "px"
        //});
    }
    this.diceRest = 0;
    console.log("playe--", this.gridId, map.eventArray[this.gridId])
    var grid_i = currentGridPostion.i;
    var grid_j = currentGridPostion.j;
    var gridId = this.gridId;
    var event_id = map.eventArray[gridId];
    if (!map.gridArray[grid_i][grid_j].unfold){
        setTimeout(function(){
            var event = new TFEvent(event_id, map.sw*map._scale, map.sh*map._scale);
            event.img.appendTo($("#main"));
            console.log(currentGridPostion);
            event.img.css({
                left: map.gridArray[grid_i][grid_j].dx + map.offsetX + "px",
                top : map.gridArray[grid_i][grid_j].dy + map.offsetY + "px"
            });
            map.gridArray[grid_i][grid_j].unfold = true;
            event.addAction();
        }, 210);
    }else{
        console.log("已经有图片啦");
    }

    //if([0, 5, 10, 15].indexOf(gridId) >= 0){
    //    $('.exchange').show();
    //}

    return {'gridId': gridId, 'eventId': event_id};
};



//Player.prototype.move = function(step, canves, map) {
//    //var i = 1;
//    //var IntervalName = setInterval(function () {
//    //    //需要定时执行的代码
//    //    i++;
//    //    if (i > 5) {
//    //        //删除定时器IntervalName 如果上面不定义，你就不知道要清除哪个定时器。
//    //        //因为你可能在特定的条件想停止定时器。
//    //        clearInterval(IntervalName);
//    //        console.log("over");
//    //        return {'gridId': 1, 'eventId': 1};
//    //    };
//    //}, 500);
//    //
//    //this.diceRest = step;
//    //var new_gridId_temp = this.gridId + step;
//    //var new_gridId = this.gridId + step;
//    //if (new_gridId >= 20) {
//    //    console.log("20->0", new_gridId)
//    //    new_gridId = 0;
//    //}
//    //map.delPlayerPos(this.gridId, this.name);
//    //var start = this.gridId + 1;
//    ////if (start >= 20) start = 0;
//    //this.gridId = new_gridId;
//    //console.log("new gridid=", new_gridId, " start=", start)
//    //
//    //var _this_player = this;
//    //var currentGridPostion;
//    //var exeMove = setInterval(function(){
//    //    console.log("player:", start)
//    //    var addOwnerFlag;
//    //    start == _this_player.gridId ? addOwnerFlag = true : addOwnerFlag = false;
//    //    currentGridPostion = map.getPositionByIndex(start, _this_player.name, addOwnerFlag);
//    //    //console.log(this.id+1)
//    //    //var player_img = $("#img"+(this.id+1));
//    //    console.log("currentGridPostion", currentGridPostion)
//    //    $("#img"+(_this_player.id+1)).css({
//    //        left: currentGridPostion.x + "px",
//    //        top : currentGridPostion.y + "px"
//    //    });
//    //    _this_player.dx = currentGridPostion.x;
//    //    _this_player.dy = currentGridPostion.y;
//    //
//    //    console.log("_this_player.diceRest:", _this_player.diceRest);
//    //    _this_player.diceRest--;
//    //    start++;
//    //    if (_this_player.diceRest == 0) clearInterval(exeMove);
//    //}, 500);
//    //
//    //currentGridPostion = map.getPositionByIndex(start, _this_player.name, false);
//    ////var IntervalName = setInterval(function () {
//    ////    //需要定时执行的代码
//    ////    i++;
//    ////    if (i > 5) {
//    ////        //删除定时器IntervalName 如果上面不定义，你就不知道要清除哪个定时器。
//    ////        //因为你可能在特定的条件想停止定时器。
//    ////        clearInterval(IntervalName);
//    ////    };
//    ////}, 1000);
//    //
//    //
//    //
//    ////for (start; start<=new_gridId_temp; start++){
//    ////    console.log("player:", start)
//    ////    var addOwnerFlag;
//    ////    start == this.gridId ? addOwnerFlag = true : addOwnerFlag = false;
//    ////    var currentGridPostion = map.getPositionByIndex(start, this.name, addOwnerFlag);
//    ////    //console.log(this.id+1)
//    ////    //var player_img = $("#img"+(this.id+1));
//    ////    console.log("currentGridPostion", currentGridPostion)
//    ////    $("#img"+(this.id+1)).css({
//    ////        left: currentGridPostion.x + "px",
//    ////        top : currentGridPostion.y + "px"
//    ////    });
//    ////    this.dx = currentGridPostion.x;
//    ////    this.dy = currentGridPostion.y;
//    ////    //for (var k =0; k < 2000; k++) {console.log(1111)}
//    ////
//    ////    if (start % 5 == 0) $('.exchange').show();
//    ////
//    ////    //var _id = this.id;
//    ////    //setTimeout(function () {
//    ////    //    console.log("#img"+(_id+1))
//    ////    //    $("#img"+(_id+1)).css({
//    ////    //        left: currentGridPostion.x + "px",
//    ////    //        top : currentGridPostion.y + "px"
//    ////    //    });
//    ////    //}, 1000);
//    ////    //player_img.css({
//    ////    //    top: this.dx + "px",
//    ////    //    left : this.dy + "px"
//    ////    //});
//    ////}
//    //console.log("playe--", this.gridId, map.eventArray[this.gridId])
//    //var grid_i = currentGridPostion.i;
//    //var grid_j = currentGridPostion.j;
//    //var gridId = this.gridId;
//    //var event_id = map.eventArray[gridId];
//    //if (!map.gridArray[grid_i][grid_j].unfold){
//    //    setTimeout(function(){
//    //        var event = new TFEvent(event_id, map.sw*map._scale, map.sh*map._scale);
//    //        event.img.appendTo($("#main"));
//    //        console.log(currentGridPostion);
//    //        event.img.css({
//    //            left: map.gridArray[grid_i][grid_j].dx + map.offsetX + "px",
//    //            top : map.gridArray[grid_i][grid_j].dy + map.offsetY + "px"
//    //        });
//    //        map.gridArray[grid_i][grid_j].unfold = true;
//    //        event.addAction();
//    //    }, 280);
//    //}else{
//    //    console.log("已经有图片啦");
//    //}
//    //
//    //if([0, 5, 10, 15].indexOf(gridId) >= 0){
//    //    $('.exchange').show();
//    //}
//    //
//    //return {'gridId': gridId, 'eventId': event_id};
//};

Player.prototype.setPosition = function(map) {
    var currentGridPostion = map.getPositionByIndex(this.gridId, this.name);
    this.dx = currentGridPostion.x;
    this.dy = currentGridPostion.y;
    //console.log("player pos: ", currentGridPostion);
};

Player.prototype.getTimeHistoryNumber = function() {
    return this.backHistory;
};

Player.prototype.putButterfly = function(canves) {
    var playerbfImgId = parseInt(this.id) +1;
    //console.log("playerImgId: ",playerbfImgId)
    var playerBfId = this.id + "_" + this.bufferfly;
    //var bfImage = $('<div id="bfimg' + playerBfId + '" class="role-image" style="background:url(images/butterfly' + playerbfImgId + '.png)"></div>');
    var bfImage = $('<div data=' + this.bufferfly + ' id="bfimg' + playerBfId + '" class="role-image" style="background-image:url(images/butterfly' + playerbfImgId + '.png)"></div>');
    bfImage.appendTo($("#main"));
    var bf_x = this.dx;
    var bf_y = this.dy + 15;
    //this.bf_img = bfImage;
    bfImage.css({
        left: bf_x + "px",
        top : bf_y + "px"
    });
};

Player.prototype.deleteButterflyImg = function(choseBfId) {
    $("#bfimg" + this.id + '_' + choseBfId).hide('fast');
};

Player.prototype.buy = function(_balance, _radio) {
    var balance_account = _balance / 100 * this.balance;
    var change_token = Math.floor((balance_account / _radio) * 100) / 100;
    this.balance -= balance_account;
    this.token += change_token;
    //console.log("in",balance_account, change_token);
    this.updateInfoBar();
};

Player.prototype.sell = function(_token, _radio) {
    var token_account = _token / 100 * this.token;
    var change_balance = Math.floor((token_account * _radio) * 100) / 100;
    this.balance += change_balance;
    this.token -= token_account;
    //console.log("in",balance_account, change_token);
    this.updateInfoBar();
};

Player.prototype.update = function(player, map) {
    this.gridId = player.gridId;
    this.balance = player.balance;
    this.token = player.token;
    this.bufferfly = player.bufferfly;
    this.backHistory = player.backHistory;
    this.manualDice = player.manualDice;
    this.diceCache = player.diceCache;

    var currentGridPostion = map.getPositionByIndex(this.gridId, this.name, true);
    //var player_img = $("#img"+(this.id+1));
    console.log("player update", currentGridPostion)
    $("#img"+(this.id+1)).css({
        left: currentGridPostion.x + "px",
        top : currentGridPostion.y + "px"
    });
    this.dx = currentGridPostion.x;
    this.dy = currentGridPostion.y;


};

Player.prototype.updateInfoBar = function (round) {
    $('.player'+this.id+'>.player-name').text(this.name);

    //console.log(round, this.diceCache.slice(round, this.diceCache.length));
    //var rest_array = this.diceCache.slice(round, this.diceCache.length);
    //console.log(rest_array)
    //var _a_cache = 3;
    //if (rest_array.length < _a_cache){
    //    _a_cache = rest_array.length;
    //}
    //console.log(rest_array.join(','));

    $('.player'+this.id+'>.player-bf').text("蝴蝶印记: " + this.bufferfly);
    //$('.player'+this.id+'>.player-dice').text("天命点数: " + rest_array.join(','));
    $('.player'+this.id+'>.player-bh').text("时光回溯: " + this.backHistory);
    $('.player'+this.id+'>.player-md').text("遥控骰子: " + this.manualDice);
    $('.player'+this.id+'>.player-cash').text("现金: " + this.balance.toFixed(2));
    $('.player'+this.id+'>.player-token').text("时光币: " + this.token.toFixed(2));
};

//Player.prototype.addAction = function () {
//    $('#randomDice').click(function(){
//        var dice_num = Math.floor(Math.random() * 6 + 1);
//        console.log("click randomDice", dice_num);
//        console.log();
//    });
//};



function PlayerList(map, canvas){
    //this.offsetx = 0;
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
    //console.log(this.playerArray)
};

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
            left: this.playerArray[i].dx + "px",
            top : this.playerArray[i].dy + "px"
        });
    }
};
PlayerList.prototype.move = function(userid, step){
    //console.log("playlist move", userid, step)
    var player = this.playerArray[userid];
    var res = player.move(step, this.canvas, this.map);
    return res;
    //return ;
};

PlayerList.prototype.putButterfly = function(userid) {
    var player = this.playerArray[userid];
    player.putButterfly(this.canvas);
};

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

PlayerList.prototype.back2History = function(info, choseBfId, round) {
    //console.log(round)
    for(var i in this.playerArray){
        var player = this.playerArray[i];
        player.clearCurrentGridOwner(this.map);
        player.update(info[i], this.map);
        player.updateInfoBar(round);
        var rest_array = player.diceCache.slice(round, player.diceCache.length);
        $('.player'+i+'>.player-dice').text("天命点数: " + rest_array.join(','));
        //$(_this_bf).unbind("click");
        console.log(player);
    }
};

PlayerList.prototype.updateButterflyImage = function(info) {
    var oldBfimgSet = $("div[id^='bfimg']:visible");
    for(var i=0; i<oldBfimgSet.length; i++){
        $(oldBfimgSet[i]).hide();
    }
    for(var j=0; j<info.length; j++){
        $(info[j]).show();
    }
};
