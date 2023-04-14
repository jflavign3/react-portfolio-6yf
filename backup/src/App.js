import "./App.css";
import ErrorBoundary from "./ErrorBoundary";
import HoldingCard from "./HoldingCard";

function App() {
  return (
    <>
      <ErrorBoundary>
        <HoldingCard></HoldingCard>
      </ErrorBoundary>
    </>
  );
}

export default App;
