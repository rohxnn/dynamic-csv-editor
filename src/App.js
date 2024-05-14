import './App.css'
//component
import Home from './components/home/Home';

function App() {
  return (
    <>
    <header>
    <h1>Dynamic CSV Editor</h1>
    </header>
    <div className='container'>
      <Home></Home>
    </div>
    </>
  );
}

export default App;
