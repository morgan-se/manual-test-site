import {useParams} from "react-router-dom";
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
    const {projectId} = useParams();
    const {storyId} = useParams();
    const {testId} = useParams();
    const [project, setProject] = useState<Project>();
    const [story, setStory] = useState<Story>();
    const [test, setTest] = useState<Test>();
    const [testRuns, setTestRuns] = useState<Array<TestRun>>([]);
    const [openAddTestRunDialog, setOpenAddTestRunDialog] = useState(false);
    const [addTestRunStatus, setAddTestRunStatus] = useState<string>("");
    const [addTestRunNotes, setAddTestRunNotes] = useState<string>("");

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
        const getTest = () => {
            axios.get(BASE_URL + `/projects/${projectId}/stories/${storyId}/tests/${testId}`)
                .then((res) => {
                    setTest(res.data[0]);
                }, () => {
                    console.log("Error getting test");
                })
        }
        getTest();
    }, [storyId]);

    useEffect(() => {
        const getTestRuns = () => {
            axios.get(BASE_URL + `/projects/${projectId}/stories/${storyId}/tests/${testId}/runs`)
                .then((res) => {
                    setTestRuns(res.data);
                }, () => {
                    console.log("Error getting test runs");
                })
        }
        getTestRuns();
    }, []);

    const addTestRun = () => {
        const data = {outcome: addTestRunStatus, notes: addTestRunNotes};
        axios.post(BASE_URL + `/projects/${projectId}/stories/${storyId}/tests/${testId}/runs`, data)
            .then((_) => {
                setOpenAddTestRunDialog(false);
                setAddTestRunStatus(addTestRunStatus);
                setAddTestRunNotes("");
                // todo: decide what happens afterwards, not sure they really should be adding runs here
                // const testId = res.data.testId
                // navigate(`/projects/${projectId}/stories/${storyId}/tests/${testId}`)
            })
    }

    const testRunList = () => {
        if (testRuns && testRuns.length > 0) {
            return testRuns.map((t) => (
                <TableRow key={t.testRunId}>
                    <TableCell>{t.timestamp}</TableCell>
                    <TableCell>{t.notes}</TableCell>
                    <TableCell><Status status={t.outcome}/></TableCell>
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
                <Typography variant="h3" component="h3">TestRuns for {project ? project.title : ''} &gt; {story ? story.storyIdentifier + " " + story.title : ''}  &gt; {test ? test.testIdentifier + " " + test.title : ''}</Typography>
                <Button onClick={() => {setOpenAddTestRunDialog(true)}} startIcon={<AddIcon/>}>
                    Add run
                </Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Status</TableCell>
                </TableHead>
                <TableBody>
                    {testRunList()}
                </TableBody>
            </Table>


            <Dialog
                open={openAddTestRunDialog}
                onClose={() => {setOpenAddTestRunDialog(false)}}>
                <DialogTitle>Add a new test</DialogTitle>
                <DialogContent>
                    <Stack direction="column" spacing={2}>
                        {/* todo: implement a select box instead of user input*/}
                        <TextField label="Outcome" variant="outlined" value={addTestRunStatus}
                                   placeholder="pass|fail|error|unkown"
                                   onChange={(e) => setAddTestRunStatus(e.target.value)}
                                   slotProps={{htmlInput: {minLength: 1, maxLength: 6}}}

                        />
                        <TextField label="Notes" variant="outlined" value={addTestRunNotes}
                                   onChange={(e) => setAddTestRunNotes(e.target.value)}
                                   multiline rows={4} slotProps={{htmlInput: {maxLength: 1024}}}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenAddTestRunDialog(false)} startIcon={<CloseIcon/>}>Cancel</Button>
                    <Button variant="contained" onClick={addTestRun} startIcon={<AddIcon/>}>Add Run</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Tests