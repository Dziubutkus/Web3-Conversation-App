const xmtp_l = require('@xmtp/xmtp-js');
const ethers = require('ethers');



async function monitorConvo(convo){
  for await (const message of await convo.streamMessages()) {
    process_message(message, convo);
  }
}

async function process_message(message, convo){
  console.log(`[${message.senderAddress}]: ${message.content}`)

  if(message.content === "!join"){
    // Add eth address to subscription list
    await convo.send('Successfully joined!')
  }else if(message.content === "!leave"){
    // Remove eth address from subscription list
    await convo.send('Successfully left!')
  }else{
    // process relay and send message to everyone else on the relay list
  }
}

async function main(){

  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");

  const privateKey = '0xab3cbc12c6e955b8718edcdc616f67953e2b77091d826aeeec42fe4521b3f716'
  //0x4993882b64abfb6e1ee5bA8548910b76Ef0008e0

  //const wallet = ethers.Wallet.createRandom()
  var wallet = new ethers.Wallet(privateKey, provider);
  console.log(wallet);

  const xmtp = await xmtp_l.Client.create(wallet)

  /*
  const conversation = await xmtp.conversations.newConversation(
    '0x6064934407Bb86f52b75D0ae760a55A4777eA5C4'
  )
  // Load all messages in the conversation
  const messages = await conversation.messages()
  // Listen for new messages in the conversation
  for await (const message of await conversation.streamMessages()) {
    process_message(message, conversation);
  }
  */
  const convos = (await xmtp.conversations.list()).filter(
    (conversation) => !conversation.context?.conversationId
  );
  convos.map((convo) => monitorConvo(convo));
}
main();