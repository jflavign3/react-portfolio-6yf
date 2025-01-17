import * as React from "react";
import "./overview.scss";
import { Chart } from "react-google-charts";
import { GetDbData } from "../../DAL/GetDbData";
import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import HoldingGrid from "../HoldingGrid/HoldingGrid";

// Constants
const CHART_OPTIONS = {
  is3D: true,
  chartArea: { width: 500, height: "80%" },
  legend: { position: "right", alignment: "center" },
};

const PIE_STYLE = {
  HOLDING_TYPE: 0,
  STOCKS_ONLY: 1,
  GEO: 2,
};

const HOLDING_TYPE = {
  STOCKS: 1,
  CPG: 2,
  WORLD_INDEXES: 3,
};

//XAW:  USA 67%  EMRG: 10%  EAFE 22.5% (japan 25%, UK 15%, FR: 10%, SWISS 9%, GERMANY 8%, other: 33%)
const GEO = {
  CANADA: 1,
  USA: 2,
  EUROPE: 3,
  JAPAN: 4,
  EMERGING: 5,
};

const USD_TO_CAD_RATE = 1.38;
const xawRatio = {
  ["USA"]: 0.66,
  ["JAPAN"]: 0.05,
  ["EUROPE"]: 0.165,
  ["EMERGING"]: 0.1,
};

const Overview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [pieStyle, setPieStyle] = useState(PIE_STYLE.BY_HOLDING_TYPE);
  const [selectedHoldingType, setSelectedHoldingType] = useState({});
  const pieStyleRef = useRef(pieStyle);
  const pieDataRef = useRef(pieData);

  const handlePieStyleChange = (newStyle) => {
    //debugger;
    setPieStyle(newStyle);
    pieStyleRef.current = newStyle; //to be available now
  };

  const getHoldingsForType = async (type) => {
    const data = await GetDbData();

    const filteredData = data.filter(
      (item) => item.typeId === (HOLDING_TYPE[type[0]] ?? HOLDING_TYPE.STOCKS)
    );

    setGridData(filteredData);
  };

  const getHoldingsForCountries = async (country) => {
    const data = await GetDbData();

    const geoFilters = {
      ["CANADA"]: isCanadian,
      ["USA"]: isUSA,
      ["JAPAN"]: isJapan,
      ["EUROPE"]: isEurope,
      ["EMERGING"]: isEmerging,
    };

    const filterFunction = geoFilters[country];
    const ratio = xawRatio[country];

    if (filterFunction) {
      var filteredData = data.filter(filterFunction);
    }

    const updatedData = filteredData.map((item) =>
      item.symbol === "XAW.TO" ? { ...item, value: item.value * ratio } : item
    );
    //debugger;
    console.log("set new grid data: " + JSON.stringify(updatedData));
    setGridData(updatedData);
  };

  const aggregateHoldingsByType = (data, typeId, name) => {
    // debugger;
    const total = data.reduce((sum, item) => {
      if (item.typeId === typeId) {
        return sum + Number(item.value || 0); // Default to 0 if value is undefined
      }
      return sum;
    }, 0);
    return { name, totalValueOfHoldingType: total };
  };

  const isCanadian = (item) => {
    var symbol = item.symbol.toUpperCase();
    if (
      (item.typeId === HOLDING_TYPE.CPG ||
        symbol.endsWith(".TO") ||
        symbol.endsWith(".V")) &&
      symbol != "EBIT.TO" &&
      symbol != "MNT.TO" &&
      symbol != "XAW.TO" &&
      symbol != "CWW.TO" &&
      symbol != "VFV.TO" &&
      symbol != "JAPN.TO" &&
      symbol != "ZCH.TO"
    ) {
      return true;
    }
    return false;
  };

  const isUSA = (item) => {
    var symbol = item.symbol.toUpperCase();
    if (
      (item.typeId === HOLDING_TYPE.STOCKS &&
        symbol != "YCS" &&
        !symbol.endsWith(".TO") &&
        !symbol.endsWith(".V")) ||
      symbol == "XAW.TO" ||
      symbol == "VFV.TO"
    ) {
      return true;
    }
    return false;
  };

  const isEurope = (item) => {
    var symbol = item.symbol.toUpperCase();
    if (symbol == "XAW.TO") {
      return true;
    }
    return false;
  };

  const isEmerging = (item) => {
    var symbol = item.symbol.toUpperCase();
    if (symbol == "XAW.TO") {
      return true;
    }
    return false;
  };

  const isJapan = (item) => {
    var symbol = item.symbol.toUpperCase();
    if (symbol == "XAW.TO" || symbol == "JAPN.TO") {
      return true;
    }
    return false;
  };

  const aggregateHoldingsByGeo = (data, geo, name) => {
    //debugger;
    console.log(`geo id: ` + geo);
    const total = data.reduce((sum, item) => {
      //CAD = CPG BNC, CPG EPQ, stockS with .TO
      //USA = stocks no TO, 66% of XAW
      //EUROPE:  16.5% of XAW
      //JAPAN:  JPN etf + 5.5% of XAW
      //EMERGING:  10% xaw
      var symbol = item.symbol.toUpperCase();

      if (geo == GEO.CANADA) {
        if (isCanadian(item)) {
          console.log(symbol + ` `);
          return sum + Number(item.value || 0); // Default to 0 if value is undefined
        }
      }

      if (geo == GEO.USA) {
        var value = item.value;
        if (isUSA(item)) {
          if (symbol.toUpperCase() == "XAW.TO") {
            debugger;
            value = value * xawRatio["USA"];
          }
          return sum + Number(value || 0); // Default to 0 if value is undefined
        }
      }

      if (geo == GEO.EUROPE) {
        //debugger;
        if (isEurope(item)) {
          return sum + Number(item.value * xawRatio["EUROPE"] || 0); // Default to 0 if value is undefined
        }
      }

      if (geo == GEO.JAPAN) {
        //debugger;
        if (symbol.toUpperCase() == "XAW.TO") {
          return sum + Number(item.value * xawRatio["JAPAN"] || 0); // Default to 0 if value is undefined
        } else {
          return sum + Number(value || 0);
        }
      }

      if (geo == GEO.EMERGING) {
        if (symbol.toUpperCase() == "XAW.TO") {
          return sum + Number(item.value * xawRatio["EMERGING"] || 0); // Default to 0 if value is undefined
        }
      }

      return sum;
    }, 0);
    return { name, totalValueOfHoldingType: total };
  };

  const transformDataForChart = (rawData) => {
    const header = ["Holding", "Amount"];

    if (pieStyle === PIE_STYLE.STOCKS_ONLY) {
      var holdingsData = rawData.filter(
        (item) => item.typeId === HOLDING_TYPE.STOCKS
      );
      var rows = holdingsData.map((holding) => [
        holding.name,
        Math.ceil(holding.value),
      ]);
    } else if (pieStyle === PIE_STYLE.HOLDING_TYPE) {
      // debugger;
      const holdingsData = [
        aggregateHoldingsByType(rawData, HOLDING_TYPE.STOCKS, "STOCKS"),
        aggregateHoldingsByType(rawData, HOLDING_TYPE.CPG, "CPG"),
        aggregateHoldingsByType(
          rawData,
          HOLDING_TYPE.WORLD_INDEXES,
          "WORLD_INDEXES"
        ),
      ];
      var rows = holdingsData.map((holding) => [
        holding.name,
        Math.ceil(holding.totalValueOfHoldingType),
      ]);
    } else if (pieStyle === PIE_STYLE.GEO) {
      // debugger;
      const holdingsData = [
        aggregateHoldingsByGeo(rawData, GEO.CANADA, "CANADA"),
        aggregateHoldingsByGeo(rawData, GEO.USA, "USA"),
        aggregateHoldingsByGeo(rawData, GEO.EUROPE, "EUROPE"),
        aggregateHoldingsByGeo(rawData, GEO.JAPAN, "JAPAN"),
        aggregateHoldingsByGeo(rawData, GEO.EMERGING, "EMERGING"),
      ];
      var rows = holdingsData.map((holding) => [
        holding.name,
        Math.ceil(holding.totalValueOfHoldingType),
      ]);
    }

    return [header, ...rows];
  };

  const handleChartSelect = ({ chartWrapper }) => {
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0 && selection[0].row != null) {
      const selectedRow = pieDataRef.current[selection[0].row + 1]; // Use ref to access latest data
      if (pieStyleRef.current === PIE_STYLE.BY_HOLDING_TYPE) {
        setSelectedHoldingType(selectedRow);
      }
      if (pieStyleRef.current === PIE_STYLE.GEO) {
        setGridData([]);
        getHoldingsForCountries(selectedRow[0]);
        //setSelectedGEO(selectedRow);
      }
    }
  };

  const updatePieChartData = async (forceRefresh = false) => {
    //debugger;
    console.log(`Update Pie Chart data`);
    setIsLoading(true);
    try {
      const rawData = await GetDbData(forceRefresh);

      setGridData(rawData);

      //debugger;
      const formattedPieData = transformDataForChart(rawData);

      console.log(`Set Pie  data : ` + formattedPieData);
      setPieData(formattedPieData);

      pieDataRef.current = formattedPieData; //to be available now
    } catch (error) {
      console.error("Error updating pie chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // WHEN PIE IS CLICKED in holding types
  useEffect(() => {
    //debugger;
    if (selectedHoldingType !== -1 && selectedHoldingType !== undefined) {
      setGridData([]);
      getHoldingsForType(selectedHoldingType);
    }
  }, [selectedHoldingType]);

  // Update the pie chart data when pieStyle changes
  useEffect(() => {
    updatePieChartData();
  }, [pieStyle]);

  return (
    <div className="overview">
      <ButtonGroup variant="contained" aria-label="View options">
        <Button
          onClick={() => handlePieStyleChange(PIE_STYLE.HOLDING_TYPE)}
          disabled={isLoading}
        >
          Type
        </Button>
        <Button
          onClick={() => handlePieStyleChange(PIE_STYLE.STOCKS_ONLY)}
          disabled={isLoading}
        >
          Stocks
        </Button>
        <Button
          onClick={() => handlePieStyleChange(PIE_STYLE.GEO)}
          disabled={isLoading}
        >
          COUNTRY
        </Button>
        <Button onClick={() => updatePieChartData(true)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </ButtonGroup>

      <div id="pieWrapper">
        <Chart
          chartType="PieChart"
          data={pieData}
          options={CHART_OPTIONS}
          chartEvents={[
            {
              eventName: "select",
              callback: handleChartSelect,
            },
          ]}
          width="100%"
          height="300px"
        />
      </div>
      <div className="bottomGrid">
        {gridData.length > 0 && <HoldingGrid data={gridData} />}
      </div>
    </div>
  );
};

export default Overview;
