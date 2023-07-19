import "./Home.scss";
import MenuBar from "../MenuBar/MenuBar";
import { ToastContainer, toast } from "react-toastify";
import HoldingCards from "../../components/HoldingCards";

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
