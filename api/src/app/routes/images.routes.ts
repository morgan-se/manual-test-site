import {Express} from 'express';
import {rootUrl} from "./base.routes";
import {getStoryImage} from "../controllers/image-story.controller";

module.exports = (app: Express) => {
    app.route(rootUrl+ `/img/projects/:projectId/stories/:storyId`)
        .get(getStoryImage);
}