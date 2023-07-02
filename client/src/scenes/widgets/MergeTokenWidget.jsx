import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoins, incrementCoinCount, decrementCoinCount } from "state";
import { Box, Typography, Paper } from "@mui/material";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const MergeTokenWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coins);
  const coinCounts = useSelector((state) => state.coinCounts); // added
  const token = useSelector((state) => state.token);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const getTokens = async () => {
    const response = await fetch("http://localhost:3001/mergeTokens", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setCoins({ coins: data }));
  };

  // const handleCheckout = async (coinAmount) => {
  //   console.log(coinAmount); // should log the amount of the clicked coin
  //   const response = await fetch("http://localhost:3001/stripe/create-checkout-session", {
  //     method: "POST",
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}` 
  //     },
  //     body: JSON.stringify({ userId, coinAmount })
  //   });
  //   const data = await response.json();
  //   window.location.href = data.url;
  // };

  const handleCheckout = async () => {
    console.log(`Total coins: ${totalCoins}, Total price: ${totalPrice}`);
    const response = await fetch("http://localhost:3001/stripe/create-checkout-session", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, totalCoins, totalPrice }) 
    });
    const data = await response.json();
    window.location.href = data.url;
  };


  const handleIncrement = (coinId, coinPrice) => { // added
    dispatch(incrementCoinCount(coinId));
    setTotalCoins(prevCount => prevCount + 1);
    setTotalPrice(prevPrice => prevPrice + coinPrice);
  };

  const handleDecrement = (coinId, coinPrice) => { // added
    dispatch(decrementCoinCount(coinId));
    setTotalCoins(prevCount => prevCount > 0 ? prevCount - 1 : 0);
    setTotalPrice(prevPrice => prevPrice > 0 ? prevPrice - coinPrice : 0);
  };

  useEffect(() => {
    let count = 0;
    let price = 0;
    let total_coins = 0;
  
    coins.forEach(coin => {
      count += coinCounts[coin._id] || 0; /// this 0 for default value when click on increment button from another coin it
      total_coins += (coinCounts[coin._id] || 0) * coin.amount;
      price += (coinCounts[coin._id] || 0) * coin.price;
    });
  
    setTotalCoins(total_coins);
    setTotalPrice(price);
  }, [coins, coinCounts]);

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {coins.map(({ _id, name, amount, price, image, description }) => (
        <Card key={_id} sx={{ m: 2, maxWidth: 500 }}>
          <CardMedia
            sx={{ height: 140 , width: 240 }}
            image={image || "http://localhost:3001/assets/coin1.jpg"} // use a default image in case some coins don't have one
            title={name}
          />
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Arial, sans-serif', mt: 2 }}>{name}</Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Count: {coinCounts[_id]}</Typography> {/* added */}
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button size="small" onClick={() => handleDecrement(_id, price)} variant="contained" sx={{ mt: 1, mb: 1, backgroundColor: '#f50057', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>REMOVE</Button> {/* added */}
            <Button size="small" onClick={() => handleIncrement(_id, price)} variant="contained" sx={{ mt: 1, mb: 1, backgroundColor: '#3f51b5', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>ADD</Button> {/* added */}
          </CardActions>
        </Card>
      ))}
      {/* Checkout Section */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      <Box sx={{ maxWidth: 500, padding: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Arial, sans-serif', mt: 2 }}>
          Checkout
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', mt: 1 }}>
          Total Coins: {totalCoins}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', mt: 1 }}>
          Total Price: {totalPrice} €
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button onClick={handleCheckout} variant="contained" sx={{ backgroundColor: '#3f51b5', color: '#fff', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
            Checkout
          </Button>
        </Box>
      </Box>
    </Box>
    </Box>
  );
};
export default MergeTokenWidget;
