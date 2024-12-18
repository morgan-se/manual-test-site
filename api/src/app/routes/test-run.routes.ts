import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addTestRunEntry, getAllTestRunsOfTest, getLatestTestRunsForStory} from "../controllers/test-run.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects/:projectId/stories/:storyId/tests/:testId/runs")
        .get(getAllTestRunsOfTest)
        .post(addTestRunEntry);

    app.route(rootUrl + "/projects/:projectId/stories/:storyId/runs")
        .get(getLatestTestRunsForStory);
}