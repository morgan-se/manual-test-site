import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addStoryToProject, getStoriesForProject, getStory} from "../controllers/story.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects/:projectId/stories")
        .get(getStoriesForProject)
        .post(addStoryToProject);
    app.route(rootUrl + "/projects/:projectId/stories/:storyId")
        .get(getStory)
}
