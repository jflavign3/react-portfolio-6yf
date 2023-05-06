import { holdings } from "./data.js";
import Kpi from "./Kpi.js";
import StopLossSlider from "./StopLossSlider.js";
import { useState, useEffect } from "react";
import loading from "./images/loading.gif";
import usa from "./images/usa.png";

//const url = "/.netlify/functions/helloWorld";
const url = "/.netlify/functions/getStock?symbol=";

const HoldingCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);

  useEffect(() => {
    //must stay inside useEffect, otherwise, must delcare as a useCallback and put ii in the useffect dependency array https://devtrium.com/posts/async-functions-useeffect
    const InitData = async () => {
      console.log("INIT DATA");

      //'for of' works with await inside, not foreach (for better way see https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)
      for (const holding of holdings) {
        try {
          const response = await fetch(url + holding.symbol); //coudl remove await and add promises to array, then wait all
          const { price, change } = await response.json();

          console.log(`price of ${holding.symbol} = ${price}`);
          holding.currentPrice = Number(price).toFixed(2);
          holding.currentValue = Number(price * holding.qty).toFixed(2);
          holding.dayChange = Number(change * 100).toFixed(2);
          holding.change = Number(
            (holding.currentValue / holding.investment - 1) * 100
          ).toFixed(2);

          var foundIndex = stateHoldings.findIndex((x) => x.id === holding.id);
          if (foundIndex === -1) {
            stateHoldings.push(holding);
          } else {
            stateHoldings[foundIndex] = holding; //not need to use setGoldings!
          }
          // console.log(stateHoldings);
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    };

    setStateHoldings(holdings); //set inital data without prices, so that the card render immediately. Price will come after  WHY WARNING?
    InitData();
  }, []);

  if (isLoading) {
    console.log("still fetching stock data");
  }
  if (!isLoading) {
    console.log("finished fetching stock data");
  }

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
              stopLossPrice,
              qty,
            } = holding;
            return (
              <article className="holding-card" key={id}>
                <div className="holding-info">
                  <div className="holding-card-row1">
                    <h4>{name}</h4>
                    <div id="flag-price">
                      <img className="flag" alt="usa" src={usa}></img>
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
                    {/*   <Kpi
                      name="Last value of SP setting"
                      value={stopLossPrice * qty}
                      symbol="$"
                      ></Kpi>*/}
                  </div>

                  <div className="holding-card-row3">
                    <StopLossSlider
                      stopLossValue={stopLossPrice * qty}
                      currentValue={currentValue}
                      currentPrice={currentPrice}
                      investment={investment}
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
