import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Story, Test} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';
import {eq} from "drizzle-orm";
import {getStoryOutcome, getTestOutcome} from "../services/outcome.service";
import {getStoryNumberOfTests, getTestNumberOfRuns} from "../services/num-tests.service";


const getTestsForStory = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Test).where(eq(Test.storyId, storyId))
        const resultWithStatus = await Promise.all(result.map(async (t) => ({...t, status: await getTestOutcome(t.testId)})))
        res.status(200).send(resultWithStatus);
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const getTest = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        const testId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId) || isNaN(testId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Test).where(eq(Test.testId, testId));
        const resultWithExtras = await Promise.all(result.map(async (t) => (
            {...t,
                status: await getTestOutcome(t.storyId),
                numRuns: await getTestNumberOfRuns(t.storyId)
            })));
        res.status(200).send(resultWithExtras)
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}


const addTestToStory = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId)) {
            res.status(404).send();
            return;
        }
        const validation = await validate(schemas.post_test, req.body);
        if (validation !== true) {
            Logger.info("Post test failed validation");
            res.statusMessage = `Bad Request: ${validation.toString()}`
            res.status(400).send();
            return;
        }
        const test: typeof Test.$inferInsert = {
            title: req.body.title,
            description: req.body.description,
            testIdentifier: req.body.testIdentifier,
            storyId,
        }

        const [testId] = await db.insert(Test).values(test).returning({testId: Test.testId});
        Logger.info(`Added test ${testId.testId} to story ${storyId}`);
        res.status(201).send(testId);
        return;
    } catch (error) {
        Logger.error(error)
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getTestsForStory, addTestToStory}