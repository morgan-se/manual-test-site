import NavBar from "./NarBar.tsx";
import { Outlet } from "react-router-dom";

const NavHandler = () => {
    return (
        <>
            <NavBar/>
            <Outlet/>
        </>
    )
}
export default NavHandler;
