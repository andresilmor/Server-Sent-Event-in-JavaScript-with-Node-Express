const imports = require ('./imports')
const { promisify } = require("util");

const app = imports.EXPRESS();

app.use(imports.CORS());
app.use(imports.BODYPARSER.json());
app.use(imports.BODYPARSER.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

const PORT = 9060;

const uuid = imports.UUID
const redis = imports.REDIS 

let clients = [];
let facts = [];

app.listen(PORT, () => {
  console.log(`SSE at Port ${PORT}`)
})

function panoramicSessionStreamHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    console.log(request.params)
    
    const streamChannel = request.params["streamChannel"]
  
    const userId = request.params["receiverUUID"];

    response.writeHead(200, headers);
  
    const channelSuffix = "careXR_"

    const subscriber = redis.createClient({
      url: imports.REDIS_URL
    });
  
  
    subscriber.on("subscribe", function(channel, count) {
      console.log("Subscribed")
    });
      
    subscriber.on("message", async function(channel, data) {
      const message = JSON.parse(data)
      console.log("----------------------------------------------------")
      console.log("SSE")
      console.log(message)

      let testMessage = {
        state: "streaming",
        focusTarget: message["focusTarget"],
        focusState: message["focusState"],
        focusAlias: message["focusAlias"]
      };
  
      console.log("testMessage")
      console.log(testMessage)
      const testData = `data: ${JSON.stringify(testMessage)}\n\n`; // Must have the 2 \n
     
      response.write(testData);
      console.log("----------------------------------------------------")
    });

    subscriber.unsubscribe();

    subscriber.subscribe(channelSuffix + streamChannel);
    
    let message = {
      state: "connected",
    };

    const data = `data: ${JSON.stringify(message)}\n\n`; // Must have the 2 \n
   
    response.write(data);
    
    request.on('close', () => {
      console.log(`${userId} Connection closed`);
      subscriber.unsubscribe();
      subscriber.quit();

    });

  }
  
  app.get('/vr/panoramic/session/stream/receiver/:receiverUUID/:streamChannel', panoramicSessionStreamHandler);



  function sendEventsToAll(newFact) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newFact)}\n\n`))
  }
  
  async function addFact(request, respsonse, next) {
    const newFact = request.body;
    facts.push(newFact);
    respsonse.json(newFact)
    return sendEventsToAll(newFact);
  }
  
  app.post('/fact', addFact);