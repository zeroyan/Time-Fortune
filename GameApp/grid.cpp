#include "grid.h"

Grid::Grid()
{
  isExchange = false;
  isStart = false;
  hasMarker = false;
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
