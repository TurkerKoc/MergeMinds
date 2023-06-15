import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoins } from "state";
import { Box, Typography, Paper } from "@mui/material";

const MergeTokenWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins);
  const token = useSelector((state) => state.token);

  const getTokens = async () => {
    const response = await fetch("http://localhost:3001/mergeTokens", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setCoins({ coins: data }));
  };

  const handleCheckout = async (coinAmount) => {
    console.log(coinAmount); // should log the amount of the clicked coin
    const response = await fetch("http://localhost:3001/stripe/create-checkout-session", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, coinAmount })
    });
    const data = await response.json();
    window.location.href = data.url;
  };

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {coins.map(({ _id, name, amount }) => (
        <Paper key={_id} elevation={3} sx={{ m: 2, p: 2, minWidth: 200, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>{name}</Typography>
          <Typography variant="body1">{amount}</Typography>
          <button onClick={() => handleCheckout(amount)}>Check out</button>
        </Paper>
      ))}
    </Box>
  );
};
export default MergeTokenWidget;
