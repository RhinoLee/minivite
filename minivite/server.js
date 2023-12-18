import http from "http"
import color from "picocolors"
import connect from "connect"
import { indexHTMLMiddleware } from "./middleware"

const middleware = connect()
const { PORT_HTTP, PROJECT_NAME } = process.env

middleware.use(indexHTMLMiddleware)

function createServer() {
  http.createServer(middleware).listen(PORT_HTTP)

  console.log(
    `${color.red(PROJECT_NAME)} server ON! ${color.green(
      `http://localhost:${PORT_HTTP}`
    )}`
  )
}

export { createServer }
