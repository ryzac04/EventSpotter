
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./contexts/authContext";
import AppContent from "./components/appContent/AppContent";

import './App.css';

/** EventSpotter Application */

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <AuthProvider>
                        <AppContent /> 
                    </AuthProvider>
                </BrowserRouter>
            </header>
        </div>
    );
}

export default App;