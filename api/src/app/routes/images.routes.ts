import {Express} from 'express';
import {rootUrl} from "./base.routes";
import {getStoryImage} from "../controllers/image-story.controller";
import {getProjectImage} from "../controllers/image-project.controller";

module.exports = (app: Express) => {
    app.route(rootUrl+ `/img/projects/:projectId/stories/:storyId`)
        .get(getStoryImage);

    app.route(rootUrl+ `/img/projects/:projectId`)
        .get(getProjectImage);

    // todo: maybe an image overview for the most recent testruns of a test, more like a stack with result and time?
}