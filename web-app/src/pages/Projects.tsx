import {useState, useEffect} from "react";
import axios from "axios";
import BASE_URL from "../util/url.ts";
import {useNavigate} from "react-router-dom";
import Status from "../components/Status.tsx";
import {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Table,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, TextField,
    Button, Typography, Stack
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';


const Projects = () => {
    const navigate = useNavigate()
    const [projects, setProjects] = useState<Array<Project>>([]);
    const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
    const [addProjectTitle, setAddProjectTitle] = useState<string>("");
    const [addProjectDescription, setAddProjectDescription] = useState<string>("");

    useEffect(() => {
        const getProjects = () => {
            axios.get(BASE_URL + `/projects`)
                .then((res) => {
                    setProjects(res.data);
                }, () => {
                    console.log("Error getting projects");
                })
        }
        getProjects();
    }, []);

    const addProject = () => {
        // todo: implement some front end validation
        const data = {title: addProjectTitle, description: addProjectDescription};
        axios.post(BASE_URL + `/projects`, data)
            .then((res) => {
                const projectId = res.data.projectId;
                navigate(`/projects/${projectId}`);
            }, (_) => {
                console.log("Could not add project");
            })

    }

    // todo: show number of stories (and maybe even number of tests) at the project level. Will require updating the endpoint

    const projectList = () => {
        if (projects && projects.length > 0) {
            return projects.map((p) => (
                <TableRow key={p.projectId} onClick={() => navigate(`/projects/${p.projectId}/stories`)} className="table-row-hover">
                    <TableCell>{p.title}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell><Status status={p.status}/></TableCell>
                    <TableCell>{p.numStories}</TableCell>
                    <TableCell>{p.numTests}</TableCell>
                </TableRow>
            ))
        } else {
            return "No projects found.";
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                <Typography variant="h3" component="h3">Projects</Typography>
                <Button onClick={() => {setOpenAddProjectDialog(true)}} startIcon={<AddIcon/>}>
                    Create new project
                </Button>

            </Stack>
            {/* TODO: sorting/filtering? */}
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell># Stories</TableCell>
                    <TableCell># Tests</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {projectList()}
                </TableBody>

            </Table>


            <Dialog
                open={openAddProjectDialog}
                onClose={() => {setOpenAddProjectDialog(false)}}>
                <DialogTitle>Add a new project</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                    <TextField label="Title" variant="outlined" value={addProjectTitle}
                               onChange={(e) => setAddProjectTitle(e.target.value)}
                               slotProps={{htmlInput: {maxLength: 128}}}

                    />
                    <TextField label="Description" variant="outlined" value={addProjectDescription}
                               onChange={(e) => setAddProjectDescription(e.target.value)}
                               multiline rows={4} slotProps={{htmlInput: {maxLength: 1024}}}
                    />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenAddProjectDialog(false)} startIcon={<CloseIcon/>}>Cancel</Button>
                    <Button variant="contained" onClick={addProject} startIcon={<AddIcon/>}>Add Project</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Projects;