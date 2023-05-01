import { holdings } from "./data.js";
import Kpi from "./Kpi.js";
import StopLossSlider from "./StopLossSlider.js";
import { useState, useEffect } from "react";

const url =
  "https://prtflioapinode.netlify.app/.netlify/functions/api/stock/MSFT%3ANASDAQ";

const HoldingCard = () => {
  const GetStock = (symbol) => {
    const [stock, setStock] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          console.log("aaa");
          const response = await fetch(url);
          const stock = await response.json();
          setStock(stock);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }, []);

    return "allo";
  };

  GetStock("msft");

  return (
    <>
      <section className="section" id="tours">
        <div className="section-center featured-center">
          {holdings.map((holding) => {
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
                    <h4 id="currentPrice">${currentPrice}</h4>
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
