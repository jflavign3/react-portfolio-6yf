import { useState } from "react";
import {  DeleteHolding, GetDbData } from "../../DAL/GetDbData.js";
import { GetLiveData } from "../../DAL/GetLiveData.js";
import HoldingCard from "./HoldingCard.js";
import AddHoldingCard from "./AddHoldingCard.js";
import { toast } from "react-toastify";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

let toDeleteId = 0;
let didInit = false;

const HoldingCards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stateHoldings, setStateHoldings] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [open, setOpen] = useState(false);

  //to do, put in TS
  const deleteHoldingConfirmation = async (id) => {    
    toDeleteId = id;
    handleOpen();       
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
  };

  const expandCard = (id) => {
    setActiveCardId(id);
  };

  const inMarketHours = () =>{    
  //  debugger;

    /*
    var offset = new Date().getTimezoneOffset();// getting offset to make time in gmt+0 zone (UTC) (for gmt+5 offset comes as -300 minutes)
var date = new Date();
date.setMinutes ( date.getMinutes() + offset);// date now in UTC time
            
var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
date.setMinutes ( date.getMinutes() + easternTimeOffset);*/

    var today = new Date();    
    var hour = today.getHours;
    
    if (hour >= 17 || hour < 9){
      return false;
    }

    if (hour === 9){
      return today.getMinutes >= 30; 
    }

    if (hour === 16){
      return today.getMinutes < 30; 
    }
          
    return true;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const RefreshData = async (skipLiveRefresh) => {
    
    let dbData = await GetDbData();
  
    setStateHoldings(dbData);  //set inital data without prices, so that the card render immediately. Price will come after
//**note that the state value in not available yet (event loop?).  Use fucntional argument to get value right away ex ()=>
      
    if(skipLiveRefresh) return;

    toast.info(
     `Getting market data.`
    );    

    let liveData = await GetLiveData(dbData); //get new data, update array and database
   
    setStateHoldings(liveData); //refresh the array of holdings

    toast.success(
      `Finished getting market data.`
    );
    setIsLoading(false);
  };

  
  if (!didInit) {
    didInit = true;
    console.log(`initializing. Set stale data.`); 

    if (inMarketHours()) {
      console.log(`In market hours, refreshing data on init`);
      RefreshData(false);   //shoulnt have usestate inside a condition !!! but here we go
    } else {
      
      toast.info(
        `Markets are closed`
      );
      RefreshData(true);
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
