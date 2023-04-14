const Kpi = (props) => {
  return (
    <>
      <div className="kpi">
        <div>{props.name}</div>
        <div className="kpiValue">
          {props.value}
          {props.symbol}
        </div>
      </div>
    </>
  );
};
export default Kpi;
