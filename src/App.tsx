import "./App.css";
import { AutoComplete } from "./AutoComplete";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AutoComplete apiURL="localhost:5173/" />
    </div>
  );
}

export default App;
