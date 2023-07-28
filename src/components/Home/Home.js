import "./Home.scss";
import MenuBar from "../MenuBar/MenuBar";
import HoldingCards from "../../components/HoldingCard/HoldingCards";

const Home = () => {
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
