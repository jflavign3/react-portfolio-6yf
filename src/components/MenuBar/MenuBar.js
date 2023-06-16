import "./menubar.scss";
import menuData from "./menuData";
import logo from "../../images/logo.gif";
import { useState } from "react";
import { FaHome, FaCog, FaBook } from "react-icons/fa";

const MenuBar = () => {
  const [itemActive, setItemActive] = useState("Home");

  return (
    <div className="menuBar">
      <ul>
        <li id="showLogo">
          <a href="_blank">
            <img alt="logo" id="logo" src={logo} />
          </a>
        </li>
        {menuData.map((item) => {
          const { name, image } = item;
          return (
            <li key={name} className="">
              <a
                href="_blank"
                className={itemActive === name ? "itemActive" : "itemDisabled"}
              >
                {item.image == "fa fa-cog" ? (
                  <FaCog className="buttonIcon" />
                ) : item.image == "fa fa-chart" ? (
                  <FaBook className="buttonIcon" />
                ) : (
                  <FaHome className="buttonIcon" />
                )}{" "}
                <br />
                {name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default MenuBar;
