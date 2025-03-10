import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Navbar";
import Button from "./components/Button"; // Import the button component
import fridgy from "./fridgy2.png"
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="navbar">
            <Navbar />
        </div>
        <p>
          Brrnie
        </p>
        
      <div className="fridge">
        <img src={fridgy} alt="fridge"  className="fridge-image" />
      </div>
      <div>
      <Button onClick={() => alert("Button clicked!")}>Open Fridge</Button>
      </div>
          More shit incoming
        
      </header>
    </div>
  );
}

export default App;
