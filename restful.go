package main

import (
	"fmt"
	"encoding/json"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/msp"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/logging"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
    "github.com/kataras/iris"
)
// type WorldState struct {
//     Key  string `json:"key"`
//     Value string `json:"value"`
// }
type DaFuWeng struct {
    BfId string
    Ratio string
    RoundId string
    Players string
    BfImageSet string
}
var (
	cc          = "dafuwengcc"
	user        = "dfwplayer1"
	secret      = "dfwplayer1"
	channelName = "first-channel"
	lvl         = logging.INFO
)


func enrollUser(sdk *fabsdk.FabricSDK) {
	ctx := sdk.Context()
	mspClient, err := msp.New(ctx)
	if err != nil {
		fmt.Printf("Failed to create msp client: %s\n", err)
	}

	_, err = mspClient.GetSigningIdentity(user)
	if err == msp.ErrUserNotFound {
		fmt.Println("Going to enroll user")
		err = mspClient.Enroll(user, msp.WithSecret(secret))

		if err != nil {
			fmt.Printf("Failed to enroll user: %s\n", err)
		} else {
			fmt.Printf("Success enroll user: %s\n", user)
		}

	} else if err != nil {
		fmt.Printf("Failed to get user: %s\n", err)
	} else {
		fmt.Printf("User %s already enrolled, skip enrollment.\n", user)
	}
}

func queryCC(client *channel.Client, fcn string, key string) string {
	var queryArgs = [][]byte{[]byte(key)}
	response, err := client.Query(channel.Request{
		ChaincodeID: cc,
		Fcn:         fcn,
		Args:        queryArgs,
	})

	if err != nil {
		fmt.Println("Failed to query: ", err)
	}

	ret := string(response.Payload)
	fmt.Println("Chaincode status: ", response.ChaincodeStatus)
	fmt.Println("Payload: ", ret)
	return ret
}
func invokeCC(client *channel.Client, fcn string, key string, value string) string {
	fmt.Println("Invoke cc with new value:", value)
	invokeArgs := [][]byte{[]byte(key), []byte(value)}

	res, err := client.Execute(channel.Request{
		ChaincodeID: cc,
		Fcn:         fcn,
		Args:        invokeArgs,
	})

	if err != nil {
		return fmt.Sprintf("Failed to invoke: %+v\n", err)
	}
	fmt.Print("res: ")
        fmt.Println(res)
	return "Succeed to invoke\n"
}
func setupLogLevel() {
	logging.SetLevel("fabsdk", lvl)
	logging.SetLevel("fabsdk/common", lvl)
	logging.SetLevel("fabsdk/fab", lvl)
	logging.SetLevel("fabsdk/client", lvl)
}

func main() {
	fmt.Println("Reading connection profile..")
	c := config.FromFile("./connection-profile.yaml")
	sdk, err := fabsdk.New(c)
	if err != nil {
		fmt.Printf("Failed to create new SDK: %s\n", err)
	}
	defer sdk.Close()
	
	setupLogLevel()
	enrollUser(sdk)

	clientChannelContext := sdk.ChannelContext(channelName, fabsdk.WithUser(user))

	fmt.Println("\n====== Chaincode =========")

	client, _ := channel.New(clientChannelContext)
	//invokeCC(client, "setWorldState", "john", "100")
	//queryCC(client, "getWorldState", "john")

	fmt.Println("===============")
	fmt.Println("Done.")

    app := iris.Default()
	app.Options("/api/*", func(ctx iris.Context) {
        ctx.Header("Access-Control-Allow-Origin", "*")
        ctx.Header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
        ctx.Header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
        ctx.Writef("666")
    })
    app.Get("/api/getButterfly", func(ctx iris.Context) {
	ctx.Header("Access-Control-Allow-Origin", "*")
    ctx.Header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    ctx.Header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	bfId := ctx.URLParam("BfId")
	callback := ctx.URLParam("callback")
	fmt.Println(bfId)
	res := queryCC(client, "getWorldState", bfId)
        ctx.JSON(iris.Map{
            "message": res,
	    "callback": callback,
        })
    })
    app.Post("/api/putBufferfly", func(ctx iris.Context){
	ctx.Header("Access-Control-Allow-Origin", "*")
    ctx.Header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    ctx.Header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	ws := &DaFuWeng{}
	err := ctx.ReadJSON(ws)
	fmt.Println(ws.BfId)
        if err != nil{
            fmt.Println(err.Error())
        }else{
            resBytes,_ := json.Marshal(ws)
            res := invokeCC(client,"setWorldState",ws.BfId,string(resBytes))
	    ctx.Writef(res)
        }
//	res := invokeCC(client, "setWorldState", key, value)
        //ws := &WorldState{}

    })
    // listen and serve on http://0.0.0.0:8080.
    app.Run(iris.Addr(":8080"))
}
