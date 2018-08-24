/**
	Game控制类的构造函数
 */
function Game() {
    console.log("Game...");
    var playerList;
	var gridList = [];
	var personMap = {};
	var blockMap = {};
	var map = new Map();
	//var blockView = new BlockView(mapView, imageCache['map']);
	//var extraView = new ExtraView();

    var gameover_round = 8;
    var round_ind = 0;
    var bf_number = 0;
    var ratio = 1.0;
    //var my_id = 0;
    var bf_cache = {};
    var bf_queue = [];
    var exeOkFlag = false;


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
            }
        ];
        return players
    }
    function addAction() {
        $('#randomDice').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var current_game_turn = Math.floor(round_ind / playerList.length);
            var current_player = playerList.playerArray[current_player_turnId];
            var _diceCache = current_player.diceCache;
            var dice_num;
            if (current_game_turn < _diceCache.length){
                console.log('_diceCache', _diceCache, round_ind, _diceCache.length)
                dice_num = _diceCache[current_game_turn];
                //console.log('_diceCache dice:', dice_num)
            }else{
                console.log('random dice', _diceCache)
                dice_num = Math.floor(Math.random() * 4 + 1);
                //dice_num = 1;
                playerList.playerArray[current_player_turnId].diceCache.push(dice_num);
            }
            $("#dice"+dice_num).toggle(200);
            console.log("click randomDice", dice_num, round_ind, current_player_turnId);
            var move_res = playerList.move(current_player_turnId, dice_num);

            console.log(move_res);
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
            //console.log("new list", playerList.playerArray)
            //exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId]);

            //var eventId = map.eventArray[]

            //var dice_num = Math.floor(Math.random() * 6 + 1);
            //playerList.playerArray[current_player_turnId].diceCache.push();
            //if (current_player_turnId == my_id) {
            //    var dice_num = Math.floor(Math.random() * 6 + 1);
            //    console.log("click randomDice", dice_num, round_ind, current_player_turnId);
            //}else {
            //    console.log("not your turn");
            //}
        });

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
                //var current_player_turnId  = round_ind % playerList.length;
                var current_game_turn = Math.floor(round_ind / playerList.length);
                console.log("turnOver info: ", parseInt(current_game_turn), round_ind)

                $('.info-round').text("Turn number: " + current_game_turn);
                $('#putBufferfly').removeAttr("disabled");
                $('#randomDice').removeAttr("disabled");
                $('#manualDice').removeAttr("disabled");
                exeOkFlag = false;

            }else{
                alert('请先完成操作');
            }
            //$('.exchange').hide();

            if (round_ind == playerList.length * gameover_round){
                alert("GameOver，自行计算谁赢了");
                window.location.reload();
            }
        });
        $('#putBufferfly').click(function(){
            console.log('put butterfly')
            var current_player_turnId  = round_ind % playerList.length;
            console.log("playerid:", current_player_turnId)
            var current_play = playerList.playerArray[current_player_turnId];
            console.log("current_play bf num:", current_play.bufferfly)
            if (current_play.bufferfly > 0) {
                playerList.putButterfly(current_player_turnId);
                //var playerBfId = current_player_turnId + '/' + current_play.bufferfly;
                var playerBfId = current_player_turnId;
                //console.log("playerBfId", playerBfId);
                current_play.bufferfly--;
                $('.player'+current_player_turnId+'>.player-bf').text("蝴蝶印记: " + current_play.bufferfly);
                var res = getCurrentGameInfo(current_play.bufferfly + 1);
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
                console.log("bf_queue = ", bf_queue);

                //bf_cache[playerBfId] = getCurrentGameInfo();
                //bf_cache[playerBfId]['bfId'] = current_play.bufferfly + 1;
                //bf_cache[current_player_turnId][current_play.bufferfly] = getCurrentGameInfo();
                bf_number++;
            }else{
                console.log("不能再放蝴蝶印记了");
            }
            $('#putBufferfly').attr('disabled',"true");
            console.log(bf_cache)
        });
        $('#backHistory').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var playerTimeHistoryNumber = playerList.playerArray[current_player_turnId].getTimeHistoryNumber();
            if(current_player_turnId in bf_cache && playerTimeHistoryNumber > 0){
                var backGameInfoList = bf_cache[current_player_turnId];
                var backGameInfo, choseBfId;
                for (var bfId in backGameInfoList){
                    console.log(bfId, backGameInfoList[bfId]);
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
                        $('.player'+current_player_turnId+'>.player-bh').text("时光回溯: " + playerList.playerArray[current_player_turnId].backHistory);
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
                            console.log(backGameInfoList)
                            var _this_bf_2 = $("#bfimg"+current_player_turnId+'_'+bfId_2);
                            $(_this_bf_2).css({'background-size': "20px",
                                                'width': '20px',
                                                'height': '20px'});
                            $(_this_bf_2).unbind("click");
                        }
                    });
                }
            }else{
                console.log("你不可时光回溯");
            }
        });
        $('#manualDice').click(function(){
            $('.manualDiceNum').toggle(100);
        });
        $('.manualDiceNum span').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            if (player.manualDice > 0){
                $(this).parent().hide(100);
                var dice_num = $(this).text()-0;
                $("#dice"+dice_num).toggle(200);
                //var current_player_turnId  = round_ind % playerList.length;
                //var current_game_turn = Math.floor(round_ind / playerList.length);
                var current_player = playerList.playerArray[current_player_turnId];
                //var _diceCache = current_player.diceCache;
                player.manualDice--;
                player.diceCache.push(dice_num);
                console.log("click randomDice", dice_num, round_ind, current_player_turnId);

                var move_res = playerList.move(current_player_turnId, dice_num);
                $('.player'+current_player_turnId+'>.player-md').text("遥控骰子: " + player.manualDice);
                console.log(move_res);
                if (move_res.eventId > 0){
                    ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                    $('.info-ratio').text('ratio: ' + ratio);

                    $('#putBufferfly').attr('disabled',"true");
                    $('#randomDice').attr('disabled',"true");
                    $('#manualDice').attr('disabled',"true");
                    exeOkFlag = true;
                }


                //var move_res = playerList.move(current_player_turnId, dice_num);
                //$('.player'+current_player_turnId+'>.player-md').text("遥控骰子: " + player.manualDice);
                //console.log(move_res);
                //ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                //$('.info-ratio').text('ratio: ' + ratio);
                //
                //$('#putBufferfly').attr('disabled',"true");
                //$('#randomDice').attr('disabled',"true");
                //$('#manualDice').attr('disabled',"true");
                //exeOkFlag = true;
                setTimeout(function(){
                    $("#dice"+dice_num).toggle(200);
                }, 1000);
            }else{
                console.log("你没有可用的遥控骰子");
            }
        });
        $('.exchange #cancel').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            closeExchangeWindow(current_player_turnId);

            //$('.exchange').hide();
        });
        $('.exchange #ok').click(function(){
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            var buy_account = $('.exchange input[name="buy"]').val();
            var sell_account = $('.exchange input[name="sell"]').val();
            if (buy_account != 0){
                //var change_token = (buy_account / 100 * player.balance * ratio).toFixed(2);
                player.buy(buy_account, ratio);
            }else if (sell_account != 0){
                player.sell(sell_account, ratio);
            }
            closeExchangeWindow(current_player_turnId);
        });
        $('.exchange input[name="buy"]').change(function(){
            $('.exchange input[name="sell"]').val(0);
            $("#p_sell").text("卖出时光币: " + 0);
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            var _balance = player.balance;
            var change_token = ($(this).val()/100 * _balance * ratio).toFixed(2);
            $("#p_buy").text("买入时光币: " + change_token);
            //console.log($(this).val()/100 * _balance, ratio, change_token)
        });
        $('.exchange input[name="sell"]').change(function(){
            $('.exchange input[name="buy"]').val(0);
            $("#p_buy").text("买入时光币: " + 0);
            var current_player_turnId  = round_ind % playerList.length;
            var player = playerList.playerArray[current_player_turnId];
            var _token = player.token;
            var change_balance = ($(this).val()/100 * _token / ratio).toFixed(2);
            $("#p_sell").text("卖出时光币: " + change_balance);
            //console.log($(this).val()/100 * _balance, ratio, change_token)
        })
    }

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

    function closeExchangeWindow(current_player_turnId){
        if (playerList.playerArray[current_player_turnId].diceRest > 0) {
            var dice_num = playerList.playerArray[current_player_turnId].diceRest;
            console.log("rest !!!!do sth,", dice_num)
            var move_res = playerList.move(current_player_turnId, dice_num);

            console.log(move_res);
            if (move_res.eventId > 0){
                console.log("move_res.eventId > 0")
                ratio = exeAction(move_res.eventId, ratio, playerList.playerArray[current_player_turnId], playerList.playerArray);
                $('.info-ratio').text('ratio: ' + ratio);
            }
        }
        $('#putBufferfly').attr('disabled',"true");
        $('#randomDice').attr('disabled',"true");
        $('#manualDice').attr('disabled',"true");
        exeOkFlag = true;
        $('.exchange').hide();
        $('.exchange input[name="buy"]').val(0);
        $('.exchange input[name="sell"]').val(0);
    }

	init();
    addAction();
    //start();
}


Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};