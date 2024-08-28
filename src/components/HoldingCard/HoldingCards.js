import { useState } from "react";
import { DeleteHolding, GetDbData } from "../../DAL/GetDbData.js";
import { UpsertHolding } from "../../DAL/UpsertHolding.js";
import { GetLiveData } from "../../DAL/GetLiveData.js";
import HoldingCard from "./HoldingCard.js";
import AddHoldingCard from "./AddHoldingCard.js";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

let toDeleteId = 0;
let didInit = false;

const HoldingCards = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stateHoldings, setStateHoldings] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [open, setOpen] = useState(false);

  //to do, put in TS
  const deleteHoldingConfirmation = async (id) => {
    toDeleteId = id;
    handleOpen();
  };

  const saveHolding = async (holding) => {
    await UpsertHolding(holding);
  };

  /*
  const updateHolding = async (holding) => {
    //debugger;
    let result = await UpsertHolding(holding);    
  }
*/
  async function deleteHoldingConfirmed() {
    handleClose();
    //var holdings = stateHoldings.filter((x) => x.id !== toDeleteId);
    await DeleteHolding(toDeleteId);
    RefreshData(true);
  }

  const expandCard = (id) => {
    setActiveCardId(id);
  };

  const inMarketHours = () => {
    /*
    var offset = new Date().getTimezoneOffset();// getting offset to make time in gmt+0 zone (UTC) (for gmt+5 offset comes as -300 minutes)
var date = new Date();
date.setMinutes ( date.getMinutes() + offset);// date now in UTC time
            
var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
date.setMinutes ( date.getMinutes() + easternTimeOffset);*/

    var today = new Date();
    var hour = today.getHours();

    if (hour >= 17 || hour < 9) {
      return false;
    }

    if (hour === 9) {
      return today.getMinutes >= 30;
    }

    if (hour === 16) {
      return today.getMinutes < 30;
    }

    return true;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ConvertRawDataToStopLossOnly = (data) => {
    var total = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.stopLossPrice > 0) {
        //debugger;
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    return res;
  };

  const ConvertRawDataToRemoveCPG = (data) => {
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId !== 2) {
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    return res;
  };

  const RefreshData = async (skipLiveRefresh, forceRefresh) => {
    let dbData = await GetDbData();

    //dbData = ConvertRawDataToRemoveCPG(dbData);
    // let stopLosses = ConvertRawDataToStopLossOnly(dbData);
    setStateHoldings(dbData); //set inital data without prices, so that the card render immediately. Price will come after

    //**note that the state value in not available yet (event loop?).  Use fucntional argument to get value right away ex ()=>

    if (!inMarketHours() && !forceRefresh) {
      toast.info(`Markets are closed`);
      skipLiveRefresh = true;
    }

    if (skipLiveRefresh) return;
    setIsLoading(true);

    toast.info(`Getting market data.`);

    let liveData = await GetLiveData(dbData); //get new data, update array and database

    liveData = ConvertRawDataToStopLossOnly(dbData);

    setStateHoldings(liveData); //refresh the array of holdings

    toast.success(`Finished getting market data.`);
    setIsLoading(false);
  };

  if (!didInit) {
    didInit = true;
    console.log(`initializing. Set stale data.`);

    RefreshData(true); //shoulnt have usestate inside a condition !!! but here we go
  }

  /*
  if (!isLoading) {
    console.log("finished fetching stock data");
    console.log(stateHoldings);
  }*/

  return (
    <>
      {" "}
      <div className="refreshButton">
        <Button variant="outlined" onClick={() => RefreshData(false, true)}>
          Refresh
        </Button>
      </div>
      <section className="section" id="tours">
        <div id="notification"></div>
        <div className="section-center featured-center">
          {stateHoldings.map((currentHolding) => {
            return (
              <HoldingCard
                key={currentHolding.id}
                isLoading={isLoading}
                currentHolding={currentHolding}
                deleteHolding={deleteHoldingConfirmation}
                saveHolding={saveHolding}
                activeCardId={activeCardId}
                expandCard={expandCard}
              ></HoldingCard>
            );
          })}
          <AddHoldingCard key="-1" isLoading="false"></AddHoldingCard>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Are you sure you want to delete?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                The holding will be permanently lost?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose()}>Cancel</Button>
              <Button onClick={deleteHoldingConfirmed} autoFocus>
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </section>
    </>
  );
};
export default HoldingCards;
