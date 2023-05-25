import "./menubar.scss";
import menuData from "./menuData";
import logo from "../../images/logo.gif";
import { useState } from "react";

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
                <i className={image}></i>
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
