"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emoji_data_ts_1 = require("emoji-data-ts");
const canvas_1 = require("canvas");
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = 8080;
const emoji = new emoji_data_ts_1.EmojiData();
const canvas_width = 1600;
const canvas_height = 1600;
app.get("/:emoji_unicodes?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const unicodes = req.params.emoji_unicodes;
    const canvas = (0, canvas_1.createCanvas)(canvas_width, canvas_height);
    const ctx = canvas.getContext('2d');
    // 👩‍🎓
    // console.log(emojiUnicode(unicodes))
    if (!unicodes) {
        // Kanye
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const stream = canvas.toBuffer();
        res.writeHead(200, { 'Content-Type': `image/png` });
        return res.end(stream);
    }
    const unicode_array = unicodes.split('');
    const emoji_array = [];
    for (let i = 0; i < 24; i += 2) {
        // unicode first and second element into one const !!(change so multiple variations still come into one unicode)
        const unicode = `${unicode_array[i]}${unicode_array[i + 1]}`;
        // replace emoji to string
        const emoji_string = emoji.replaceEmojiToStr(unicode);
        // Get image data
        const emoji_data = emoji.getImageDataWithColon(emoji_string);
        // Check if its an emoji and not a null  
        if (emoji_data !== null) {
            // console.log(emoji_data)
            emoji_array.push(emoji_data.imageUrl);
        }
    }
    // DRAKE
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const locations = [
        { x: 149, y: 189 }, { x: 498, y: 189 }, { x: 846, y: 189 }, { x: 1195, y: 189 },
        { x: 149, y: 665 }, { x: 498, y: 665 }, { x: 846, y: 665 }, { x: 1195, y: 665 },
        { x: 149, y: 1141 }, { x: 498, y: 1141 }, { x: 846, y: 1141 }, { x: 1195, y: 1141 },
    ];
    yield Promise.all(emoji_array.map((emoji_url, index) => __awaiter(void 0, void 0, void 0, function* () {
        yield axios_1.default.get(`https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-160/${emoji_url}`, {
            responseType: 'arraybuffer'
        })
            .then(r => {
            const emoji_buffer = Buffer.from(r.data, 'binary');
            (0, canvas_1.loadImage)(emoji_buffer).then(image => {
                ctx.drawImage(image, locations[index].x, locations[index].y, 270, 270);
            })
                .catch(e => console.log(e));
        })
            .catch((e) => console.log(e));
    })));
    const stream = canvas.toBuffer();
    res.writeHead(200, { 'Content-Type': `image/png` });
    return res.end(stream);
}));
app.listen(port, () => console.log(`server started at http://localhost:${port}`));
//# sourceMappingURL=index.js.map