import {
  getFilePathAndContentType,
  getEntryPoint,
  getDepModulePath,
} from "../utils.js"

// 處理從 node_modules import 的 js 路徑
const ExcludeList = ["/minivite/client.js"]
const replaceImportMiddleware = async (req, res, next) => {
  const { url } = req

  if (url.endsWith(".js") && !ExcludeList.includes(url)) {
    const { filePath, contentType } = getFilePathAndContentType(url)
    const file = Bun.file(filePath)
    let content = await file.text()

    const regex = /from ['"](?!\.\/)([^'"]+)['"]/g

    // pre-bundling
    const matches = content.match(regex)
    if (matches) {
      const mod_regex = /['"](?!\.\/)([^'"]+)['"]/

      const modules = matches
        .map((m) => {
          return m.match(mod_regex)[1]
        })
        .map(getEntryPoint)

      Bun.build({
        entrypoints: modules.map((m) => `./node_modules/${m}`),
        outdir: "./node_modules/.minivite/deps",
      })
    }

    content = content.replace(regex, (match, capture) => {
      const entryPoint = getEntryPoint(capture)
      return `from "${getDepModulePath(entryPoint)}"`
      // return `from "./node_modules/.minivite/deps/${entryPoint}"`
    })

    res.writeHead(200, { "Content-Type": contentType })
    res.end(content)
  }
  next()
}

export { replaceImportMiddleware }
