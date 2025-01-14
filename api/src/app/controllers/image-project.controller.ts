import {Request, Response} from "express";
import {db} from "../../server";
import {Project, Story} from "../../db/schema";
import {eq} from "drizzle-orm";
import {getStoryOutcome} from "../services/outcome.service";
import Logger from "../../config/logger";
import {createImage} from "../services/image-creation.service";


const getProjectImage = async (req: Request, res: Response) => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        if (isNaN(projectId)) {
            res.status(404).send();
            return;
        }
        const [project] = await db.select().from(Project).where(eq(Project.projectId, projectId));
        const stories = await db.select().from(Story).where(eq(Story.projectId, projectId));
        const storiesWithStatus = await Promise.all(stories.map(async (s) => ({testIdentifier: s.storyIdentifier, status: await getStoryOutcome(s.storyId)})))
        // const tests = await db.select().from(Test).where(eq(Test.storyId, storyId))
        // const testsWithStatus = await Promise.all(tests.map(async (t) => ({ testIdentifier: t.testIdentifier, status: await getTestOutcome(t.testId)})))

        const canvas = await createImage(project.title, storiesWithStatus)
        res.contentType('image/png');
        res.status(200).send(canvas.toBuffer('image/png'));
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getProjectImage}