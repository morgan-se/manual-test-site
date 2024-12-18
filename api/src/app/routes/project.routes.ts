import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addProject, getProjects, getProject} from "../controllers/project.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects")
        .get(getProjects)
        .post(addProject);
    app.route(rootUrl + "/projects/:projectId")
        .get(getProject);
}