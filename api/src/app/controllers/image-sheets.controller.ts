import {Request, Response} from "express";
import Logger from "../../config/logger";
import {createImage} from "../services/image-creation.service";


const getImageFromGoogleSheets = async (req: Request, res: Response) => {
    try {
        const spreadsheetId: string = req.query.id as string;
        const sheetName: string = req.query.sheet_name as string;
        const title: string = req.query.title as string;
        const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

        // Check for one or more `idxId` query parameters. Default to [0, 1] if none are provided.
        const idxId = req.query.idxId ? (req.query.idxId as string).split(',').map(Number) : [0, 1];

        // Lambda function that takes a list and returns items at the given indices joined with spaces
        const getTestIdentifier = (row: any) => idxId.map((idx) => row[idx] || '').join(' ');

        // Check for `idxRes` query parameter for the status index, default to -4
        const idxRes = req.query.idxRes ? parseInt(req.query.idxRes as string, 10) : -4;

        const sheetUrl: string = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:ZZ100?key=${apiKey}`;
        const response = await fetch(sheetUrl);
        const data = await response.json();
        const testsWithStatus: {testIdentifier: string, status: string}[] = []
        if (data && data.values.length) {
            data.values.forEach((row: any) => {
                try {
                    testsWithStatus.push({testIdentifier: getTestIdentifier(row), status: row[row.length + idxRes].toLowerCase() || 'unknown'});
                } catch (error) {
                    testsWithStatus.push({testIdentifier: "ERROR", status: "unknown"});
                }
            })
        }

        const canvas = await createImage(title, testsWithStatus)
        res.contentType('image/png');
        res.status(200).send(canvas.toBuffer('image/png'));
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getImageFromGoogleSheets}