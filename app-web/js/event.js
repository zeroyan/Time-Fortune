function TFEvent(e_id, w, h){
    this.id = e_id;
    this.img = $('<div id="eventImg' + this.id + '" class="event-image" style="background:url(images/e' + this.id + '.png) no-repeat 0 0; background-size: ' + w + 'px, ' + h + 'px"></div>');
    //this.img = $('<div id="eventImg' + this.id + '" class="event-image" style="background:url(images/e' + this.id + '.png) no-repeat 0 0; background-size: 100px, 100px"></div>');
}


TFEvent.prototype.addAction = function() {
    var imgId = this.id;
    $(this.img).mouseenter(function(){
        var imgPath = 'url(images/e' + imgId + '.png)';
        //console.log(imgPath)
        $('.event').css('background-image', imgPath);
        //$('.event').css('background-color', "black");
    });
};

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
            player.token += Math.round(player.balance/ratio);
            player.balance = 0;
            player.updateInfoBar();
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