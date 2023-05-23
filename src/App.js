import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import HoldingCards from "./HoldingCards";

function App() {
  return (
    <>
      <ErrorBoundary>
        <HoldingCards></HoldingCards>
      </ErrorBoundary>
    </>
  );
}

export default App;
