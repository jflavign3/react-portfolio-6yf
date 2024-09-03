import { FaPlus } from "react-icons/fa";

import "./holdingCard.scss";
import { useState } from "react";
import KpiEditable from "../../KpiEditable.js";
import * as React from "react";
import { FaRegSave } from "react-icons/fa";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AddHoldingCard = (props) => {
  //debugger;
  const { id, name, symbol, qty, initialPrice } = props.currentHolding;
  const saveHolding = props.saveHolding;

  const [isOpen, setIsOpen] = useState(false);
  const [initialPriceValue, setInitialPrice] = useState(0);
  const [qtyValue, setQty] = useState(0);
  const [currencyValue, setCurrency] = useState("CAD");
  const [symbolValue, setSymbol] = useState("");
  const [nameValue, setName] = useState("");
  const [typeIdValue, setTypeId] = useState(1);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const handleTypeIdChange = (event) => {
    setTypeId(event.target.value);
  };

  const buildHolding = (id) => {
    const holding = {
      id: id, // Assign a value to 'id'
      name: nameValue, // Assign a value to 'name'
      symbol: symbolValue,
      qty: qtyValue,
      currency: currencyValue,
      initialPrice: initialPriceValue,
      typeId: typeIdValue,
    };

    saveHolding(holding);
  };

  return (
    <>
      {!isOpen ? ( // Use ternary operator here
        <div
          className="holding-card holding-card--addnew kpiEditableRow"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <FaPlus className="buttonIconLarge" />
        </div>
      ) : (
        <div className={`holding-card holding-card-expanded`}>
          <div className="holding-card-row4">
            <div
              className="saveButton"
              onClick={() => {
                buildHolding(id);
              }}
            >
              <FaRegSave id="saveButton"></FaRegSave>
            </div>

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

              <div className="kpiEditableRow select-label">
                <FormControl fullWidth>
                  <InputLabel>Currency</InputLabel>
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
          </div>
        </div>
      )}
    </>
  );
};
export default AddHoldingCard;
