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
        <img width={90} height={90} src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </section>
    </div>
  );
}

export default App;
