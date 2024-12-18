import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BASE_URL from "../util/url.ts";
import Status from "../components/Status.tsx";
import {
    Button,
    Stack,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Table,
    TableBody,
    DialogTitle,
    DialogContent, TextField, DialogActions, Dialog
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const Stories = () => {
    const navigate = useNavigate()
    const {projectId} = useParams();
    const [project, setProject] = useState<Project>();
    const [stories, setStories] = useState<Array<Story>>([]);
    const [openAddStoryDialog, setOpenAddStoryDialog] = useState(false);
    const [addStoryIdentifier, setAddStoryIdentifier] = useState<string>("");
    const [addStoryTitle, setAddStoryTitle] = useState<string>("");
    const [addStoryDescription, setAddStoryDescription] = useState<string>("");

    useEffect(() => {
        const getProject = () => {
            axios.get(BASE_URL + `/projects/${projectId}`)
                .then((res) => {
                    setProject(res.data[0]);
                }, () => {
                    console.log("Error getting project");
                })
        }
        getProject();
    }, [projectId]);

    useEffect(() => {
        const getStories = () => {
            axios.get(BASE_URL + `/projects/${projectId}/stories`)
                .then((res) => {
                    setStories(res.data);
                }, () => {
                    console.log("Error getting stories");
                })
        }
        getStories();
    }, []);

    const addStory = () => {
        // todo: implement some front end validation
        const data = {storyIdentifier: addStoryIdentifier, title: addStoryTitle, description: addStoryDescription};
        axios.post(BASE_URL + `/projects/${projectId}/stories`, data)
            .then((res) => {
                const storyId = res.data.storyId;
                navigate(`/projects/${storyId}`);
            }, (_) => {
                console.log("Could not add story");
            })
    }

    const storyList = () => {
        if (stories && stories.length > 0) {
            return stories.map((s) => (
                <TableRow key={s.storyId} onClick={() => navigate(`/projects/${projectId}/stories/${s.storyId}/tests`)} className="table-row-hover">
                    <TableCell>{s.storyIdentifier}</TableCell>
                    <TableCell>{s.title}</TableCell>
                    <TableCell>{s.description}</TableCell>
                    <TableCell><Status status={s.status}/></TableCell>
                    <TableCell>{s.numTests}</TableCell>
                </TableRow>
            ))
        } else {
            return "No stories found.";
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                {/* todo: highlight project  name and make it link */}
                <Typography variant="h3" component="h3">Stories for {project ? project.title : ''}</Typography>
                <Button onClick={() => {setOpenAddStoryDialog(true)}} startIcon={<AddIcon/>}>
                    Create new story
                </Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableCell>Identifier</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell># Tests</TableCell>
                </TableHead>
                <TableBody>
                    {storyList()}
                </TableBody>
            </Table>


            <Dialog
                open={openAddStoryDialog}
                onClose={() => {setOpenAddStoryDialog(false)}}>
                <DialogTitle>Add a new story</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <TextField label="Indentifier" variant="outlined" value={addStoryIdentifier}
                                   placeholder="U1"
                                   onChange={(e) => setAddStoryIdentifier(e.target.value)}
                                   slotProps={{htmlInput: {minLength: 1, maxLength: 6}}}

                        />
                        <TextField label="Title" variant="outlined" value={addStoryTitle}
                                   onChange={(e) => setAddStoryTitle(e.target.value)}
                                   slotProps={{htmlInput: {minLength:1, maxLength: 128}}}

                        />
                        <TextField label="Description" variant="outlined" value={addStoryDescription}
                                   onChange={(e) => setAddStoryDescription(e.target.value)}
                                   multiline rows={4} slotProps={{htmlInput: {maxLength: 1024}}}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenAddStoryDialog(false)} startIcon={<CloseIcon/>}>Cancel</Button>
                    <Button variant="contained" onClick={addStory} startIcon={<AddIcon/>}>Add Story</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default Stories