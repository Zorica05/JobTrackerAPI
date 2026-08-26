import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import "./App.css";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Login />;
  }

  return <Jobs />;
}

export default App;
