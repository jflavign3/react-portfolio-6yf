import { holdings } from "./data.js";
import Kpi from "./Kpi.js";
import StopLossSlider from "./StopLossSlider.js";
import { useState } from "react";
import loading from "./images/loading.gif";
import usa from "./images/usa.png";
import canada from "./images/canada.png";
import { GetData } from "./GetData.js";

//const url = "/.netlify/functions/helloWorld";
let didInit = false;

const HoldingCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);

  const InitData = async () => {
    //console.log("fetching");
    //'for of' works with await inside, not foreach (for better way see https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971)

    var updatedHoldings = await GetData();
    //  debugger;
    for (const holding of updatedHoldings) {
      try {
        var foundIndex = stateHoldings.findIndex((x) => x.id === holding.id);
        if (foundIndex === -1) {
          stateHoldings.push(holding);
        } else {
          stateHoldings[foundIndex] = holding; //no need to use setholdings! bad?
        }
        // console.log(stateHoldings);
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoading(false);
    console.log(stateHoldings);
  };

  if (!didInit) {
    didInit = true;
    //console.log(`setting did init. Holding data:${holdings.length}`);
    setStateHoldings(holdings); //set inital data without prices, so that the card render immediately. Price will come after
    //debugger;
    //console.log("setting to did init " + JSON.stringify(stateHoldings));

    InitData();
  } else {
    //console.log("already set to did init " + JSON.stringify(stateHoldings));
  }

  if (isLoading) {
    console.log("still fetching stock data");
  }
  if (!isLoading) {
    console.log("finished fetching stock data");
    //console.log(stateHoldings);
  }

  return (
    <>
      <section className="section" id="tours">
        <div className="section-center featured-center">
          {stateHoldings.map((currentHolding) => {
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
            } = currentHolding;
            return (
              <article className="holding-card" key={id}>
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
                        className={
                          dayChange >= 0 ? "changePositive" : "changeNegative"
                        }
                      >
                        {dayChange}%
                      </span>
                      <span> </span>
                      <span>{lastUpdate}</span>
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

                  <div className="holding-card-row4">
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
