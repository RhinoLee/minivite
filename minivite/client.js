// client websocket
const ws = new WebSocket("ws://localhost:5566")

ws.addEventListener("open", ({ target: s }) => {
  s.addEventListener("message", ({ data }) => {
    console.log(data)
  })

  s.addEventListener("close", () => {
    console.log("Closed")
  })
  console.log("client ws connected !!!")
})
