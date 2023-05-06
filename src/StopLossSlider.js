import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import "./material.css";

function getMarks(props) {
  return [
    {
      value: props.currentValue,
      label: "Current: " + props.currentValue + "$",
    },
  ];
}

function valueLabelFormat(value) {
  return `${value}$`;
}

function calculateValue(value) {
  return value;
}

function StopLossSlider(props) {
  const [value, setValue] = React.useState(props.stopLossValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(`From Slider: stopLossValue=${props.stopLossValue}`);

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
        value={value}
        min={min}
        step={1}
        max={max}
        marks={getMarks(props)}
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="on"
        aria-labelledby="non-linear-slider"
        sx={{
          "& .MuiSlider-mark": {
            height: "11px",
            width: "11px",
          },
          "& .MuiSlider-markLabel": {
            color: "#1976d2",
            fontWeight: "Bold",
          },
          "& .MuiSlider-root": {
            marginTop: "40px",
          },
        }}
      />
      <Typography id="non-linear-slider" gutterBottom>
        <p>Stop loss trigger at -{calculateStopLossTrigger(value, props)}</p>
        Guranteed gain {calculateGuranteed(value, props)}
      </Typography>
    </Box>
  );
}

function calculateStopLossTrigger(movingStopLossValue, props) {
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
