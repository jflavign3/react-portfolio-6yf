import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "../../material.css";
import { FaLock, FaUnlock } from "react-icons/fa";

function getMarks(props) {
  const car = [
    {
      value: Number(props.currentValue),
      label: props.currentValue && "Current: " + props.currentValue + "$", //if current value is 0, wont display text
    },
  ];
  return car;
}

function valueLabelFormat(value) {
  return `${value}$`;
}

function calculateValue(value) {
  return value;
}

function StopLossSlider(props) {
  const [value, setValue] = React.useState(props.stopLossValue);
  const [isLocked, setIsLocked] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    //debugger;
    props.onChange(newValue);
  };

  //console.log(`From Slider: stopLossValue=${props.stopLossValue}`);

  var max =
    props.stopLossValue > props.currentValue
      ? props.stopLossValue
      : props.currentValue;
  max = max * 1.04; //buffer for label

  var min =
    props.stopLossValue < props.currentValue
      ? props.stopLossValue
      : props.currentValue;
  min = min * 0.9; //give 10% buffer

  return (
    <Box sx={{ width: 430 }}>
      <Slider
        disabled={isLocked}
        value={value}
        min={min}
        step={1}
        max={max}
        marks={getMarks(props)} //{props.currentValue && getMarks(props)} //if currentvalue is true (not 0), then call getmarks
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay={props.currentValue === 0 ? "off" : "on"} //=== 0 is optional
        aria-labelledby="non-linear-slider"
        sx={{
          "& .MuiSlider-mark": {
            height: "11px",
            width: "11px",
          },
          "& .MuiSlider-markLabel": {
            color: "#1976d2",
            fontWeight: "Bold",
            paddingRight: "10%",
          },
          "& .MuiSlider-root": {
            marginTop: "40px",
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "gainsboro",
            color: "#1976d2",
            fontWeight: "bold",
          },
        }}
      />

      <div
        className="button"
        onClick={() => {
          setIsLocked(!isLocked);
          console.log(`isLocked ${isLocked}`);
        }}
      >
        {isLocked ? (
          <FaLock id="lockButton" className="buttonIcon" />
        ) : (
          <FaUnlock id="lockButton" className="buttonIcon" />
        )}
      </div>

      <Typography id="non-linear-slider" gutterBottom>
        Stop loss trigger: {calculateStopLossTrigger(value, props)}
        <br />
        Guranteed gain: {calculateGuranteed(value, props)}
      </Typography>
    </Box>
  );
}

function calculateStopLossTrigger(movingStopLossValue, props) {
  if (props.currentValue === 0) return "...loading";
  var stopLossRatio = 1 - movingStopLossValue / props.currentValue;
  var stopLossTrigger = stopLossRatio * 100;
  var price = props.currentPrice - props.currentPrice * stopLossRatio;
  return stopLossTrigger.toFixed(2) + "% (" + price.toFixed(2) + "$)";
}

function calculateGuranteed(movingStopLossValue, props) {
  var stopLossRatio = (movingStopLossValue / props.investment - 1) * 100;
  var gain = movingStopLossValue - props.investment;
  return stopLossRatio.toFixed(2) + "% (" + gain.toFixed(2) + "$)";
}

export default StopLossSlider;
