
import { BrowserRouter } from "react-router-dom";

import { MessageProvider } from "./contexts/MessageContext";
import { AuthProvider } from "./contexts/AuthContext";
import AppContent from "./components/appContent/AppContent";

import './App.css';

/** 
 * EventSpotter Application 
 * 
 * Main entry point of the EventSpotter application.
 * Provides routing using BrowserRouter and wraps the entire application with ErrorProvider and AuthProvider to manage error states and authentication context throughout the app. 
*/

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <BrowserRouter>
                    <MessageProvider>
                        <AuthProvider>
                            <AppContent />
                        </AuthProvider>
                    </MessageProvider>
                </BrowserRouter>
            </header>
        </div>
    );
};

export default App;