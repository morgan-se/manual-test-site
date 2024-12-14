import express from "./config/express";
import Logger from "./config/logger";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle(process.env.DB_FILE_NAME!);


const app = express()
const port = process.env.PORT || 3000;

const main = async () => {
    try {

        app.listen(port, () => {
            Logger.info(`Server started on port: ${port}`);
        });
    } catch (err) {
        Logger.error('Unable to run server')
        Logger.error(err)
        process.exit(1);
    }
}

main();