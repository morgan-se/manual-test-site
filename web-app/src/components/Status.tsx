import {useState} from "react";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import {Tooltip} from "@mui/material";

interface IStatusProps {
    status: string
}
const Status = (props: IStatusProps) => {
    const [status] = useState(props.status);

    const getIcon = () => {
        if (status === 'pass') {
            return <DoneIcon style={{ color: "green", width: '30px', height: '30px' }} />
        }
        else if (status === 'fail') {
            return <CloseIcon style={{ color: "red", width: '30px', height: '30px'  }} />
        }
        else if (status === 'error') {
            return <ErrorOutlineIcon style={{ color: "orange", width: '30px', height: '30px'  }} />
        }
        else {
            return <QuestionMarkIcon style={{ color: "gray", width: '30px', height: '30px'  }} />
        }
    }

    return (
        <>
            <Tooltip title={status}>
                {getIcon()}
            </Tooltip>
        </>
    )
}

export default Status;