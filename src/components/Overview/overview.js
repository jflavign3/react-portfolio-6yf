import * as React from "react";
import "./overview.scss";
import { Chart } from "react-google-charts";
import { GetDbData } from "../../DAL/GetDbData";
import { useState, useEffect } from "react";
import { MdOutlineFormatAlignJustify } from "react-icons/md";

export const options = {
  title: "My Daily Activities",
  is3D: true,
};

const Overview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pieData, setPieData] = useState([]);

  //
  const ConvertRawDataToHarmonizedCPG = (data) => {
    var grandTotal = 0;
    var CPGtotal = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.isCPG === true) {
        //  debugger;
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

  const ConvertRawDataToHarmonizedWorldIndex = (data) => {
    var total = 0;
    const res = data.reduce((accumulator, currentValue) => {
      if (currentValue.isWorldIndexETF === true) {
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

  const SetPieChartData = async () => {
    setIsLoading(true);

    console.log(`Getting pie chart data`);
    //to do : set in cache for cards to use

    debugger;
    let data = await GetDbData();

    data = ConvertRawDataToHarmonizedCPG(data);
    data = ConvertRawDataToHarmonizedWorldIndex(data);

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
      //debugger;
      // Push the modified object into the accumulator array
      accumulator.push(modifiedObject);
      i++;
      return accumulator;
    }, []); // Start with an empty array as the accumulator

    setPieData(pieArray);
    setIsLoading(false);

    // debugger;
  };

  useEffect(() => {
    SetPieChartData();
  }, []);

  return (
    <div className="overview">
      <Chart
        chartType="PieChart"
        data={pieData}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};
export default Overview;
