import Home from './pages';
import logo from './logo.svg';
import './styles/App.css'
import './styles/globals.scss'

function App() {
  return (
    <div className="App">
      <section>
        <Home />
      </section>
      <section className="App-header">
        <img width={60} height={60} src={logo} className="App-logo" alt="logo" />
      </section>
    </div>
  );
}

export default App;
