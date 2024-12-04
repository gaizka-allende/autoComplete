import "./App.css";
import { AutoComplete } from "./AutoComplete";

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AutoComplete
        apiURL="localhost:5173/"
        onResultClick={(result) => {
          console.log(`${result} clicked`);
        }}
      />
    </div>
  );
}

export default App;
