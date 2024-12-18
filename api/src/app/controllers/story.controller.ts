import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Story} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';
import {eq} from "drizzle-orm";
import {getStoryOutcome} from "../services/outcome.service";
import {getStoryNumberOfTests} from "../services/num-tests.service";


const getStoriesForProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        if (isNaN(projectId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Story).where(eq(Story.projectId, projectId));
        const resultWithExtras = await Promise.all(result.map(async (s) => (
            {...s,
                status: await getStoryOutcome(s.storyId),
                numTests: await getStoryNumberOfTests(s.storyId)
            })));
        res.status(200).send(resultWithExtras)
        return;
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const getStory = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        const storyId: number = parseInt(req.params.storyId, 10);
        if (isNaN(projectId) || isNaN(storyId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Story).where(eq(Story.storyId, storyId));
        const resultWithExtras = await Promise.all(result.map(async (s) => (
            {...s,
                status: await getStoryOutcome(s.storyId),
                numTests: await getStoryNumberOfTests(s.storyId)
            })));
        res.status(200).send(resultWithExtras)
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}


const addStoryToProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        if (isNaN(projectId)) {
            res.status(404).send();
            return;
        }
        const validation = await validate(schemas.post_story, req.body);
        if (validation !== true) {
            Logger.info("Post story failed validation");
            res.statusMessage = `Bad Request: ${validation.toString()}`
            res.status(400).send();
            return;
        }
        const story: typeof Story.$inferInsert = {
            title: req.body.title,
            description: req.body.description,
            storyIdentifier: req.body.storyIdentifier,
            projectId
        }

        const [storyId] = await db.insert(Story).values(story).returning({storyId: Story.storyId});
        Logger.info(`Added story ${storyId.storyId}`);
        res.status(201).send(storyId);
        return;
    } catch (error) {
        Logger.error(error)
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getStoriesForProject, addStoryToProject, getStory}