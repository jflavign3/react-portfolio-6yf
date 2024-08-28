import "./menubar.scss";
import menuData from "./menuData";
import logo from "../../images/logo.gif";
import { useState } from "react";
import { FaCog, FaBook } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const MenuBar = ({ setCurrentPage }) => {
  const [itemActive, setItemActive] = useState("Overview");

  const menuClicked = (item) => {
    setItemActive(item.name);
    console.log(`set item active ${item.name}`);
    setCurrentPage(item);
  };

  return (
    <div className="menuBar">
      <ul>
        <li id="showLogo">
          <a href="_blank">
            <img alt="logo" id="logo" src={logo} />
          </a>
        </li>
        {menuData.map((item) => {
          const { name } = item;
          return (
            <li key={name} onClick={() => menuClicked(item)} className="">
              <a
                className={itemActive === name ? "itemActive" : "itemDisabled"}
              >
                {item.image === "fa fa-cog" ? (
                  <FaCog size={"1.5rem"} />
                ) : item.image === "fa fa-chart" ? (
                  <FaBook size={"1.5rem"} />
                ) : (
                  <MdDashboard size={"1.5rem"} />
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
