import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Project} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';


const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await db.select().from(Project)
        res.status(200).send(result)
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const addProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = await validate(schemas.post_project, req.body);
        if (validation !== true) {
            Logger.info("Post project failed validation");
            res.statusMessage = `Bad Request: ${validation.toString()}`
            res.status(400).send();
            return;
        }
        const project: typeof Project.$inferInsert = {
            title: req.body.title,
            description: req.body.description,
        }

        const [projectId] = await db.insert(Project).values(project).returning({projectId: Project.projectId});
        Logger.info(`Added project ${projectId.projectId}`);
        res.status(201).send(project);
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getProjects, addProject}