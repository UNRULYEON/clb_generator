import express from 'express'
import { EmojiData } from 'emoji-data-ts'
// @ts-ignore
import emojiUnicode from 'emoji-unicode'
// @ts-ignore
import toEmoji from 'emoji-name-map'    
import { createCanvas, loadImage } from 'canvas'

const app = express()
const port = 8080
const emoji = new EmojiData()


app.get("/:emoji_unicodes?", ( req, res ) => {
  const unicodes = req.params.emoji_unicodes
	const canvas = createCanvas(200, 200)
	const ctx = canvas.getContext('2d')

	if (!unicodes) {
		// Kanye
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const stream = canvas.toBuffer()
		res.writeHead(200, { 'Content-Type': `image/png` })
		res.end(stream)
	}

  const unicode_array: string[] = unicodes.split('')

	const emoji_array: string[] = []
	
	// Check if every element is an emoji
	for (let i = 0; i < 24; i += 2) {

    // unicode first and second element into one const
		const unicode = `${unicode_array[i]}${unicode_array[i+1]}`
		
    // replace emoji to string
    const emoji_string = emoji.replaceEmojiToStr(unicode)

		// Get image data
		const emoji_data = emoji.getImageDataWithColon(emoji_string)

		// Check if its an emoji and not a null  
		if (emoji_data !== null) {
			emoji_array.push(emoji_data.imageUrl)
		}
	}

	// DRAKE
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const stream = canvas.toBuffer()
	res.writeHead(200, { 'Content-Type': `image/png` })
	res.end(stream)
})

app.listen( port, () => console.log( `server started at http://localhost:${ port }`))