import path from "path"
import fs from "fs"

const ContentTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
}

const getFilePathAndContentType = (filename) => {
  if (filename === "/") {
    filename = "index.html"
  }

  const extname = path.extname(filename).replace(".", "")
  const contentType = ContentTypes[extname] || "text/html"
  const rootPath = process.cwd()
  const filePath = path.join(rootPath, filename)

  return {
    filePath,
    contentType,
  }
}

function getEntryPoint(module) {
  // 處理像是 "dayjs" 這類的 import，要先去 package.json 找真實引入的 file
  if (!module.endsWith(".js")) {
    const packageFile = `./node_modules/${module}/package.json`
    const content = fs.readFileSync(packageFile, "utf8")
    const result = JSON.parse(content)

    return `${module}/${result.main}`
  }

  // 如果是 "lodash-es/has.js" 這類已經明確知道檔案位置的，不處理直接 return
  return module
}

const getRelativePath = (p = __dirname) => {
  const rootPath = process.cwd()
  return path.relative(p, rootPath)
}

const getDepModulePath = (module) => {
  return path.join(getRelativePath(), "node_modules/.minivite/deps", module)
}

export { getFilePathAndContentType, getEntryPoint, getDepModulePath }
