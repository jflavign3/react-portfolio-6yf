import "./holdingCard.scss";
import loading from "../../images/loading.gif";
import usa from "../../images/usa.png";
import canada from "../../images/canada.png";
import Kpi from "../../Kpi.js";
import StopLossSlider from "../Slider/StopLossSlider.js";
import * as React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const HoldingCard = (props) => {
  //debugger;
  const {
    id,
    name,
    ticker,
    currentPrice,
    investment,
    currentValue,
    dayChange,
    change,
    stopLossPrice,
    qty,
    currency,
    lastUpdate,
  } = props.currentHolding;
  const deleteHolding = props.deleteHolding;
  const isLoading = props.isLoading;
  const expandCard = props.expandCard;

  const isExpanded = props.activeCardId === id;

  //const [showStopLoss, setShowStopLoss] = React.useState(true);
  //console.log("name:" + name);
  //console.log("loading:" + props.isLoading);
  return (
    //<div className="holding-card" className={isExpanded && "holding-card-expanded"}>
    <div
      className={`holding-card ${isExpanded ? "holding-card-expanded" : ""}`}
    >
      <div className="holding-info">
        <div className="holding-card-row1">
          <h4>{name}</h4>
          <div id="flag-price">
            {currency === "USD" ? (
              <img className="flag" alt="usa" src={usa}></img>
            ) : (
              <img className="flag" alt="canada" src={canada}></img>
            )}

            <h4 id="currentPrice">
              {isLoading ? (
                <img id="loadImage" alt="loading" src={loading}></img>
              ) : (
                currentPrice
              )}
            </h4>
          </div>
        </div>
        <div className="holding-card-row2">
          <span>{ticker}</span>
          <div>
            <span
              id="dayChange"
              className={dayChange >= 0 ? "changePositive" : "changeNegative"}
            >
              {dayChange}%
            </span>
            <span> </span>
            <span>{lastUpdate}</span>
          </div>
        </div>
        <div className="holding-card-row3">
          <Kpi name="Investment" value={investment} symbol="$"></Kpi>
          <Kpi name="Cur. Value" value={currentValue} symbol="$"></Kpi>
          <Kpi name="Change" value={change} symbol="%"></Kpi>
          {}
        </div>

        <div className="holding-card-row4">
          <div
            className="buttonIcon"
            onClick={() => {
              deleteHolding(id);
            }}
          >
            <FaTrashAlt id="trashButton" className="buttonIcon"></FaTrashAlt>
          </div>
          <div>
            {!isExpanded ? (
              <AiOutlinePlus
                className="expand-btn"
                onClick={() => {
                  expandCard(id);
                }}
              />
            ) : (
              <AiOutlineMinus
                className="expand-btn"
                onClick={() => {
                  expandCard(null);
                }}
              />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="holding-card-row5">
            <StopLossSlider
              stopLossValue={stopLossPrice * qty}
              currentValue={currentValue}
              currentPrice={currentPrice}
              investment={investment}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default HoldingCard;
