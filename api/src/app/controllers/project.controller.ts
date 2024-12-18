import {Request, Response} from "express";
import Logger from "../../config/logger";
import {Project} from "../../db/schema";
import {db} from "../../server";
import {validate} from "../../validator";
import * as schemas from '../resources/schemas.json';
import {getProjectOutcome} from "../services/outcome.service";
import {eq} from "drizzle-orm";
import {getProjectNumberOfStories, getProjectNumberOfTests} from "../services/num-tests.service";


const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await db.select().from(Project)
        const resultWithExtras = await Promise.all(result.map(async (p) => (
            {...p,
                status: await getProjectOutcome(p.projectId),
                numStories: await getProjectNumberOfTests(p.projectId),
                numTests: await getProjectNumberOfTests(p.projectId)
            })));
        res.status(200).send(resultWithExtras)
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

const getProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const projectId: number = parseInt(req.params.projectId, 10);
        if (isNaN(projectId)) {
            res.status(404).send();
            return;
        }
        const result = await db.select().from(Project).where(eq(Project.projectId, projectId));
        // todo: reduce duplication
        const resultWithExtras = await Promise.all(result.map(async (p) => (
            {...p,
                status: await getProjectOutcome(p.projectId),
                numStories: await getProjectNumberOfStories(p.projectId),
                numTests: await getProjectNumberOfTests(p.projectId)
            })));        res.status(200).send(resultWithExtras)
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
        res.status(201).send(projectId);
    } catch (error) {
        Logger.error(error);
        res.status(500).send("Whoops! Something went wrong");
        return;
    }
}

export {getProjects, addProject, getProject}