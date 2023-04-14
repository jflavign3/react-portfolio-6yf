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
function calculateChange(value, curValue) {
  var change = (1 - curValue / value) * 100;

  return change.toFixed(2);
}
function StopLossSlider(props) {
  const [value, setValue] = React.useState(props.stopLossValue);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  var max =
    props.stopLossInitialValue > props.currentValue
      ? props.stopLossInitialValue
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
        }}
      />
      <Typography id="non-linear-slider" gutterBottom>
        Stop loss at {calculateChange(value, props.currentValue)}
        {"%"}
        Value on last SL setting: {props.stopLossInitialValue}
        {"$"}
      </Typography>
    </Box>
  );
}

export default StopLossSlider;
