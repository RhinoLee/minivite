import http from "http"
import color from "picocolors"
import connect from "connect"
import { WebSocketServer } from "ws"
import { indexHTMLMiddleware } from "./middleware"

const middleware = connect()
const { PORT_HTTP, PORT_WS, PROJECT_NAME } = process.env

const createWSServer = () => {
  const server = new WebSocketServer({ port: PORT_WS })

  server.on("connection", (ws) => {
    console.log(`${color.green(`WebSocket Connected!!!`)}`)

    ws.on("message", (data) => {
      console.log("Received: %s", data)
    })
  })
}

middleware.use(indexHTMLMiddleware)

function createServer() {
  http.createServer(middleware).listen(PORT_HTTP)

  createWSServer()

  console.log(
    `${color.red(PROJECT_NAME)} server ON! ${color.green(
      `http://localhost:${PORT_HTTP}`
    )}`
  )
}

export { createServer }