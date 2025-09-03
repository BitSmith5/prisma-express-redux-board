import Kanban from './components/kanban';
import ReduxStatusNotifications from './components/ReduxStatusNotifications';
import { useAutoResetStatus } from './hooks/useAutoResetStatus';

function App() {
  useAutoResetStatus();
  
  return (
    <>
      <ReduxStatusNotifications />
      <Kanban />
    </>
  )
}

export default App
