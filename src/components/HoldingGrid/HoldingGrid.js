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

    // debugger;

    let res = data.reduce((accumulator, currentValue) => {
      /*accumulator.push({
        name: currentValue.name,
        value: currentValue.currentValue,
      });*/
      accumulator.push([currentValue.name, currentValue.currentValue]);
      return accumulator;
    }, []);

    res.unshift(["name", "total"]);

    setGridData(res);
  };

  useEffect(() => {
    console.log("grid update");
    FormatGridData();
  }, []);

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
