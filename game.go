/*
TimeFortune in DoraHacks Hackathon
Based on the InkChain
Team member:
	Mao; B; 7; Tianjun; Dragon Zhang; Zeroyan
*/

package main
import(
	"fmt"
	"sync"
	"time"
	"strconv"
	"encoding/json"
	"github.com/inklabsfoundation/inkchain/core/chaincode/shim"
	pb "github.com/inklabsfoundation/inkchain/protos/peer"
)

var AGameBoard = NewLiveBoard()

var round_num int = 8
var DiceArr []int 
var roundSize int = 10


const (
	BoardPrefix  = "Board_"
	ButterflyPrefix = "Butterfly_"
	AssetPrefix = "ASSET_"
)

func NewBoard() BoardInfoSchema {
	return BoardInfoSchema{
		Players:make([]PlayerSchema, 0),
		Rate:0.0,
		Butterflies:make([]ButterflySchema, 0),
		WhichRound:0,
		WhoseTurn:0,
	}
}

/*Data Struct*/
type LiveBoard struct {
	Lock *sync.RWMutex
	Turn2Board map[int]BoardInfoSchema
}

func NewLiveBoard() *LiveBoard {
	return &LiveBoard{
		Lock:new(sync.RWMutex),
		Turn2Board:make(map[int]BoardInfoSchema),
	}
}

func (m *LiveBoard) GetABoardPicture(turn int) (BoardInfoSchema, bool) {
	m.Lock.RLock()
	defer m.Lock.RUnlock()
	b := NewBoard()
	if val, ok := m.Turn2Board[turn]; ok {
		return val, true
	}
	return b, false
}

func (m *LiveBoard) SetABoardPicture(turn int, b BoardInfoSchema) {
	m.Lock.Lock()
	defer m.Lock.Unlock()
	m.Turn2Board[turn] = b
}

func MakeTimestamp() int64 {
    return time.Now().UnixNano() / int64(time.Second)
}

func (m *LiveBoard) ProduceButterfly(turn int, k int, pos int) (BoardInfoSchema, int64, bool) {
	m.Lock.Lock()
	defer m.Lock.Unlock()
	if val, ok := m.Turn2Board[turn]; ok {
		code := MakeTimestamp()
		return val, code, true
	}
	return NewBoard(), int64(-1), false
}

func (m *LiveBoard) UseButterfly(b BoardInfoSchema, turn int) {
	m.Lock.Lock()
	defer m.Lock.Unlock()
	m.Turn2Board[turn] = b
}

func MagicDice(turn int, point int) {
	DiceArr[turn] = point
}

/*Smart Contract*/
type MaoChainCode struct {
}

func main() {
	err := shim.Start(new(MaoChainCode))
	if err != nil {
		fmt.Println(err)
	}
}

func (c *MaoChainCode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	var dicearr []int
	for i := 0; i < round_num * 200; i++ {
		dice_point := 2
		dicearr = append(dicearr, dice_point)
	}
	DiceArr = dicearr

	return shim.Success([]byte("Success start!"))
}

const (
	//function
	SynchronStatus = "synchronStatus"
	PutAButterfly = "putAButterfly"
	Return2AButterfly = "return2AButterfly"
	GetADice = "getADice"
	UseAMagicDice = "useAMagicDice"
)

func (c *MaoChainCode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()

	switch function {
		case SynchronStatus:
			if len(args) != 1 {
				return shim.Error("SynchronStatus, Incorrect number of arguments. Expecting 1")
			}
			return c.UpdateBoard(stub, args)
		case PutAButterfly:
			if len(args) != 1 {
				return shim.Error("PutAButterfly, Incorrect number of arguments. Expecting 1")
			}
			return c.GenerateAButterfly(stub, args)
		case Return2AButterfly:
			if len(args) != 1 {
				return shim.Error("Return2AButterfly, Incorrect number of arguments. Expecting 1")
			}
			return c.GenerateAPicture(stub, args)
		case GetADice:
			if len(args) != 2 {
				return shim.Error("GetADice, Incorrect number of arguments. Expecting 2")
			}
			return c.GenerateADice(stub, args)
		case UseAMagicDice:
			if len(args) != 3 {
				return shim.Error("UseAMagicDice, Incorrect number of arguments. Expecting 3")
			}
			return c.GenerateAMagicDice(stub, args)
	}
	return shim.Error("function is valid:" + function)
}

type BoardInfoSchema struct {
	Butterflies []ButterflySchema `json:"Butterflies"`
	Players []PlayerSchema `json:"Players"`
	Rate float64 `json:"Rate"`
	WhoseTurn int `json:"WhoseTurn"`
	WhichRound int `json:"WhichRound"`
}

type ButterflySchema struct {
	Position int `json:"Position"`
	Round int `json:"Round"`
	Owner int `json:"Owner"` 
}

type PlayerSchema struct {
	Name int `json:"Name"`
	Position int `json:"Position"`
	Cash float64 `json:"Cash"`
	Bitcoin float64 `json:"Bitcoin"`
}

func (c *MaoChainCode) UpdateBoard(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var dat BoardInfoSchema
	info := string(args[0])
	if err := json.Unmarshal([]byte(info), &dat); err == nil {
		currentStep := dat.WhichRound * len(dat.Players) + dat.WhoseTurn
		tmpstr, err := json.Marshal(dat)
		if err != nil {
			return shim.Error(err.Error())
		}
		str_board_key := BoardPrefix + strconv.Itoa(currentStep)

		err = stub.PutState(str_board_key, tmpstr)
		if err != nil {
			return shim.Error(err.Error())	
		}
	} else {
		fmt.Println(err)
	}
	return shim.Success([]byte("UpdateBoard succeed"))
}

func (c *MaoChainCode) GenerateAButterfly(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var dat BoardInfoSchema
	info := string(args[0])
	if err := json.Unmarshal([]byte(info), &dat); err == nil {
		currentStep := dat.WhichRound * len(dat.Players) + dat.WhoseTurn
		tmpstr, err := json.Marshal(dat)
		if err != nil {
			return shim.Error(err.Error())
		}

		butterfly_key := ButterflyPrefix + strconv.Itoa(currentStep)
		err = stub.PutState(butterfly_key, tmpstr)
		if err != nil {
		 	return shim.Error(err.Error())
		 }

		code := MakeTimestamp()
		//LiveCode2Board.Set(code, dat)
		str_board_key := BoardPrefix + strconv.FormatInt(code,10)

		err = stub.PutState(str_board_key, tmpstr)
		if err != nil {
			return shim.Error(err.Error())
		}

		tmpstr2, err := json.Marshal(dat)
		if err != nil {
			return shim.Error(err.Error())
		}
		err = stub.PutState(str_board_key, tmpstr2)
		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success([]byte(strconv.FormatInt(code, 10)))
	} else {
		fmt.Println(err)
	}
	return shim.Error("PutAButterfly failed")
	//return shim.Error([]byte("PutAButterfly failed"))
}

func (c *MaoChainCode) GenerateAPicture(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	code := args[0]

	oldBoard, err := stub.GetState(code)
	if err != nil {
		fmt.Println("wrongs")
	}
	return shim.Success([]byte(string(oldBoard)))
}

func (c *MaoChainCode) GenerateADice(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	round, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	turn, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}

	var diceIdx int = round * roundSize + turn
	if diceIdx >= len(DiceArr) {
		diceIdx = diceIdx % len(DiceArr)
	}
	dice := DiceArr[diceIdx]

	fmt.Println("Generate A Dice: " + strconv.Itoa(dice))
	return shim.Success([]byte(strconv.Itoa(dice)))

}

func (c *MaoChainCode) GenerateAMagicDice(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	round, err := strconv.Atoi(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	turn, err := strconv.Atoi(args[1])
	if err != nil {
		return shim.Error(err.Error())
	}
	dicePoint, err := strconv.Atoi(args[2])
	if err != nil {
		return shim.Error(err.Error())
	}

	var diceIdx int = round * roundSize + turn
	if diceIdx >= len(DiceArr) {
		diceIdx = diceIdx % len(DiceArr)
	}
	DiceArr[diceIdx] = dicePoint
	return shim.Success([]byte("Success!"))
}

var LiveCode2Board = NewCode2Board()

type Code2Board struct {
	Lock *sync.RWMutex
	C2B map[int64]BoardInfoSchema
}

func NewCode2Board() *Code2Board {
	return &Code2Board{
		Lock:new(sync.RWMutex),
		C2B:make(map[int64]BoardInfoSchema),
	}
}

func (m *Code2Board) Set(k int64, b BoardInfoSchema) {
	m.Lock.Lock()
	defer m.Lock.Unlock()
	m.C2B[k] = b
}

func (m *Code2Board) Get(k int64) (BoardInfoSchema, bool) {
	m.Lock.RLock()
	defer m.Lock.RUnlock()
	if val, ok := m.C2B[k]; ok {
		return val, true
	}
	return BoardInfoSchema{}, false
}

type GetAButterflySchema struct {
	Code string `json:"Code"`
}

type GetADiceSchema struct {
	WhoseTurn int `json:"WhoseTurn"`
	WhichRound int `json:"WhichRound"`
}

type UseAMagicDiceSchema struct {
	WhoseTurn int `json:"WhoseTurn"`
	WhichRound int `json:"WhichRound"`
	DicePoint int `json:"DicePoint"`
}


