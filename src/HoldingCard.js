import { holdings } from "./data.js";
import Kpi from "./Kpi.js";
import StopLossSlider from "./StopLossSlider.js";
import { useState, useEffect } from "react";

//const url = "/.netlify/functions/helloWorld";
const url = "/.netlify/functions/getStock?symbol=";

const HoldingCard = () => {
  const [currentPrice, setCurrentPrice] = useState("");
  const [stateHoldings, setStateHoldings] = useState([]);

  /*  const GetStock = (symbol) => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url + symbol);
          const currentStockPrice = await response.text();
          setStock(currentStockPrice);
          console.log(`price of ${symbol} = ${currentStockPrice}`);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, []);
  };*/

  const InitData = () => {
    useEffect(() => {
      const holdingsArray = [];
      holdings.forEach((holding) => {
        //debugger;

        //GetStock(symbol); //how to move it out ?
        const fetchData = async () => {
          try {
            const response = await fetch(url + holding.symbol);
            const currentStockPrice = await response.text();
            console.log(`price of ${holding.symbol} = ${currentStockPrice}`);
            holding.currentPrice = currentStockPrice;

            var foundIndex = stateHoldings.findIndex((x) => x.id == holding.id);
            if (foundIndex == -1) {
              stateHoldings.push(holding);
            } else {
              stateHoldings[foundIndex] = holding; //not need to use setGoldings!
            }
            console.log(stateHoldings);
          } catch (error) {
            console.log(error);
          }
        };
        ////////////////////////////

        fetchData();
      });
    }, []);
  };

  //1- get data. loop it and create a new array
  InitData();
  //2-for each record  call api to get values
  //GetStock("META:NASDAQ");
  //3-update array with values

  //4- render will loop new array

  return (
    <>
      <section className="section" id="tours">
        <div className="section-center featured-center">
          {stateHoldings.map((holding) => {
            const {
              id,
              name,
              ticker,
              currentPrice,
              investment,
              currentValue,
              dayChange,
              change,
              stopLossValue,
              stopLossInitialValue,
            } = holding;
            return (
              <article className="holding-card" key={id}>
                <div className="holding-info">
                  <div className="holding-card-row1">
                    <h4>{name}</h4>
                    <h4 id="currentPrice">{currentPrice}</h4>
                  </div>
                  <div className="holding-card-row2">
                    <span>{ticker}</span>
                    <div>
                      <span id="dayChange">{dayChange}%</span>
                      <span> </span>
                      <span>11:34am</span>
                    </div>
                  </div>

                  <div className="holding-card-row3">
                    <Kpi name="Investment" value={investment} symbol="$"></Kpi>
                    <Kpi
                      name="Cur. Value"
                      value={currentValue}
                      symbol="$"
                    ></Kpi>
                    <Kpi name="Change" value={change} symbol="%"></Kpi>
                    <Kpi
                      name="Last value of SP setting"
                      value={stopLossInitialValue}
                      symbol="$"
                    ></Kpi>
                  </div>

                  <div className="holding-card-row3">
                    <StopLossSlider
                      stopLossValue={stopLossValue}
                      currentValue={currentValue}
                      currentPrice={currentPrice}
                    ></StopLossSlider>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
};
export default HoldingCard;
