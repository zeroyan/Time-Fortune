/**
	Game控制类的构造函数
 */
function Game() {
    console.log("Game...");
    var playerList;
	//var gridList = [];
	//var personMap = {};
	//var blockMap = {};
	var map = new Map();

    var gameover_round = 10;
    var round_ind = 0;
    var bf_number = 0;
    var ratio = 1.0;
    //var my_id = 0;
    var bf_cache = {};
    var bf_queue = [];
    var exeOkFlag = false;

    /*
     游戏初始化
     */
	function init() {
        map.init();
        map.draw();
        var game_canvas = map.getCanvas();
        var playerArray = getPlayerInfo();
        //console.log(playerArray);
        playerList = new PlayerList(map, game_canvas);
        playerList.init(playerArray);
        playerList.putOnStartPos();
	}

    /*
     游戏开始用户初始化信息
     todo: ajax获取
     */
    function getPlayerInfo() {
        var players;
        // todo: server
        players = [
            {
                "id": 0,
                "name": "mao",
                "girdId": 0,
                "balance": 10000,
                "token": 2000,
                "bufferfly": 3,
                "backHistory": 1,
                "manualDice": 1
            },
            {
                "id": 1,
                "name": "sha",
                "girdId": 0,
                "balance": 10000,
                "token": 2000,
                "bufferfly": 3,
                "backHistory": 1,
                "manualDice": 1
            },
            {
                "id": 2,
                "name": "wei",
                "girdId": 0,
                "balance": 10000,
                "token": 2000,
                "bufferfly": 3,
                "backHistory": 1,
                "manualDice": 1
            },
            {
                "id": 3,
                "name": "shuaige",
                "girdId": 0,
                "balance": 10000,
                "token": 2000,
                "bufferfly": 3,
                "backHistory": 1,
                "manualDice": 1
            }
        ];
        return players
    }

    /*
     各个按钮事件
     */
    function addAction() {
        /*
         随机掷骰子
         */
        $('#randomDice').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var current_game_turn = Math.floor(round_ind / playerList.length);
            var current_player = playerList.playerArray[current_player_turnId];
            var _diceCache = current_player.diceCache;
            var dice_num;
            if (current_game_turn < _diceCache.length){
                //console.log('_diceCache', _diceCache, round_ind, _diceCache.length)
                dice_num = _diceCache[current_game_turn];
                current_player.updateInfoDiceNumber(current_game_turn+1);
            }else{
                //console.log('random dice', _diceCache)
                dice_num = Math.floor(Math.random() * 4 + 1);
                playerList.playerArray[current_player_turnId].diceCache.push(dice_num);
                //current_player.updateInfoDiceNumber(current_game_turn+1);
            }
            $("#dice"+dice_num).toggle(200);
            //console.log("click randomDice", dice_num, round_ind, current_player_turnId);
            var move_res = playerList.move(current_player_turnId, dice_num);
            //console.log(move_res);
            if (move_res.eventId > 0){
                ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                $('.info-ratio').text('ratio: ' + ratio);

                $('#putBufferfly').attr('disabled',"true");
                $('#randomDice').attr('disabled',"true");
                $('#manualDice').attr('disabled',"true");
                exeOkFlag = true;
            }
            setTimeout(function(){
                $("#dice"+dice_num).toggle(200);
            }, 1000);
        });

        /*
         回合结束
         */
        $('#turnOver').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var backGameInfoList = bf_cache[current_player_turnId];
            for (var bfId_2 in backGameInfoList){
                var _this_bf_2 = $("#bfimg"+current_player_turnId+'_'+bfId_2);
                $(_this_bf_2).css({'background-size': "20px",
                    'width': '20px',
                    'height': '20px'});
                $(_this_bf_2).unbind("click");
            }
            if (exeOkFlag) {
                round_ind++;
                var current_game_turn = Math.floor(round_ind / playerList.length);
                //console.log("turnOver info: ", parseInt(current_game_turn), round_ind)
                $('.info-round').text("Turn number: " + current_game_turn);
                $('#putBufferfly').removeAttr("disabled");
                $('#randomDice').removeAttr("disabled");
                $('#manualDice').removeAttr("disabled");
                exeOkFlag = false;

            }else{
                alert('请先完成操作');
            }

            if (round_ind == playerList.length * gameover_round){
                var winner_id = playerList.getWinner(ratio);
                alert("GameOver，胜出者：" + playerList.playerArray[winner_id].name);
                window.location.reload();
            }
        });
        /*
         放置蝴蝶印记
         todo ajax存棋盘信息
         */
        $('#putBufferfly').click(function(){
            //console.log('put butterfly')
            var current_player_turnId  = round_ind % playerList.length;
            //console.log("playerid:", current_player_turnId)
            var current_play = playerList.playerArray[current_player_turnId];
            //console.log("current_play bf num:", current_play.bufferfly)
            if (current_play.bufferfly > 0) {
                playerList.putButterfly(current_player_turnId);
                //var playerBfId = current_player_turnId + '/' + current_play.bufferfly;
                var playerBfId = current_player_turnId;
                //console.log("playerBfId", playerBfId);
                current_play.bufferfly--;
                $('.player'+current_player_turnId+'>.player-bf').text(current_play.bufferfly);
                //$('.player'+current_player_turnId+'>.player-bf').text("蝴蝶印记: " + current_play.bufferfly);
                var res = getCurrentGameInfo(current_play.bufferfly + 1);
                console.log(res)
                //res['bfId'] = current_play.bufferfly + 1;
                if (playerBfId in bf_cache){
                    bf_cache[playerBfId][current_play.bufferfly + 1] = res;
                }else{
                    bf_cache[playerBfId] = {};
                    bf_cache[playerBfId][current_play.bufferfly + 1] = res;
                }

                var bf_id = current_play.bufferfly + 1;

                if (bf_number < 3){
                    bf_queue.push(current_player_turnId + "_" +  bf_id);
                }else{
                    var del_bf = bf_queue[0];
                    $("#bfimg"+del_bf).hide('fast');

                    bf_queue.remove(bf_queue[0]);
                    bf_queue.push(current_player_turnId + "_" +  bf_id);
                }
                //console.log("bf_queue = ", bf_queue);
                bf_number++;
            }else{
                alert("不能再放蝴蝶印记了");
                //console.log("不能再放蝴蝶印记了");
            }
            $('#putBufferfly').attr('disabled',"true");
            //console.log(bf_cache)
        });
        /*
         时光回溯，回到选中的蝴蝶印记对应的棋盘
         */
        $('#backHistory').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var playerTimeHistoryNumber = playerList.playerArray[current_player_turnId].getTimeHistoryNumber();
            if(current_player_turnId in bf_cache && playerTimeHistoryNumber > 0){
                var backGameInfoList = bf_cache[current_player_turnId];
                var backGameInfo, choseBfId;
                for (var bfId in backGameInfoList){
                    //console.log(bfId, backGameInfoList[bfId]);
                    var _this_bf = $("#bfimg"+current_player_turnId+'_'+bfId);
                    $(_this_bf).css({'background-size': "40px",
                                    'width': '40px',
                                    'height': '40px'});
                    $(_this_bf).click(function(){
                        console.log($(this).attr("data"));
                        backGameInfo = backGameInfoList[$(this).attr("data")];
                        choseBfId = $(this).attr("data");

                        playerList.back2History(backGameInfo['player'], choseBfId, backGameInfo['roundId']);
                        playerList.playerArray[current_player_turnId].backHistory--;
                        $('.player'+current_player_turnId+'>.player-bh').text(playerList.playerArray[current_player_turnId].backHistory);
                        //$('.player'+current_player_turnId+'>.player-bh').text("时光回溯: " + playerList.playerArray[current_player_turnId].backHistory);
                        playerList.updateButterflyImage(backGameInfo['bfImageSet']);
                        playerList.playerArray[current_player_turnId].deleteButterflyImg(choseBfId);
                        //console.log(bf_cache[current_player_turnId])
                        delete bf_cache[current_player_turnId][choseBfId];
                        round_ind = backGameInfo['roundId'];
                        ratio = backGameInfo['ratio'];
                        $('.info-round').text("Turn number: " + round_ind);
                        $('.info-ratio').text("ratio: " + ratio);
                        bf_number--;

                        for (var bfId_2 in backGameInfoList){
                            //console.log(backGameInfoList)
                            var _this_bf_2 = $("#bfimg"+current_player_turnId+'_'+bfId_2);
                            $(_this_bf_2).css({'background-size': "20px",
                                                'width': '20px',
                                                'height': '20px'});
                            $(_this_bf_2).unbind("click");
                        }
                    });
                }
            }else{
                alert("你不可时光回溯");
            }
        });
        /*
         遥控骰子，显示1234选项
         */
        $('#manualDice').click(function(){
            $('.manualDiceNum').toggle(100);
        });
        /*
         遥控骰子，选点击的点数
         */
        $('.manualDiceNum span').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var current_game_turn = Math.floor(round_ind / playerList.length);
            var player = playerList.playerArray[current_player_turnId];
            var _diceCache = player.diceCache;
            if (player.manualDice > 0){
                $(this).parent().hide(100);
                var dice_num = $(this).text()-0;
                $("#dice"+dice_num).toggle(200);
                //var current_player_turnId  = round_ind % playerList.length;
                //var current_game_turn = Math.floor(round_ind / playerList.length);
                var current_player = playerList.playerArray[current_player_turnId];
                current_player.updateInfoDiceNumber(current_game_turn+1);
                //var _diceCache = current_player.diceCache;
                player.manualDice--;
                player.diceCache.push(dice_num);

                if (current_game_turn < _diceCache.length){
                    _diceCache[current_game_turn] = dice_num;
                }else{
                    playerList.playerArray[current_player_turnId].diceCache.push(dice_num);
                }

                //console.log("click randomDice", dice_num, round_ind, current_player_turnId);

                var move_res = playerList.move(current_player_turnId, dice_num);
                $('.player'+current_player_turnId+'>.player-md').text(player.manualDice);
                //$('.player'+current_player_turnId+'>.player-md').text("遥控骰子: " + player.manualDice);
                //console.log(move_res);
                if (move_res.eventId > 0){
                    ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                    $('.info-ratio').text('ratio: ' + ratio);

                    $('#putBufferfly').attr('disabled',"true");
                    $('#randomDice').attr('disabled',"true");
                    $('#manualDice').attr('disabled',"true");
                    exeOkFlag = true;
                }
                setTimeout(function(){
                    $("#dice"+dice_num).toggle(200);
                }, 1000);
            }else{
                console.log("你没有可用的遥控骰子");
            }
        });
        /*
         交易所界面关闭
         */
        $('.exchange #cancel').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            closeExchangeWindow(current_player_turnId);
        });
        /*
         交易所确定交易
         */
        $('.exchange #ok').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            var current_checked = $('input[name="exchange"]:checked').val();
            var account = parseFloat($('.exchange-main-screen').text());
            //var buy_account = $('.exchange input[name="buy"]').val();
            //var sell_account = $('.exchange input[name="sell"]').val();
            if (current_checked == 'buy'){
                //var change_token = (buy_account / 100 * player.balance * ratio).toFixed(2);
                player.buy(account, ratio);
            }else if (current_checked == 'sell'){
                player.sell(account, ratio);
            }
            closeExchangeWindow(current_player_turnId);
        });
        /*
         选择买入卖出单选项
         */
        $('input[type=radio][name="exchange"]').change(function(){
            $('.exchange input[name="slider"]').val(0);
            $('.exchange-main-screen').text("0.00");
        });
        /*
         滑动条，选取要交易的金额
         */
        $('.exchange input[name="slider"]').change(function(){
            var current_checked = $('input[name="exchange"]:checked').val();
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            if (current_checked == 'buy'){
                var _balance = player.balance;
                var change_token = ($(this).val()/100 * _balance).toFixed(2);
                $(".exchange-main-screen").text(change_token);
            }else if (current_checked == 'sell'){
                var _token = player.token;
                var change_balance = ($(this).val()/100 * _token).toFixed(2);
                $(".exchange-main-screen").text(change_balance);
            }
        });
    }

    /*
     获得server端对应棋盘信息
     todo ajax
     */
    function getCurrentGameInfo(){
        var info = {
            'roundId': round_ind,
            'ratio': ratio
        };
        var plyerInfo = playerList.getPlayerInfo();
        info['player'] = plyerInfo;
        //console.log($("div[id^='bfimg']:visible"));
        //console.log($("div[id^='bfimg']:hidden"));
        //console.log($("div[id^='bfimg']:visible").length);
        info['bfImageSet'] = $("div[id^='bfimg']:visible");
        return info;
    }

    /*
     关闭交易所，如果玩家步数未走完，继续往前走
     */
    function closeExchangeWindow(current_player_turnId){
        if (playerList.playerArray[current_player_turnId].diceRest > 0) {
            var dice_num = playerList.playerArray[current_player_turnId].diceRest;
            //console.log("rest !!!!do sth,", dice_num)
            var move_res = playerList.move(current_player_turnId, dice_num);
            //console.log(move_res);
            if (move_res.eventId > 0){
                //console.log("move_res.eventId > 0")
                ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                $('.info-ratio').text('ratio: ' + ratio);
            }
        }
        $('#putBufferfly').attr('disabled',"true");
        $('#randomDice').attr('disabled',"true");
        $('#manualDice').attr('disabled',"true");
        exeOkFlag = true;
        $('.exchange input[name="slider"]').val(0);
        $(".exchange-main-screen").text("0.00");
        $('.exchange').hide();
    }
	init();
    addAction();
}

/*
 删除array中的元素
 */
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};