import http from "http"
import color from "picocolors"
import connect from "connect"
import chokidar from "chokidar"
import { WebSocketServer } from "ws"
import { indexHTMLMiddleware, replaceImportMiddleware } from "./middlewares"
import { getRelativePath } from "./utils"

const middleware = connect()
const { PORT_HTTP, PORT_WS, PROJECT_NAME } = process.env
const WATCH_LIST = ["index.html", "src/*.js", "src/*.css"]

const createWSServer = () => {
  const server = new WebSocketServer({ port: PORT_WS })

  server.on("connection", (ws) => {
    console.log(`${color.green(`WebSocket Connected!!!`)}`)

    ws.send(
      JSON.stringify({ type: "message", content: `${PROJECT_NAME} connected!` })
    )

    // watcher
    const watcher = chokidar.watch(WATCH_LIST)
    watcher.on("change", (file) => {
      const msgObj = {
        type: "change",
        file: getRelativePath(file),
      }

      ws.send(JSON.stringify(msgObj))
    })

    ws.on("message", (data) => {
      console.log("Received: %s", data)
    })
  })
}

middleware.use(replaceImportMiddleware)
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
