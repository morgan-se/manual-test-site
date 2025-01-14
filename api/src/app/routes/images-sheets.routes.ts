import {Express} from 'express';
import {rootUrl} from "./base.routes";
import {getImageFromGoogleSheets} from "../controllers/image-sheets.controller";


module.exports = (app: Express) => {
    app.route(rootUrl+ `/sheets`)
        .get(getImageFromGoogleSheets);
}