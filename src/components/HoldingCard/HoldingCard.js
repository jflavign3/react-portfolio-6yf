import "./holdingCard.scss";
import { useState } from "react";
import loading from "../../images/loading.gif";
import usa from "../../images/usa.png";
import canada from "../../images/canada.png";
import Kpi from "../../Kpi.js";
import KpiEditable from "../../KpiEditable.js";
import StopLossSlider from "../Slider/StopLossSlider.js";
import * as React from "react";
import { FaTrashAlt, FaRegSave } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const HoldingCard = (props) => {
  //debugger;
  const {
    id,
    name,
    symbol,
    currentPrice,
    investment,
    currentValue,
    dayChange,
    change,
    stopLossPrice,
    qty,
    currency,
    lastUpdate,
    typeId,
    initialPrice,
  } = props.currentHolding;
  const deleteHolding = props.deleteHolding;
  const saveHolding = props.saveHolding;
  const isLoading = props.isLoading;
  const expandCard = props.expandCard;

  const isExpanded = props.activeCardId === id;

  const [value, setValue] = useState(0);
  const [initialPriceValue, setInitialPrice] = useState(initialPrice);
  const [qtyValue, setQty] = useState(qty);
  const [currencyValue, setCurrency] = useState(currency);
  const [symbolValue, setSymbol] = useState(symbol);
  const [stopLossPriceValue, setStopLossPrice] = useState(stopLossPrice);
  const [nameValue, setName] = useState(name);

  const handleValueChange = (e) => {
    debugger;
    setValue(e);
  };

  const buildHolding = (id) => {
    const holding = {
      id: id, // Assign a value to 'id'
      name: nameValue, // Assign a value to 'name'
      symbol: symbolValue,
      currentPrice: currentPrice,
      currentValue: currentValue,
      dayChange: dayChange,
      change: change,
      stopLossPrice: stopLossPriceValue,
      qty: qtyValue,
      currency: currencyValue,
      lastUpdate: lastUpdate,
      initialPrice: initialPriceValue,
    };

    saveHolding(holding);
  };

  //const [showStopLoss, setShowStopLoss] = React.useState(true);
  //console.log("name:" + name);
  //console.log("loading:" + props.isLoading);
  return (
    //<div className="holding-card" className={isExpanded && "holding-card-expanded"}>
    <div
      className={`holding-card ${isExpanded ? "holding-card-expanded" : ""} ${
        typeId === 2
          ? "border-color-CPG"
          : typeId === 3
          ? "border-color-index"
          : "border-color-stock"
      }`}
    >
      <div>
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
          <span>{symbol}</span>
          {dayChange && (
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
          )}
        </div>
        <div className="holding-card-row3">
          <Kpi
            name="Investment"
            value={qty * initialPrice} //CHANGE TO A CALCUALTED field
            symbol="$"
          ></Kpi>
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
          <div
            className="saveButton"
            onClick={() => {
              buildHolding(id);
            }}
          >
            <FaRegSave id="saveButton"></FaRegSave>
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
          <>
            <div>
              <div className="kpiEditableRow">
                <KpiEditable
                  name="initialPrice"
                  value={initialPrice}
                  onChange={setInitialPrice}
                  sign="$"
                ></KpiEditable>
                <KpiEditable
                  name="qty"
                  value={qty}
                  onChange={setQty}
                  sign="$"
                ></KpiEditable>
              </div>
              <div className="kpiEditableRow">
                <KpiEditable
                  name="currency"
                  value={currency}
                  onChange={setCurrency}
                ></KpiEditable>
                <KpiEditable
                  name="symbol"
                  value={symbol}
                  onChange={setSymbol}
                ></KpiEditable>
              </div>
              <KpiEditable
                name="name"
                value={name}
                onChange={setName}
              ></KpiEditable>
            </div>
            {stopLossPrice && (
              <div className="holding-card-row5">
                <StopLossSlider
                  stopLossValue={stopLossPrice * qty}
                  currentValue={currentValue}
                  currentPrice={currentPrice}
                  investment={investment}
                  onChange={setStopLossPrice}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default HoldingCard;
