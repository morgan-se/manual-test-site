import {Request, Response} from "express";
import {db} from "../../server";
import {Story, Test} from "../../db/schema";
import {eq} from "drizzle-orm";
import {getTestOutcome} from "../services/outcome.service";
import Logger from "../../config/logger";
import {createImage} from "../services/image-creation.service";


const getStoryImage = async (req: Request, res: Response) => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId)) {
            res.status(404).send();
            return;
        }
        const [story] = await db.select().from(Story).where(eq(Story.storyId, storyId))
        const tests = await db.select().from(Test).where(eq(Test.storyId, storyId))
        const testsWithStatus = await Promise.all(tests.map(async (t) => ({ testIdentifier: t.testIdentifier, status: await getTestOutcome(t.testId)})))

        const canvas = await createImage(story.storyIdentifier + " - " + story.title, testsWithStatus)
        res.contentType('image/png');
        res.status(200).send(canvas.toBuffer('image/png'));
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getStoryImage}