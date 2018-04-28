#include "grid.h"

Grid::Grid()
{
  isExchange = false;
  isStart = false;
  hasMarker = false;
  alpha = 1;
  beta = 0;
  gamma = 0;
}

void Grid::insertButterfly(ButterflyMarker &b){
  butterflies.append(b);
}

ButterflyMarker * Grid::hasHisMarker(int playernum){
  for(int i = 0; i < butterflies.size(); ++i){
    if(butterflies[i].whose == playernum){
      return &butterflies[i];
    }
  }
  return nullptr;
}

static void returnXY(int pos, int player, int &x, int &y){
  if(pos < 5){
    x = 870-90*pos;
    y = 520 + 40 * player;
  }
  else if(pos < 10){
    x = 419 - 40 * player;
    y = 1010-90*pos;
  }
  else if(pos < 15){
    x = 90 * pos - 521;
    y = 109 - 40 * player;
  }
  else{
    x = 830 + 40 * player;
    y = 69 + 90 * (pos - 15);
  }
}
