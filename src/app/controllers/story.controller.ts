import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Project, Story} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';
import {eq} from "drizzle-orm";


const getStoriesForProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        if (isNaN(projectId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Story).where(eq(Project.projectId, projectId))
        res.status(200).send(result)
        return;
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

export {getStoriesForProject, addStoryToProject}