import { ConfirmProvider } from "material-ui-confirm";
import TaskList from "./components/taskList";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <ConfirmProvider>
      <SnackbarProvider maxSnack={10}>
        <div className="App">
          <TaskList />
        </div>
      </SnackbarProvider>
    </ConfirmProvider>
  );
}

export default App;
