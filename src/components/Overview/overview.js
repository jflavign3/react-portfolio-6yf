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
  BY_HOLDING_TYPE: 0,
  STOCKS_ONLY: 1,
};

const HOLDING_TYPE = {
  STOCKS: 1,
  CPG: 2,
  WORLD_INDEXES: 3,
  EMERGING_MARKETS: 4,
};

const USD_TO_CAD_RATE = 1.38;

const Overview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [bigTotal, setBigTotal] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [pieStyle, setPieStyle] = useState(PIE_STYLE.BY_HOLDING_TYPE);
  const [selectedHoldingType, setSelectedHoldingType] = useState({});
  //const pieDataRef = useRef(pieData);

  // Data transformation functions
  const calculateHoldingValue = (holding) => {
    const value = holding.value || holding.currentPrice * holding.qty;
    return holding.currency === "USD" ? value * USD_TO_CAD_RATE : value;
  };

  const handlePieStyleChange = (newStyle) => {
    setPieStyle(newStyle);
    setGridData([]);
  };

  const getHoldingsForType = async (type) => {
    const data = await GetDbData();

    const filteredData = data.filter(
      (item) => item.typeId === (HOLDING_TYPE[type[0]] ?? HOLDING_TYPE.STOCKS)
    );

    setGridData(filteredData);
  };

  const aggregateHoldingsByType = (data, typeId, name) => {
    const total = data.reduce((sum, item) => {
      if (item.typeId === typeId) {
        return sum + Number(item.value || 0); // Default to 0 if value is undefined
      }
      return sum;
    }, 0);
    return { name, totalValueOfHoldingType: total };
  };

  const transformDataForChart = (rawData) => {
    // debugger;
    if (pieStyle === PIE_STYLE.STOCKS_ONLY) {
      return rawData.filter((item) => item.typeId === HOLDING_TYPE.STOCKS);
    }

    // debugger;
    const holdingsData = [
      aggregateHoldingsByType(rawData, HOLDING_TYPE.STOCKS, "STOCKS"),
      aggregateHoldingsByType(rawData, HOLDING_TYPE.CPG, "CPG"),
      aggregateHoldingsByType(
        rawData,
        HOLDING_TYPE.WORLD_INDEXES,
        "WORLD_INDEXES"
      ),
      aggregateHoldingsByType(
        rawData,
        HOLDING_TYPE.EMERGING_MARKETS,
        "EMERGING_MARKETS"
      ),
    ];

    // debugger;
    return holdingsData;
  };

  const formatPieData = (data) => {
    //debugger;
    const header = ["Holding", "Amount"];
    const rows = data.map((holding) => [
      holding.name,
      Math.ceil(holding.totalValueOfHoldingType),
    ]);
    return [header, ...rows];
  };

  const handleChartSelect = ({ chartWrapper }) => {
    // debugger;
    const selection = chartWrapper.getChart().getSelection();
    if (selection.length > 0 && selection[0].row != null) {
      // Use pieData directly instead of ref
      const selectedRow = pieData[selection[0].row + 1];
      if (pieStyle === PIE_STYLE.BY_HOLDING_TYPE) {
        setSelectedHoldingType(selectedRow);
      }
    }
  };

  const updatePieChartData = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const rawData = await GetDbData(forceRefresh);

      setGridData(rawData);

      const transformedData = transformDataForChart(rawData);
      // debugger;
      const formattedPieData = formatPieData(transformedData);

      // Summing up only valid numbers in the `value` property
      /*const sum = formattedPieData.reduce((acc, obj) => {
        const numValue = Number(obj[1]);
        return isNaN(numValue) ? acc : acc + numValue;
      }, 0);

      setBigTotal(sum);*/

      setPieData(formattedPieData);
    } catch (error) {
      console.error("Error updating pie chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
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

  /*useEffect(() => {
    debugger;
    updatePieChartData();
  }, [gridData]);*/

  return (
    <div className="overview">
      <ButtonGroup variant="contained" aria-label="View options">
        <Button
          onClick={() => handlePieStyleChange(PIE_STYLE.BY_HOLDING_TYPE)}
          disabled={isLoading}
        >
          By Type
        </Button>
        <Button
          onClick={() => handlePieStyleChange(PIE_STYLE.STOCKS_ONLY)}
          disabled={isLoading}
        >
          Stocks Only
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

      {gridData.length > 0 && <HoldingGrid data={gridData} />}
    </div>
  );
};

export default Overview;
