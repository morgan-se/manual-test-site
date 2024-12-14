import {Express} from "express";
import {rootUrl} from "./base.routes";
import {addProject, getProjects} from "../controllers/project.controller";

module.exports = (app: Express) => {
    app.route(rootUrl + "/projects")
        .get(getProjects)
        .post(addProject);
}