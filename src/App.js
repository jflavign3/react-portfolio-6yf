import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import Home from "./components/Home/Home";

function App() {
  return (
    <>
      <ErrorBoundary>
        <Home></Home>
      </ErrorBoundary>
    </>
  );
}

export default App;
