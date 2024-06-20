import "./App.scss";
import ErrorBoundary from "./ErrorBoundary";
import { ToastContainer } from "react-toastify";

import { useState, useEffect } from "react";
import MenuBar from "./components/MenuBar/MenuBar";
import HoldingCards from "./components/HoldingCard/HoldingCards";
import Overview from "./components/Overview/overview";

function App() {
  const [page, setPage] = useState("");

  const SetCurrentPage = async (page) => {
    console.log(`Page ${page.name} was selected.`);
    sessionStorage.setItem("__page", page.name);
    setPage(page.name);
  };

  return (
    <>
      <ErrorBoundary>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position="top-center"
        />

        <div className="overviewPage">
          <div className="leftMenuForBigScreen">
            <MenuBar setCurrentPage={SetCurrentPage}></MenuBar>
          </div>

          {page === "Overview" ? (
            <Overview />
          ) : page === "Setup" ? (
            <div id="masterFlex">{<HoldingCards></HoldingCards>}</div>
          ) : page === "Week" ? (
            <Overview />
          ) : (
            <Overview />
          )}
        </div>

        {
          <div id="bottomMenuForSmallScreen">
            <div id="spacer"></div>
            <MenuBar setCurrentPage={SetCurrentPage}></MenuBar>
          </div>
        }
      </ErrorBoundary>
    </>
  );
}

export default App;
