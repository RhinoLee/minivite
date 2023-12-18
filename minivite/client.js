// client websocket
const ws = new WebSocket("ws://localhost:5566")

ws.addEventListener("open", () => {
  console.log("client ws connected !!!")
})
