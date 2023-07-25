import { useState } from "react";
import { GetDbData } from "../DAL/GetDbData.js";
import { GetLiveData } from "../DAL/GetLiveData.js";
import HoldingCard from "./HoldingCard/HoldingCard.js";
import AddHoldingCard from "./HoldingCard/AddHoldingCard.js";
import { ToastContainer, toast } from "react-toastify";

let didInit = false;

const HoldingCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketHours, setIsMarketHours] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);


  //to do, put in TS
  const deleteHolding = (id) => {
    var holdings = stateHoldings.filter((x) => x.id !== id);
    //debugger;
    setStateHoldings(holdings);
  };

  const expandCard = (id) => {
    setActiveCardId(id);
  };

/*
  const GetHoldings = async () => {
    //debugger;
    //var a = await GetStaleData();
    setStateHoldings(await GetStaleData()); 
  }
*/

  const RefreshData = async () => {
    //debugger;
    let dbData = await GetDbData();
    setStateHoldings(dbData);  //set inital data without prices, so that the card render immediately. Price will come after
//**note that the state value in not available yet (event loop?).  Use fucntional argument to get value right away ex ()=>
 //**note that this function is inside a condition, not supposed to use useState here..how to do it??? */ 
 
 
    toast.info(
     `Getting market data.`
    );
    setStateHoldings(await GetLiveData(dbData));
    toast.success(
      `Finished getting market data.`
    );
    setIsLoading(false);
  };

  if (!didInit) {
    didInit = true;
    console.log(`initializing. Set stale data.`);
    
 //  GetHoldings();  //set inital data without prices, so that the card render immediately. Price will come after

    if (isMarketHours) {
      console.log(`In market hours, refrshing data on init`);
      RefreshData();   //shoulnt have usestate inside a condition !!!
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

    //var aa = GetLiveData();


  return (
    <>
      <section className="section" id="tours">
        <div id="notification"></div>
        <div className="section-center featured-center">
          {stateHoldings.map((currentHolding) => {
            return (
              <HoldingCard
                key={currentHolding.id}
                isLoading={isLoading}
                currentHolding={currentHolding}
                deleteHolding={deleteHolding}
                activeCardId={activeCardId}
                expandCard={expandCard}
              ></HoldingCard>
            );
          })}
          <AddHoldingCard
                key="-1"
                isLoading="false"                
          ></AddHoldingCard>
        </div>
      </section>
    </>
  );
};
export default HoldingCards;
