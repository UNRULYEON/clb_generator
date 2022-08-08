import express from "express"
import path from "path"
import fs from 'fs'
import bodyParser from "express"
import stream from 'stream'
// @ts-ignore
import emojiUnicode from "emoji-unicode"
import { createCanvas, loadImage } from "canvas"
import axios from "axios"

const app = express()
const port = 8080

app.use(bodyParser.json())

const canvas_width = 1600
const canvas_height = 1600

app.use("/", express.static(path.join(__dirname, "client")))

app.post("/api/generate-cover", async (req, res) => {
  const unicodes = req.body.content as string[]
  const backgroundColor = req.body.backgroundColor
  const canvas = createCanvas(canvas_width, canvas_height)
  const ctx = canvas.getContext("2d")

  if (!unicodes.some(unicode => unicode.length > 0)) {
    // KANYE
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const buffer = canvas.toBuffer()
    res.setHeader('Content-disposition', 'attachment; filename="DONDA.png"');
    res.setHeader('Content-type', 'image/png');
    return res.end(buffer)
  }

  const emoji_array: string[] = []

  unicodes.map((unicode) => {
    if (unicode !== "" || unicode.length > 0) {
      // Code_points are basically the raw emoji_urls
      // for example: 1f469-200d-1f393
      const code_points: string = emojiUnicode(unicode)
      const code_points_joined = code_points.split(" ").join("-")
      const path = `${code_points_joined}.png`

      if (emoji_array.length <= 11) {
        emoji_array.push(path)
      }
    } else {
      emoji_array.push("")
    }
  })

  // DRAKE
  // isWhiteBackground ? ctx.fillStyle = "white" : ctx.fillStyle = "black"
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const locations = [
    { x: 149, y: 189 },
    { x: 498, y: 189 },
    { x: 846, y: 189 },
    { x: 1195, y: 189 },
    { x: 149, y: 665 },
    { x: 498, y: 665 },
    { x: 846, y: 665 },
    { x: 1195, y: 665 },
    { x: 149, y: 1141 },
    { x: 498, y: 1141 },
    { x: 846, y: 1141 },
    { x: 1195, y: 1141 }
  ]

  await Promise.all(
    emoji_array.map(async (emoji_url, index) => {
      if (emoji_url !== "" || emoji_url.length > 0) {
        await axios
          .get(`https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-160/${emoji_url}`, {
            responseType: "arraybuffer"
          })
          .then((r) => {
            const emoji_buffer = Buffer.from(r.data, "binary")

            loadImage(emoji_buffer)
              .then((image) => ctx.drawImage(image, locations[index].x, locations[index].y, 270, 270))
              .catch((e) => {
                console.log(e)
                return res.sendStatus(500)
              })
          })
          .catch((e) => {
            // console.log(e)
            return res.sendStatus(404)
          })
      }
    })
  )

  const buffer = canvas.toBuffer()
  const readStream = new stream.PassThrough()
  readStream.end(buffer);
  res.setHeader('Content-disposition', 'attachment; filename="CLB.png"');
  res.setHeader('Content-type', 'image/png');
  // console.log(readStream.pipe(res))
  readStream.pipe(res);

})

app.listen(port, () => console.log(`server started at http://localhost:${port}`))
