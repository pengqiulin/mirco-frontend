import {useEffect} from 'react'
import actions from './shared/actions'
import SharedModule from './shared/index'
import './App.css';

function App() {
  useEffect(() => {
    
      actions.onGlobalStateChange((state) => {
        const { count } = state;
        console.log('子应用的count',count);
      })

  }, [])
  const shared = SharedModule.getShared();
  const count = shared.getCount();
  return (
    <div className="App">
     <h1>reactAPP2</h1>
     <h3>{count}</h3>
    </div>
  );
}

export default App;
