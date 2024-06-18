
import { BrowserRouter, Route } from "react-router-dom";
import Routes from "./components/routes-nav/Routes";
import { signup } from "./services/authService";

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes signup={signup} />
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
