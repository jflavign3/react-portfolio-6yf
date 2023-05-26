import { useState } from "react";
import { GetStaleData } from "./GetStaleData.js";
import { GetLiveData } from "./GetLiveData.js";
import HoldingCard from "./HoldingCard.js";

let didInit = false;

const HoldingCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketHours, setIsMarketHours] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);

  const RefreshData = async () => {
    setStateHoldings(await GetLiveData());
    setIsLoading(false);
  };

  if (!didInit) {
    didInit = true;
    console.log(`initializing. Set stale data.`);
    setStateHoldings(GetStaleData()); //set inital data without prices, so that the card render immediately. Price will come after
    //why cant do await?

    if (isMarketHours) {
      console.log(`In market hours, refrshing data on init`);
      RefreshData();
    } else {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    //console.log("still fetching stock data");
  }
  if (!isLoading) {
    console.log("finished fetching stock data");
    console.log(stateHoldings);
  }

  return (
    <>
      <section className="section" id="tours">
        <div className="section-center featured-center">
          {stateHoldings.map((currentHolding) => {
            return (
              <HoldingCard
                key={currentHolding.id}
                isLoading={isLoading}
                currentHolding={currentHolding}
              ></HoldingCard>
            );
          })}
        </div>
      </section>
    </>
  );
};
export default HoldingCards;
