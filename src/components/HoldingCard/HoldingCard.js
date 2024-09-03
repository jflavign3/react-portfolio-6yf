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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const HoldingCard = (props) => {
  //debugger;
  const {
    id,
    name,
    symbol,
    currentPrice,
    dayChange,
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

  const [initialPriceValue, setInitialPrice] = useState(initialPrice);
  const [qtyValue, setQty] = useState(qty);
  const [currencyValue, setCurrency] = useState(currency);
  const [symbolValue, setSymbol] = useState(symbol);
  const [stopLossPriceValue, setStopLossPrice] = useState(stopLossPrice);
  const [nameValue, setName] = useState(name);
  const [typeIdValue, setTypeId] = useState(typeId);

  const buildHolding = (id) => {
    const holding = {
      id: id, // Assign a value to 'id'
      name: nameValue, // Assign a value to 'name'
      symbol: symbolValue,
      currentPrice: currentPrice,
      dayChange: dayChange,
      stopLossPrice: stopLossPriceValue,
      qty: qtyValue,
      currency: currencyValue,
      lastUpdate: lastUpdate,
      initialPrice: initialPriceValue,
      typeId: typeId,
    };

    saveHolding(holding);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const handleTypeIdChange = (event) => {
    setTypeId(event.target.value);
  };

  const calculatePercentageChange = (initial, current) => {
    if (initial === 0) return 0; // Prevent division by zero
    return (current - initial) / initial;
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
            value={(qty * initialPrice).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          ></Kpi>
          <Kpi
            name="Cur. Value"
            value={(typeId === 2
              ? initialPrice
              : qty * currentPrice
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          ></Kpi>
          <Kpi
            name="Change"
            value={calculatePercentageChange(
              initialPrice,
              currentPrice
            ).toLocaleString("en-US", {
              style: "percent",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          ></Kpi>

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
                  value={initialPriceValue}
                  onChange={setInitialPrice}
                  sign="$"
                ></KpiEditable>
                <KpiEditable
                  name="qty"
                  value={qtyValue}
                  onChange={setQty}
                ></KpiEditable>
              </div>
              <div className="kpiEditableRow">
                <KpiEditable
                  name="name"
                  value={nameValue}
                  onChange={setName}
                ></KpiEditable>
                <KpiEditable
                  name="symbol"
                  value={symbolValue}
                  onChange={setSymbol}
                ></KpiEditable>
              </div>
              <div className="kpiEditableRow">
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Currency
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currencyValue}
                    label="Currency"
                    onChange={handleCurrencyChange}
                  >
                    <MenuItem value={"CAD"}>CAD</MenuItem>
                    <MenuItem value={"USD"}>USD</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={typeIdValue}
                    label="Type"
                    onChange={handleTypeIdChange}
                  >
                    <MenuItem value={1}>Stock</MenuItem>
                    <MenuItem value={2}>CPG</MenuItem>
                    <MenuItem value={3}>World Index</MenuItem>
                    <MenuItem value={4}>Emerging</MenuItem>
                    <MenuItem value={0}>other</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            {stopLossPrice && (
              <div className="holding-card-row5">
                <StopLossSlider
                  stopLossValue={stopLossPrice * qty}
                  currentValue={Math.ceil(currentPrice * qty)}
                  currentPrice={currentPrice}
                  investment={initialPrice * qty}
                  qty={qty}
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
