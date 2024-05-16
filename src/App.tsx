import './App.css';
import {useState} from "react";
import {FootballTeamList} from "./components/FootballTeamList.tsx";
import {HandballTeamList} from "./components/HandballTeamList.tsx";

function App() {
    const [showFootball, setShowFootball] = useState(true);
    return (
        <>
            <button onClick={() => setShowFootball(!showFootball)}>Toggle</button>
            {showFootball ? <FootballTeamList/> : <HandballTeamList/>}
        </>
    );
}

export default App;