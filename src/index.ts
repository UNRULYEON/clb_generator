import express from 'express'
import { EmojiData } from 'emoji-data-ts'
// @ts-ignore
import emojiUnicode from 'emoji-unicode'
// @ts-ignore
import toEmoji from 'emoji-name-map'    
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

import axios from 'axios'

const app = express()
const port = 8080
const emoji = new EmojiData()

const canvas_width = 1600
const canvas_height = 1600


app.get("/:emoji_unicodes?", async (req, res) => {
  const unicodes = req.params.emoji_unicodes
	const canvas = createCanvas(canvas_width, canvas_height)
	const ctx = canvas.getContext('2d')
	
	// 👩‍🎓
	// console.log(emojiUnicode(unicodes))

	if (!unicodes) {
		// Kanye
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const stream = canvas.toBuffer()
		res.writeHead(200, { 'Content-Type': `image/png` })
		return res.end(stream)
	}

  const unicode_array: string[] = unicodes.split('')

	const emoji_array: string[] = []
	
	for (let i = 0; i < 24; i += 2) {
    // unicode first and second element into one const !!(change so multiple variations still come into one unicode)
		const unicode = `${unicode_array[i]}${unicode_array[i+1]}`
		
    // replace emoji to string
    const emoji_string = emoji.replaceEmojiToStr(unicode)

		// Get image data
		const emoji_data = emoji.getImageDataWithColon(emoji_string)
    
		// Check if its an emoji and not a null  
		if (emoji_data !== null) {
      // console.log(emoji_data)
			emoji_array.push(emoji_data.imageUrl)
		}
	}

	// DRAKE
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	const locations = [
		{ x: 149, y: 189 }, { x: 498, y: 189 }, { x: 846, y: 189 }, { x: 1195, y: 189 },
		{ x: 149, y: 665 }, { x: 498, y: 665 }, { x: 846, y: 665 }, { x: 1195, y: 665 },
		{ x: 149, y: 1141 }, { x: 498, y: 1141 }, { x: 846, y: 1141 }, { x: 1195, y: 1141 },
	]

	await Promise.all(
		emoji_array.map(async (emoji_url, index) => {
			await axios.get(`https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-160/${emoji_url}`,{
					responseType: 'arraybuffer'
				})
				.then(r => {
					const emoji_buffer = Buffer.from(r.data, 'binary')
					
					loadImage(emoji_buffer).then(image => {
							ctx.drawImage(image, locations[index].x, locations[index].y, 270, 270)
						})
						.catch(e => console.log(e))
				})
				.catch((e) => console.log(e))
		})
	)
	
	const stream = canvas.toBuffer()

	res.writeHead(200, { 'Content-Type': `image/png` })
	return res.end(stream)
})



app.listen( port, () => console.log(`server started at http://localhost:${port}`))