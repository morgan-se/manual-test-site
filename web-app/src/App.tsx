import './App.css'
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import NavHandler from "./components/NavHandler.tsx";
import Projects from "./pages/Projects.tsx";
import Stories from "./pages/Stories.tsx";
import Tests from "./pages/Tests.tsx";
import TestRuns from "./pages/TestRuns.tsx";

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route element={<NavHandler/>}>
                    <Route path="/" element={<Navigate to={"/projects"}/>}/>
                    <Route path="/projects" element={<Projects/>} />
                    <Route path="/projects/:projectId" element={<Stories/>} />
                    <Route path="/projects/:projectId/stories/:storyId/tests" element={<Tests/>} />
                    <Route path="/projects/:projectId/stories/:storyId/tests/:testId" element={<TestRuns/>} />
                </Route>
            </Routes>
        </Router>
    </>
  )
}

export default App;
