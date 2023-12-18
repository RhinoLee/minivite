import { getFilePathAndContentType } from "./utils"

const indexHTMLMiddleware = async (req, res) => {
  const { filePath, contentType } = getFilePathAndContentType(req.url)

  try {
    const file = Bun.file(filePath)
    const content = await file.text()
    res.writeHead(200, { "Content-Type": contentType })
    res.end(content)
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" })
    res.end("No such file or directory")
  }
}

export { indexHTMLMiddleware }
