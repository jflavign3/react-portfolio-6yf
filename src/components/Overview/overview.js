import * as React from "react";
import "./overview.scss";
import { Chart } from "react-google-charts";
import { GetDbData } from "../../DAL/GetDbData";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import HoldingGrid from "../HoldingGrid/HoldingGrid";

export const options = {
  title: "Overview",
  is3D: true,
  chartArea: { width: 600, height: 500 },
};

export const PieStyleEnum = {
  ByHoldingType: 0,
  StocksOnly: 1,
};

// prettier-ignore
const HoldingTypeEnum = {
  "Stocks": 1,
  "CPG": 2,
  "World indexes": 3,
  "Emerging Markets": 4,
};

const Overview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [pieStyle, setPieStyle] = useState(0);
  const [HoldingType, setHoldingType] = useState({ stock: 2 });
  const [pieSelection, setPieSelection] = useState(0);

  //
  const GetHoldingByType = async (type) => {
    var db = await GetDbData();

    const HoldingType_ = JSON.parse(JSON.stringify(HoldingTypeEnum));

    // Accessing the value of 'CPG'
    console.log(HoldingType_[type[0]]);
    const res = db.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === HoldingType_[type[0]]) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    console.log(`build grid data for type {typeId}`);

    setGridData(res);
  };

  const ConvertRawDataToHarmonizedCPG = (data) => {
    var grandTotal = 0;
    var CPGtotal = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 2) {
        CPGtotal += Number(currentValue.currentValue);
      } else {
        accumulator.push(currentValue);
      }
      grandTotal += Number(currentValue.currentValue);

      return accumulator;
    }, []);

    console.log(`Total:${grandTotal}`);
    res.push({ name: "CPG", currentValue: CPGtotal });

    return res;
  };

  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        debugger;
        var selection = chartWrapper.getChart().getSelection();
        if (selection.length > 0) {
          var item = selection[0];
          if (item.row != null) {
            //  debugger;
            setPieSelection(pieData[item.row + 1]);
            var selectedRow = pieData[item.row + 1];
            console.log("pie clicked - Selected value: " + selectedRow);
            //debugger;
            if (pieStyle === PieStyleEnum.ByHoldingType) {
              setHoldingType(selectedRow);
            }
          }
        }
      },
    },
  ];

  const ConvertRawDataToHarmonizedWorldIndex = (data) => {
    var total = 0;
    // debugger;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 3) {
        //  debugger;
        total += Number(currentValue.currentValue);
      } else {
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    res.push({ name: "World indexes", currentValue: total });

    return res;
  };

  const ConvertRawDataToHarmonizedEmergingMarkets = (data) => {
    var total = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 4) {
        //  debugger;
        total += Number(currentValue.currentValue);
      } else {
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    res.push({ name: "Emerging Markets", currentValue: total });

    return res;
  };

  const ConvertRawDataToHarmonizedStocks = (data) => {
    var total = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 1) {
        //  debugger;
        total += Number(currentValue.currentValue);
      } else {
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    res.push({ name: "Stocks", currentValue: total });

    return res;
  };

  const ConvertRawDataToStocksOnly = (data) => {
    var total = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 1) {
        accumulator.push(currentValue);
      }

      return accumulator;
    }, []);

    res.push({ name: "Stocks", currentValue: total });

    return res;
  };

  const SetPieChartData = async () => {
    setIsLoading(true);

    console.log(`Getting pie chart data`);
    debugger;
    let data = await GetDbData();
    setGridData(data); //to send to holdingGrid

    if (pieStyle === PieStyleEnum.StocksOnly) {
      data = ConvertRawDataToStocksOnly(data);
    } else {
      data = ConvertRawDataToHarmonizedCPG(data);
      data = ConvertRawDataToHarmonizedWorldIndex(data);
      data = ConvertRawDataToHarmonizedEmergingMarkets(data);
      data = ConvertRawDataToHarmonizedStocks(data);
    }

    let total = 0;
    var totalAssets = data.reduce((accumulator, currentValue) => {
      total = Number(currentValue.currentValue); // This line seems to be unused and doesn't affect the outcome.
      if (currentValue.currency === "USD") {
        total = total * 1.38; //TO DO: get real value
      }
      return accumulator + total; // Make sure to return the updated accumulator.
    }, 0);

    var i = 0;
    const pieArray = data.reduce((accumulator, currentValue) => {
      // Clone the current object and add a new property

      var value = Number(currentValue.currentValue); // This line seems to be unused and doesn't affect the outcome.
      if (currentValue.currency === "USD") {
        value = value * 1.38; //TO DO: get real value
      }

      const modifiedObject = [currentValue.name, Math.ceil(value)];

      const header = ["Holding", "Amount"];

      if (i === 0) {
        accumulator.push(header);
      }
      // Push the modified object into the accumulator array
      accumulator.push(modifiedObject);
      i++;
      return accumulator;
    }, []); // Start with an empty array as the accumulator
    //debugger;

    console.log(`Setting pie chart data:${JSON.stringify(pieArray)}`);
    setPieData(pieArray);
    setIsLoading(false);
  };

  useEffect(() => {
    if (HoldingType != -1) {
      console.log("Useeffect - holdingType changed - changeGridData");
      setGridData([]);

      GetHoldingByType(HoldingType);
    }
  }, [HoldingType]);

  useEffect(() => {
    console.log("Useeffect - setPieChart");
    SetPieChartData();
    setGridData([]);
  }, [pieStyle]);

  return (
    <div className="overview">
      <div>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button onClick={() => setPieStyle(PieStyleEnum.ByType)}>
            By Type
          </Button>
          <Button onClick={() => setPieStyle(PieStyleEnum.StocksOnly)}>
            Stocks Only
          </Button>
          <Button>Three</Button>
        </ButtonGroup>
      </div>
      <div>
        <Chart
          chartType="PieChart"
          data={pieData}
          options={options}
          chartEvents={chartEvents}
          width={"100%"}
          height={"900px"}
        />
      </div>
      {gridData.length > 0 && (
        <HoldingGrid
          // pieStyle={pieStyle}
          // pieSelection={pieSelection}
          data={gridData}
        ></HoldingGrid>
      )}
    </div>
  );
};
export default Overview;
