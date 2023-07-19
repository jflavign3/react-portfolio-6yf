import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import Home from "./components/Home/Home";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <ErrorBoundary>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position="top-center"
        />
        <Home></Home>
      </ErrorBoundary>
    </>
  );
}

export default App;
