import { GlobalFonts, Image, createCanvas } from "@napi-rs/canvas";
import express from "express";
import fs from "fs";
import Items from "../src/static/json/Items.json";
import { join } from "path";
const app = express();

GlobalFonts.registerFromPath(join(__dirname + "../src/static/fonts/MinecraftBold-nMK1.otf"), "MinecraftBold");
GlobalFonts.registerFromPath(join(__dirname + "../src/static/fonts/MinecraftRegular-Bmg3.otf"), "MinecraftRegular");

app.get("/api/advancement", async (req, res) => {
    let { item, title, message, color } = req.query;
    const canvas = createCanvas(340, 64);
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;

    const backgroundImage = new Image();
    backgroundImage.src = getGUI("AdvancementToast");

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    if (!item) return res.status(400).json(Items);
    if (!title) title = "Title";
    if (!message) message = "Message";
    if (!color) color = "yellow";

    const itemImage = new Image();
    itemImage.src = getItem(item as string);

    ctx.drawImage(itemImage, 16, 16, 32, 32);

    ctx.font = '16px MinecraftRegular';
    ctx.fillStyle = color as string;
    ctx.fillText(title as string, 60, 25);

    ctx.font = '16px MinecraftRegular';
    ctx.fillStyle = "white";
    ctx.fillText(message as string, 60, 41);

    const buffer = canvas.toBuffer('image/png');

    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
    });

    res.end(buffer);
});

const getGUI = (gui: string) => {
    return fs.readFileSync(`./src/static/gui/${gui}.png`);
}

const getItem = (item: string) => {
    return fs.readFileSync(`./src/static/item/${item}.png`);
}

app.listen(3000, () => {
    console.log("Listening on port 3000!");
});

export default app;