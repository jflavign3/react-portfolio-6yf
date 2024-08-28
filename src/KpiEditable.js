import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

const Kpi = (props, sign) => {
  const handleInputChange = (event) => {
    props.onChange(event.target.value); // Call the onChange handler with the new value
  };

  return (
    <>
      <div className="kpi">
        <div className="kpiValue">
          <FormControl
            fullWidth
            sx={{ m: 1, width: "15ch" }}
            variant="standard"
          >
            <InputLabel htmlFor="standard-adornment-amount">
              {props.name}
            </InputLabel>
            <Input
              id="standard-adornment-amount"
              value={props.value}
              onChange={handleInputChange} // Handle change and call the parent onChange
              startAdornment={
                <InputAdornment position="start"> {props.sign}</InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
    </>
  );
};
export default Kpi;
