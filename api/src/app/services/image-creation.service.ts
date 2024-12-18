import {createCanvas} from "canvas";

const createImage = async (title: string, testResults: {testIdentifier: string, status: string}[]) => {
    const canvasWidth: number = 339
    const canvasHeight: number = 254
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Define square dimensions
    const squareSize: number = 53;
    const spacing: number = 3;

    // Fill the entire canvas with white color for the background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the title
    ctx.fillStyle = 'black';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center'; // Center the title horizontally
    ctx.fillText(title, canvasWidth / 2, 20); // Adjust Y position for the title

    let x: number = spacing;
    let y: number = 30;

    // Define tick and cross symbols
    // const tickSymbol = '✔';
    // const crossSymbol = '✘';

    const tickSymbol = '\u2714'; // Unicode for tick symbol
    const crossSymbol = '\u2718'; // Unicode for cross symbol
    const unknownSymbol = '?'; // Unicode for question mark
    // const unknownSymbol = '\u2753'; // Unicode for question mark
    const warningSymbol = '!'; // Unicode for exclamation mark
    // const warningSymbol = '\u2757'; // Unicode for exclamation mark


    // Loop through test results and draw squares
    testResults.forEach(({ testIdentifier, status }, index) => {
        // Set color based on test result
        let symbol;
        if(status === "pass") {
            ctx.fillStyle = 'green';
            symbol = tickSymbol;
        } else if (status === "fail") {
            ctx.fillStyle = 'red';
            symbol = crossSymbol;
        } else if (status === "error") {
            ctx.fillStyle = 'orange';
            symbol = warningSymbol;
        } else {
            ctx.fillStyle = 'grey'
            symbol = unknownSymbol;
        }

        // Draw square
        ctx.fillRect(x, y, squareSize, squareSize);

        // Draw tick or cross symbol
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial Unicode MS';
        ctx.textAlign = 'center';

        ctx.fillText(symbol, x + squareSize-10, y + squareSize -30); // Adjust Y position for symbol


        // Draw text label (test ID) inside the square
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = "left"

        // ctx.fillText(storyIdentifier, x + 3, y + squareSize - 30);
        ctx.fillText(testIdentifier, x + 3, y + squareSize - 10);

        // Move to the next position
        x += squareSize + spacing;

        // Move to the next row after a certain number of squares
        if ((index + 1) % 6 === 0) {
            x = spacing;
            y += squareSize + spacing;
        }
    });

    // Add an outline around the image
    const outlineColor = 'grey';
    const outlineThickness = 2;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineThickness;
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    return canvas;
}

export {createImage};