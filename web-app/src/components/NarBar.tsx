import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";


const NarBar = () => {

    const navigate = useNavigate()

    return (
        <>
            <Button onClick={() => navigate('/projects')}>
                View Projects
            </Button>
        </>
    )
}

export default NarBar