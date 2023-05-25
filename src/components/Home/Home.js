//import "../../styles/menubar.scss";
import "./Home.scss";
import logo from "../../images/logo.gif";
import menuData from "../MenuBar/menuData";
import MenuBar from "../MenuBar/MenuBar";

import HoldingCards from "../../HoldingCards";

const Home = () => {
  //todo: mettre menu dans un component
  return (
    <>
      <div className="leftMenuForBigScreen">
        <MenuBar></MenuBar>
      </div>

      <div id="masterFlex">
        <HoldingCards></HoldingCards>
      </div>

      <div id="bottomMenuForSmallScreen">
        <div id="spacer"></div>
        <MenuBar></MenuBar>
      </div>
    </>
  );
};
export default Home;
