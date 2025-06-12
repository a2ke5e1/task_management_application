import Tasks from "./Tasks";
import Projects from "./Projects";
import Teams from "./Teams";

function App() {
  return (
    <div className="flex flex-col gap-8">
      <Tasks />
      <Projects />
      <Teams />
    </div>
  );
}

export default App;
