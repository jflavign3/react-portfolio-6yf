import loading from "./images/loading.gif";
import usa from "./images/usa.png";
import canada from "./images/canada.png";
import Kpi from "./Kpi.js";
import StopLossSlider from "./components/Slider/StopLossSlider.js";
import * as React from "react";

const HoldingCard = (props) => {
  //debugger;
  const {
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

  const isLoading = props.isLoading;
  //console.log("name:" + name);
  //console.log("loading:" + props.isLoading);
  return (
    <article className="holding-card">
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
          <StopLossSlider
            stopLossValue={stopLossPrice * qty}
            currentValue={currentValue}
            currentPrice={currentPrice}
            investment={investment}
          />
        </div>
      </div>
    </article>
  );
};
export default HoldingCard;
