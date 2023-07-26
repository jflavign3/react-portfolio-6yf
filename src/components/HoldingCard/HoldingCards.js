import { useState } from "react";
import { DeleteHolding, GetDbData } from "../../DAL/GetDbData.js";
import { GetLiveData } from "../../DAL/GetLiveData.js";
import HoldingCard from "./HoldingCard.js";
import AddHoldingCard from "./AddHoldingCard.js";
import { ToastContainer, toast } from "react-toastify";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FaHeadphonesAlt } from "react-icons/fa";

let toDeleteId = 0;
let didInit = false;

const HoldingCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketHours, setIsMarketHours] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [open, setOpen] = useState(false);

  //to do, put in TS
  const deleteHoldingConfirmation = async (id) => {    
    toDeleteId = id;
    handleOpen();       
  };

  async function deleteHoldingConfirmed() {    
    
    handleClose();    
    //var holdings = stateHoldings.filter((x) => x.id !== toDeleteId);    
    let dbData = await DeleteHolding(toDeleteId);        
    RefreshData(true);
  };

  const expandCard = (id) => {
    setActiveCardId(id);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const RefreshData = async (skipLiveRefresh) => {
    let dbData = await GetDbData();
    debugger;
    setStateHoldings(dbData);  //set inital data without prices, so that the card render immediately. Price will come after
//**note that the state value in not available yet (event loop?).  Use fucntional argument to get value right away ex ()=>
 //**note that this function is inside a condition, not supposed to use useState here..how to do it??? */ 
     
    if(skipLiveRefresh) return;

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
 

    if (isMarketHours) {
      console.log(`In market hours, refrshing data on init`);
      RefreshData(false);   //shoulnt have usestate inside a condition !!!
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
                deleteHolding={deleteHoldingConfirmation}
                activeCardId={activeCardId}
                expandCard={expandCard}
              ></HoldingCard>
            );
          })}
          <AddHoldingCard
                key="-1"
                isLoading="false"                
          ></AddHoldingCard>
         
        <Dialog
        open={open}
        onClose={()=>setOpen(false)}
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
          <Button onClick={()=>handleClose()}>Cancel</Button>          
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
