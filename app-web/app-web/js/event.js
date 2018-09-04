/*
 所有事件说明
 0 -> down; 1 -> up
 */
var EventDescription = [
    ['时光电子货币创始人伊万被爆卷款跑路，比率下跌80%', 0],
    ['时光电子货币钱包出现BUG，被窃大量资产，比率狂跌60%', 0],
    ['时光电子货币资金大量出逃，比率下跌20%', 0],
    ['时光电子货币项目推迟一个月，比率下跌10%', 0],
    ['时光电子货币落地项目《时光大富翁3.0》上线，比率上浮500%', 1],
    ['时光电子货币创始人伊万与搞神洽谈合作并合影，比率上浮100%', 1],
    ['时光电子货币创始人伊万与V神洽谈合作并合影，比率上浮80%', 1],
    ['时光电子货币创始人伊万在韩国宣讲，得到韩国大妈热捧，比率上浮50%', 1],
    ['时光电子货币被银色财经扩散，比率上浮20%', 1],
    ['时光电子货币上线雷币网，比率上浮10%', 1],
    ['时光电子货币空投Token，恭喜你获得1000枚时光币', 1],
    ['误入时光电子货币钓鱼网站，账号被窃，丢失全部时光币', 0],
    ['被时光电子货币的潜力所吸引，以当前比率将全部现金转换为时光币', 1],
    ['时光电子货币空投Token，恭喜你获得500枚时光币', 1],
    ['时光电子货币发放糖果，所有人获得当前时光币20%的时光币', 1],
    ['时光电子货币开源，你贡献代码后获得300枚时光币', 1],
    ['你参加黑客松获得了比赛一等奖，获得奖金7000元（税后）', 1],
    ['你参加黑客松失利，吃海鲜缓解心情，花费1500元', 0],
    ['你参加黑客松，获得了天使融资，产品经理给你3000元奖金', 1],
    ['你坐飞机前来北京参加黑客松，然而飞机晚点，比赛没赶上，花费3500元购买机票', 0],
    ['你凭借高深的沟通交流技巧，忽悠了五名天才选手，参加黑客松获得比赛二等奖，获得奖金4500元（税后）', 1],
    ['你听信韭菜的消息，被忽悠购买了空气币，亏损当前现金的80%', 0],
    ['你成功做时光币波段获利，获得当前现金的20%', 1],
    ['你做时光币波段失败，亏损当前现金的30%', 0],
    ['你听信韭菜收割机的消息，被忽悠以当前利率卖掉全部时光币', 0]
];

/*
 事件类初始化
 */
function TFEvent(e_id){
    this.id = e_id;
    this.description = EventDescription[e_id-1][0];
    this.arrow = EventDescription[e_id-1][1];
    this.img = $('<div class="event-image" id="eventImg' + this.id + '"></div>');
}

TFEvent.prototype.addAction = function() {
    var event = this;
    $(this.img).mouseenter(function(){
        if (event.arrow) {
            $('.arrow').css("background-image", "url(./images/arrow_up.png)");
        }else {
            $('.arrow').css("background-image", "url(./images/arrow_down.png)");
        }
        $('.event-content').text(event.description);
    });
};

/*
 执行事件，修改游戏信息
 */
var exeAction = function(eventId, ratio, player, playerArray){
    //console.log(ratio, player)
    var pointPointer = 2;
    switch (eventId){
        case 1:
            ratio = (ratio * (1 - 0.8)).toFixed(pointPointer);
            break;
        case 2:
            ratio = (ratio * (1 - 0.6)).toFixed(pointPointer);
            break;
        case 3:
            ratio = (ratio * (1 - 0.2)).toFixed(pointPointer);
            break;
        case 4:
            ratio = (ratio * (1 - 0.1)).toFixed(pointPointer);
            break;
        case 5:
            ratio = (ratio * (1 + 5)).toFixed(pointPointer);
            break;
        case 6:
            ratio = (ratio * (1 + 1)).toFixed(pointPointer);
            break;
        case 7:
            ratio = (ratio * (1 + 0.8)).toFixed(pointPointer);
            break;
        case 8:
            ratio = (ratio * (1 + 0.5)).toFixed(pointPointer);
            break;
        case 9:
            ratio = (ratio * (1 + 0.2)).toFixed(pointPointer);
            break;
        case 10:
            ratio = (ratio * (1 + 0.1)).toFixed(pointPointer);
            //ratio = Math.round(ratio * (1 + 0.1));
            break;
        case 11:
            player.token += 1000;
            player.updateInfoBar();
            break;
        case 12:
            player.token = 0;
            player.updateInfoBar();
            break;
        case 13:
            for (var i in playerArray){
                playerArray[i].token += Math.round(playerArray[i].balance / ratio);
                playerArray[i].balance = 0;
                playerArray[i].updateInfoBar();
            }
            break;
        case 14:
            player.token += 500;
            player.updateInfoBar();
            break;
        case 15:
            for (var i in playerArray){
                playerArray[i].token = Math.round(playerArray[i].token * 1.2);
                playerArray[i].updateInfoBar();
            }
            break;
        case 16:
            player.token += 300;
            player.updateInfoBar();
            break;
        case 17:
            player.balance += 7000;
            player.updateInfoBar();
            break;
        case 18:
            player.balance -= 1500;
            if (player.balance < 0) player.balance = 0;
            player.updateInfoBar();
            break;
        case 19:
            player.balance += 3000;
            player.updateInfoBar();
            break;
        case 20:
            player.balance -= 3500;
            if (player.balance < 0) player.balance = 0;
            player.updateInfoBar();
            break;
        case 21:
            player.balance += 4500;
            player.updateInfoBar();
            break;
        case 22:
            //player.balance *= Math.round (1 - 0.8);
            player.balance = Math.round(player.balance * (1 - 0.8));
            player.updateInfoBar();
            break;
        case 23:
            player.balance = Math.round(player.balance * (1 + 0.2));
            player.updateInfoBar();
            break;
        case 24:
            player.balance = Math.round(player.balance * (1 - 0.3));
            player.updateInfoBar();
            break;
        case 25:
            player.balance += Math.round(ratio * player.token);
            player.token = 0;
            player.updateInfoBar();
            break;
        default:
            console.log("未知穿越来的事件");
            break
    }
    return ratio;
};