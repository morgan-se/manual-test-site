import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Story, Test, TestRun} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';
import {and, eq, inArray, max} from "drizzle-orm";


const addTestRunEntry = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        const testId: number = parseInt(req.params.testId, 10);
        if (isNaN(projectId) || isNaN(storyId) || isNaN(testId)) {
            res.status(404).send();
            return;
        }

        // todo: implement validation
        const testRun: typeof TestRun.$inferInsert = {
            testId,
            outcome: req.body.outcome,
            notes: req.body.notes,
        }

        const [testRunId] = await db.insert(TestRun).values(testRun).returning({testRunId: TestRun.testRunId});
        res.status(201).send(testRunId);
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const getAllTestRunsOfTest = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        const testId: number = parseInt(req.params.testId, 10);
        if (isNaN(projectId) || isNaN(storyId) || isNaN(testId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(TestRun).where(eq(TestRun.testId, testId))
        res.status(200).send(result)
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const getLatestTestRunsForStory = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId)) {
            res.status(404).send();
            return;
        }
        // todo: make this only get unique (latest) entry per test
        const tests = await db.select().from(Test).where(eq(Test.storyId, storyId))
        const testIds = tests.map(t => t.testId);
        if (!testIds.length) {
            res.status(200).send([])
            return;
        }

        // const result = await db.select().from(TestRun).where(inArray(TestRun.testId, testIds))
        const latestTestRuns = await db
            .select()
            .from(TestRun)
            .where(inArray(TestRun.testId, testIds))
            .groupBy(TestRun.testId)
            .having(max(TestRun.timestamp))

        const result = tests.map(t => {
            const testRun = latestTestRuns.find(tr => tr.testId === t.testId);
            if (testRun) {
                return {...t, outcome: testRun.outcome, notes: testRun.notes, timestamp: testRun.timestamp};
            } else {
                return {...t, outcome: "unknown", notes: "", timestamp: ""};
            }
        })

        res.status(200).send(result)
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}


const deleteTestRun = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        const testId: number = parseInt(req.params.testId, 10);
        const testRunId: number = parseInt(req.params.testRunId, 10);
        if (isNaN(projectId) || isNaN(storyId) || isNaN(testId) || isNaN(testRunId)) {
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

        // todo: delete test runs
        res.status(501).send(storyId);
        return;
    } catch (error) {
        Logger.error(error)
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}



export {addTestRunEntry, getAllTestRunsOfTest, getLatestTestRunsForStory, deleteTestRun}