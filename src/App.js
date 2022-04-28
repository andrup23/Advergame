import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Main from './views/Main';

function App() {
  return (
    <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/premios" element={<div><h1>Tu puntaje</h1></div>} />
          </Routes>
        </div>
      </Router>

  );
}

export default App;
