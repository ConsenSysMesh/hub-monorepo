import {createCanvas, loadImage} from "canvas";
import emojiRegex from 'emoji-regex';
import {openSync} from "fontkit";
export const width = 764;
export const height = 400;

// load emoji font
const font = openSync('assets/public/fonts/AppleColorEmoji.ttc').fonts[0];

export const drawBlankCanvas = async (bgColor) => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    return {
        canvas, context
    }
}
export const drawBaseCanvas = async (baseAssetPath) => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const bg = await loadImage(baseAssetPath);
    context.drawImage(bg, 0, 0, width, height);
    return {
        canvas, context
    }
}
export const drawAvatarAndHeader = async (imageUrl, headerText, ctx) => {
    ctx.font = "bold 24pt 'PT Sans'";
    ctx.textAlign = "start"
    ctx.fillStyle = "#fff";
    ctx.fillText(headerText, 104, 56);

    if (imageUrl) {
        // Draw Image as avatar: https://stackoverflow.com/questions/69046902/drawing-an-image-inside-a-circle-using-canvas
        const circle = {
            x: 57,
            y: 62,
            radius: 32,
        }

        await drawAvatar(imageUrl, circle, ctx);
    }
}

const splitEmoji = (string) => [...new Intl.Segmenter('en', { granularity: "word" }).segment(string)].map(x => x.segment)

export const drawTextWithEmoji = async (text, fontSize, x, y, ctx, styles = {}) => {
    const scaleFactor = 1.5;
    const scaledSize = fontSize * scaleFactor;
    const padding = 6;

    const fillStyle = styles.fillStyle || '#fff';
    const textFont = styles.font || `${fontSize}pt 'PT Sans'`;
    const bg = styles.bg;

    const canvas = createCanvas(10, scaledSize + padding * 2);
    const context = canvas.getContext("2d");

    const splitString = splitEmoji(text);
    const regex = emojiRegex();

    // Calculate width of canvas
    canvas.width = 12 + splitString.reduce((accumulator, currentValue) => {
        if (currentValue.match(regex)) {
            return accumulator + scaledSize;
        } else {
            context.font = textFont;
            return accumulator + context.measureText(currentValue).width;
        }
    }, 0);

    // Fill background if required
    if (bg) {
        context.fillStyle = bg;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    let currentX = padding;

    // Draw emoji images and fill text
    for (const w of splitString) {
        if (w.match(regex)) {
            // emoji
            let run = font.layout(w);
            let img = run.glyphs[0].getImageForSize(fontSize).data;
            const i = await loadImage(img);
            context.drawImage(i, currentX, padding, scaledSize, scaledSize);
            currentX += scaledSize;
        } else {
            // string
            context.font = textFont;
            context.fillStyle = fillStyle;
            let temp = context.measureText(w).width;
            context.fillText(w, currentX, canvas.height / 2 + fontSize / 2);
            currentX += temp;
        }
    }

    // Draw final image on canvas
    const i = await loadImage(canvas.toBuffer());
    if (styles.centerAligned) {
        ctx.drawImage(i, width / 2 - canvas.width / 2, y - canvas.height / 2);
    } else {
        ctx.drawImage(i, x, y);
    }
}

export const drawAvatar = async (imageUrl, circle, ctx) => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(imageUrl);

    // Compute aspectration
    const aspect = avatar.height / avatar.width;
    // Math.max is ued to have cover effect use Math.min for contain
    const hsx = circle.radius * Math.max(1.0 / aspect, 1.0);
    const hsy = circle.radius * Math.max(aspect, 1.0);
    // x - hsl and y - hsy centers the image
    ctx.drawImage(avatar, circle.x - hsx, circle.y - hsy, hsx * 2, hsy * 2);
}

export const printAtWordWrap = (text, x, y, lineHeight, fitWidth, context) => {
    context.font = "16pt 'PT Sans'";
    context.fillStyle = "#fff";

    fitWidth = fitWidth || 0;

    if (fitWidth <= 0) {
        context.fillText( text, x, y );
        return;
    }
    let words = text.split(' ');
    let currentLine = 0;
    let idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth ) {
            if (idx === 1) {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else {
            idx++;
        }
    }
    if  (idx > 0)
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
}
