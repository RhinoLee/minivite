// client websocket
const ws = new WebSocket("ws://localhost:5566")

ws.addEventListener("open", ({ target: s }) => {
  s.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data)

    switch (result.type) {
      case "message":
        console.log(result.content)
        break
      case "change":
        const { file } = result

        if (file.endsWith("css")) {
          // 替換 style 內容
          fetch(file)
            .then((data) => data.text())
            .then((content) => {
              console.log(content)
              const el = document.querySelector("style#hot")
              if (el) {
                el.textContent = content
              } else {
                const el = document.createElement("style")
                el.id = "hot"
                el.textContent = content
                document.querySelector("head").appendChild(el)
              }
            })
            .catch((err) => console.log(err))
        } else {
          // page reload
          window.location.reload()
        }

        break
    }
  })

  s.addEventListener("close", () => {
    console.log("Closed")
  })
  console.log("client ws connected !!!")
})
