const xmtp_l = require('@xmtp/xmtp-js');
const ethers = require('ethers');
const { join } = require('path');


var joined_addresses = []

function shortAddress(address){
  return address.substring(0,6) + "..."+address.substring(address.length-4, address.length);
}

async function monitorConvo(convo){
  console.log("Listening to "+shortAddress(convo.peerAddress));
  for await (const message of await convo.streamMessages()) {
    process_message(message, convo);
  }
}

async function process_message(message, convo){
  console.log(`[${message.senderAddress}]: ${message.content}`)

  if(message.content === "!join"){
    if(joined_addresses.includes(message.senderAddress)){
      await convo.send('You are already subscribed to this channel.')
    }else{
      // Add eth address to subscription list
      //await convo.send('Successfully joined!')
      joined_addresses.push(message.senderAddress)
      broadcast_message(bot_address, "Info", shortAddress(message.senderAddress) + " has joined the channel");
    }
  }else if(message.content === "!leave"){
    if(joined_addresses.includes(message.senderAddress)){
      // Remove eth address from subscription list
      //await convo.send('Successfully left!')
      joined_addresses = joined_addresses.filter(e => e !== message.senderAddress);
      broadcast_message(bot_address, "Info", shortAddress(message.senderAddress) + " has left the channel");
    }else{
      await convo.send('You are already unsubscribed from this channel.')
    }
  }else{
    // Check if bot message
    if(message.senderAddress != bot_address){
      // Check if user has joined
      if(joined_addresses.includes(message.senderAddress)){
        broadcast_message(message.senderAddress, shortAddress(message.senderAddress), message.content);
      }
    }
  }
}

function broadcast_message(sender, sender_name, content){

  joined_addresses.forEach(element => {
    if(element != sender){
      xmtp.conversations.newConversation(
        element
      ).then((tempConvo) => {
        tempConvo.send("["+sender_name+"] "+content)
      })
    }
  });
}

var convo_mapping = [];
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
const privateKey = '0xab3cbc12c6e955b8718edcdc616f67953e2b77091d826aeeec42fe4521b3f716'
//0x4993882b64abfb6e1ee5bA8548910b76Ef0008e0
//const wallet = ethers.Wallet.createRandom()
var wallet = new ethers.Wallet(privateKey, provider);
const bot_address = wallet.address;
console.log(wallet);

var xmtp = null;
//map_convos();

var convos_array = []

async function map_convos(){

  if(xmtp == null){
    xmtp = await xmtp_l.Client.create(wallet);
  }

  const convos = (await xmtp.conversations.list()).filter(
    (conversation) => !conversation.context?.conversationId
  );
  
  var new_convos = [];

  convos.forEach(element => {
    //console.log(element);
    if(!convos_array.includes(element.peerAddress)){
      //new_convos.push(element);
      monitorConvo(element);
      convos_array.push(element.peerAddress);
    }
  });

  //convo_mapping = convos.map((convo) => monitorConvo(convo));
}

async function looper(){
  map_convos();

  await new Promise(r => setTimeout(r, 1000*10));

  looper();
}
looper();