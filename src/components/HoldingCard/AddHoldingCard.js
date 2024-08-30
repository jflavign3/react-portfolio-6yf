import { FaPlus } from "react-icons/fa";

import "./holdingCard.scss";
import { useState } from "react";
import usa from "../../images/usa.png";
import canada from "../../images/canada.png";
import KpiEditable from "../../KpiEditable.js";
import * as React from "react";
import { FaRegSave } from "react-icons/fa";

const AddHoldingCard = (props) => {
  //debugger;
  const { id, name, symbol, qty, currency, typeId, initialPrice } =
    props.currentHolding;
  const saveHolding = props.saveHolding;

  const [isOpen, setIsOpen] = useState(false);
  const [initialPriceValue, setInitialPrice] = useState(initialPrice);
  const [qtyValue, setQty] = useState(qty);
  const [currencyValue, setCurrency] = useState(currency);
  const [symbolValue, setSymbol] = useState(symbol);
  const [nameValue, setName] = useState(name);
  const [typeIdValue, setTypeIdValue] = useState(typeId);

  const buildHolding = (id) => {
    const holding = {
      id: id, // Assign a value to 'id'
      name: nameValue, // Assign a value to 'name'
      symbol: symbolValue,
      qty: qtyValue,
      currency: currencyValue,
      initialPrice: initialPriceValue,
      typeId: typeId,
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
                  name="currency"
                  value={currencyValue}
                  onChange={setCurrency}
                ></KpiEditable>
                <KpiEditable
                  name="symbol"
                  value={symbolValue}
                  onChange={setSymbol}
                ></KpiEditable>
              </div>
              <KpiEditable
                name="name"
                value={nameValue}
                onChange={setName}
              ></KpiEditable>
              <KpiEditable
                name="typeId"
                value={typeIdValue}
                onChange={setTypeIdValue}
              ></KpiEditable>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddHoldingCard;
