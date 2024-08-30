import * as React from "react";
import "./overview.scss";
import { Chart } from "react-google-charts";
import { GetDbData } from "../../DAL/GetDbData";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import HoldingGrid from "../HoldingGrid/HoldingGrid";

export const options = {
  is3D: true,
  chartArea: { width: 500, height: "80%", bottom: 10 },
  legend: { position: "right", alignment: "center" },
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

  const pieDataRef = useRef(pieData); //useref to have value on first load, by the callback click

  const GetHoldingByType = async (type) => {
    var db = await GetDbData();
    const HoldingType_ = JSON.parse(JSON.stringify(HoldingTypeEnum));

    const res = db.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === HoldingType_[type[0]] ?? 1) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);

    //debugger;
    setGridData(res);
  };

  const ConvertRawDataToHarmonizedCPG = (data) => {
    var grandTotal = 0;
    var CPGtotal = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 2) {
        //debugger;
        CPGtotal += Number(currentValue.initialPrice);
        currentValue.currentPrice = Number(currentValue.initialPrice);
      } else {
        accumulator.push(currentValue);
      }
      /*  console.log(
        Number(currentValue.currentPrice * currentValue.qty) +
          "  " +
          currentValue.symbol
      );*/
      //debugger;
      grandTotal += Number(currentValue.currentPrice * currentValue.qty);

      return accumulator;
    }, []);
    console.log(grandTotal);
    res.push({ name: "CPG", currentValue: CPGtotal });
    return res;
  };

  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        var selection = chartWrapper.getChart().getSelection();
        if (selection.length > 0) {
          var item = selection[0];
          if (item.row != null) {
            var selectedRow = pieDataRef.current[item.row + 1];
            setPieSelection(selectedRow);
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
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.typeId === 3) {
        total += Number(currentValue.currentPrice * currentValue.qty);
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
        total += Number(currentValue.currentPrice * currentValue.qty);
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
        total += Number(currentValue.currentPrice * currentValue.qty);
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

  const SetPieChartData = async (forceRefresh = false) => {
    setIsLoading(true);
    let data = await GetDbData(forceRefresh);
    setGridData(data);

    if (pieStyle === PieStyleEnum.StocksOnly) {
      data = ConvertRawDataToStocksOnly(data);
    } else {
      data = ConvertRawDataToHarmonizedCPG(data);
      data = ConvertRawDataToHarmonizedWorldIndex(data);
      data = ConvertRawDataToHarmonizedEmergingMarkets(data);
      data = ConvertRawDataToHarmonizedStocks(data);
    }

    var i = 0;
    const pieArray = data.reduce((accumulator, currentValue) => {
      //debugger;
      var value = Number(currentValue.currentValue);
      if (currentValue.currency === "USD") {
        value = value * 1.38;
      }

      const modifiedObject = [currentValue.name, Math.ceil(value)];
      const header = ["Holding", "Amount"];

      if (i === 0) {
        accumulator.push(header);
      }
      accumulator.push(modifiedObject);
      i++;
      return accumulator;
    }, []);

    setPieData(pieArray);
    setIsLoading(false);
  };

  useEffect(() => {
    if (HoldingType != -1 && HoldingType != undefined) {
      setGridData([]);
      GetHoldingByType(HoldingType);
    }
  }, [HoldingType]);

  useEffect(() => {
    SetPieChartData();
    setGridData([]);
  }, [pieStyle]);

  useEffect(() => {
    setGridData([]);
    pieDataRef.current = pieData;
  }, [pieData]);

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
          <Button onClick={() => SetPieChartData(true)}>Refresh</Button>
        </ButtonGroup>
      </div>
      <div id="pieWrapper">
        <Chart
          chartType="PieChart"
          data={pieData}
          options={options}
          chartEvents={chartEvents}
          width={"100%"}
          height={"300px"}
        />
      </div>
      {gridData.length > 0 && <HoldingGrid data={gridData}></HoldingGrid>}
    </div>
  );
};
export default Overview;
