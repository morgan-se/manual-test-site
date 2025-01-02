import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import BASE_URL from "../util/url.ts";
import {
    TableCell,
    TableHead,
    TableRow,
    Table,
    Stack,
    Typography,
    TableBody,
    Button,
    DialogTitle,
    DialogContent, TextField, DialogActions, Dialog
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Status from "../components/Status.tsx";

const Tests = () => {
    const navigate = useNavigate()
    const {projectId} = useParams();
    const {storyId} = useParams();
    const [project, setProject] = useState<Project>();
    const [story, setStory] = useState<Story>();
    const [tests, setTests] = useState<Array<Test>>([]);
    const [openAddTestDialog, setOpenAddTestDialog] = useState(false);
    const [addTestIdentifier, setAddTestIdentifier] = useState<string>("");
    const [addTestTitle, setAddTestTitle] = useState<string>("");
    const [addTestDescription, setAddTestDescription] = useState<string>("");

    useEffect(() => {
        const getProject = () => {
            axios.get(BASE_URL + "/projects/" + projectId)
                .then((res) => {
                    setProject(res.data[0]);
                }, () => {
                    console.log("Error getting project");
                })
        }
        getProject();
    }, [projectId]);

    useEffect(() => {
        const getStory = () => {
            axios.get(BASE_URL + `/projects/${projectId}/stories/${storyId}`)
                .then((res) => {
                    setStory(res.data[0]);
                }, () => {
                    console.log("Error getting story");
                })
        }
        getStory();
    }, [storyId]);

    useEffect(() => {
        const getTests = () => {
            axios.get(BASE_URL + `/projects/${projectId}/stories/${storyId}/tests`)
                .then((res) => {
                    setTests(res.data);
                }, () => {
                    console.log("Error getting tests");
                })
        }
        getTests();
    }, []);

    const addTest = () => {
        const data = {testIdentifier: addTestIdentifier, title: addTestTitle, description: addTestDescription};
        axios.post(BASE_URL + `/projects/${projectId}/stories/${storyId}/tests`, data)
            .then((res) => {
                const testId = res.data.testId
                navigate(`/projects/${projectId}/stories/${storyId}/tests/${testId}`)
            })
    }

    const testList = () => {
        if (tests && tests.length > 0) {
            return tests.map((t) => (
                <TableRow key={t.testId} onClick={() => {navigate(`/projects/${projectId}/stories/${storyId}/tests/${t.testId}/testruns`)}} className="table-row-hover">
                    <TableCell>{t.testIdentifier}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell><Status status={t.status}/></TableCell>
                    <TableCell>{t.numRuns}</TableCell>
                </TableRow>
            ))
        } else {
            return "No stories found.";
        }
    }

    return (
        <>
            <Stack direction="row" spacing={2}>
                {/* todo: highlight project and story name and make them links */}
                <Typography variant="h3" component="h3">Tests for <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => navigate(`/projects/${project?.projectId}/stories`)}>{project ? project.title : ''}</span> &gt; {story ? story.storyIdentifier + " " + story.title : ''}</Typography>
                <Button onClick={() => {setOpenAddTestDialog(true)}} startIcon={<AddIcon/>}>
                    Create new test
                </Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableCell>Identifier</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell># Runs</TableCell>
                </TableHead>
                <TableBody>
                    {testList()}
                </TableBody>
            </Table>


            <Dialog
                open={openAddTestDialog}
                onClose={() => {setOpenAddTestDialog(false)}}>
                <DialogTitle>Add a new test</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        <TextField label="Indentifier" variant="outlined" value={addTestIdentifier}
                                   placeholder="AC1"
                                   onChange={(e) => setAddTestIdentifier(e.target.value)}
                                   slotProps={{htmlInput: {minLength: 1, maxLength: 6}}}

                        />
                        <TextField label="Title" variant="outlined" value={addTestTitle}
                                   onChange={(e) => setAddTestTitle(e.target.value)}
                                   slotProps={{htmlInput: {maxLength: 128}}}

                        />
                        <TextField label="Description" variant="outlined" value={addTestDescription}
                                   onChange={(e) => setAddTestDescription(e.target.value)}
                                   multiline rows={4} slotProps={{htmlInput: {maxLength: 1024}}}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenAddTestDialog(false)} startIcon={<CloseIcon/>}>Cancel</Button>
                    <Button variant="contained" onClick={addTest} startIcon={<AddIcon/>}>Add Test</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Tests