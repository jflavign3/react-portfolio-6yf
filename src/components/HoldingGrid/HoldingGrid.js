import { useState, useEffect } from "react";

import { Chart } from "react-google-charts";
//import { GetDbData } from "../../DAL/GetDbData";

/*
export const data_ = [
  ["Department", "Revenues Change"],
  ["Shoes", { v: 12, f: "12.0%" }],
  ["Sports", { v: -7.3, f: "-7.3%" }],
  ["Toys", { v: 0, f: "0%" }],
  ["Electronics", { v: -2.1, f: "-2.1%" }],
  ["Food", { v: 22, f: "22.0%" }],
];*/

export const data_ = [
  ["Department", "Revenues Change"],
  ["Shoes", "12.0%"],
  ["Sports", "-7.3%"],
];

export const options = {
  allowHtml: true,
  showRowNumber: true,
};

export const formatters = [
  {
    type: "NumberFormat",
    column: 1,
    options: {
      prefix: "$",
      negativeColor: "red",
      negativeParens: true,
    },
  },
];

const HoldingGrid = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stateHoldings, setStateHoldings] = useState([]);
  const [gridData, setGridData] = useState([]);

  const FormatGridData = async () => {
    setIsLoading(true);

    console.log(`formatting grid data`);

    let total = 0; // Initialize total outside the reduce

    let res = data.reduce((accumulator, currentStock) => {
      accumulator.push([currentStock.name, currentStock.value]);

      // Update the total
      total += Number(currentStock.value);

      return accumulator;
    }, []);
    res.sort((a, b) => a[1] - b[1]);

    res.unshift(["name", "total"]);
    res.push(["Total", total]);

    setGridData(res);
  };

  useEffect(() => {
    console.log("grid update");
    FormatGridData();
  }, [data]);

  return (
    <>
      <Chart
        chartType="Table"
        width="100%"
        //height="400px"
        data={gridData}
        options={options}
        formatters={formatters}
      />
    </>
  );
};
export default HoldingGrid;
