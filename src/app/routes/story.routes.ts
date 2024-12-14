import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addStoryToProject, getStoriesForProject} from "../controllers/story.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects/:projectId/stories")
        .get(getStoriesForProject)
        .post(addStoryToProject);
}