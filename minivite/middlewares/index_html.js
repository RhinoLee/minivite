import path from "path"
import { getFilePathAndContentType } from "../utils.js"

const indexHTMLMiddleware = async (req, res) => {
  const { filePath, contentType } = getFilePathAndContentType(req.url)

  try {
    const file = Bun.file(filePath)
    let content = await file.text()

    if (path.basename(filePath) === "index.html") {
      const regex = /(<head>)([\s\S]*?<\/head>)/i
      const match = content.match(regex)
      const clientScript = `<script src="./minivite/client.js"></script>`

      if (match) {
        content = content.replace(match[0], match[1] + clientScript + match[2])
      }
    }

    res.writeHead(200, { "Content-Type": contentType })
    res.end(content)
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" })
    res.end("No such file or directory")
  }
}

export { indexHTMLMiddleware }
