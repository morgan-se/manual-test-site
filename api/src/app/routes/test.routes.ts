import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addTestToStory, getTestsForStory} from "../controllers/test.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects/:projectId/stories/:storyId/tests")
        .get(getTestsForStory)
        .post(addTestToStory);
}