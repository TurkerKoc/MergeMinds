import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoins, incrementCoinCount, decrementCoinCount } from "state";
import { Box, Typography, Paper , useTheme} from "@mui/material";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import WidgetWrapper from "components/WidgetWrapper";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const MergeTokenWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const coins = useSelector((state) => state.coins);
  const coinCounts = useSelector((state) => state.coinCounts); // added
  const token = useSelector((state) => state.token);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const lastVisited = localStorage.getItem("lastVisited");

  const getTokens = async () => {
    const response = await fetch("http://localhost:3001/mergeTokens", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setCoins({ coins: data }));
  };


  const handleCheckout = async () => {
    console.log(`Total coins: ${totalCoins}, Total price: ${totalPrice}`);
    const response = await fetch("http://localhost:3001/stripe/create-checkout-session", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ userId, totalCoins, totalPrice, lastVisited }) 
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
    <div>
    <WidgetWrapper>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {coins.map(({ _id, name, amount, price, image, description }) => (
        <Card key={_id} sx={{ m: 2, maxWidth: 500 }}>
          <CardMedia
            sx={{ height: 100 , width: 240 , objectFit: 'cover'}}
            image={image || "http://localhost:3001/assets/blue_coin.png"} // use a default image in case some coins don't have one
            title={name}
          />
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold', textAlign: 'center', fontFamily: 'Arial, sans-serif', mt: 2 }}>{name}</Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>Unit Price {price} € </Typography> {/* added */}
          <CardActions sx={{ justifyContent: 'center' }}>
          <Button size="small" onClick={() => handleDecrement(_id, price)} variant="contained" sx={{ color: palette.primary, backgroundColor: 'red', color: '#fff', cursor: "pointer"}}>
            REMOVE
            </Button>
            <Box 
              sx={{ 
                mx: 2,
                p: 1,
                border: '2px solid', 
                borderColor: 'gray',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 40
              }}
            >
              <Typography variant="h6">{coinCounts[_id] || 0}</Typography>
            </Box>
            <Button size="small" onClick={() => handleIncrement(_id, price)} variant="contained" sx={{ mt: 1, mb: 1,  fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}>
              ADD
            </Button>
          </CardActions>
        </Card>
      ))}
      </Box>
      </WidgetWrapper>
      {/* Checkout Section */}
      {/* Checkout Section */}
      <Box height="50px" />
      <WidgetWrapper sx={{ marginTop: 0, width: '40%', height: '50%', margin: 'auto' }}>
      <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif' ,  fontWeight: 'bold', fontSize:17}}>
               Summary
              </Typography>
      <Card sx={{ display: 'flex', flexDirection: 'column', padding: 1.5, boxShadow: '0 3px 5px 2px rgba(0,0,0,0.1)'}}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt:1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="http://localhost:3001/assets/cart3.png" alt="Minus" />
              <Typography variant="body1" sx={{ mx:2, fontFamily: 'Arial, sans-serif' ,  fontWeight: 'bold', fontSize:17}}>
                Total Coins
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif' ,  fontWeight: 'bold', fontSize:17}}>
              {totalCoins}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="http://localhost:3001/assets/euro1.png" alt="Minus" />
              <Typography variant="body1" sx={{ mt: 0, mx:2, fontFamily: 'Arial, sans-serif' ,  fontWeight: 'bold', fontSize:17}}>
                Total Price
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif' ,  fontWeight: 'bold', fontSize:17}}>
              {totalPrice} €
            </Typography>
          </Box>
          </Card>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button onClick={handleCheckout} variant="contained" sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', width: '70%'}}>
            Proceed to Checkout
          </Button>
        </Box>



    </WidgetWrapper>
    </div>
  );
};
export default MergeTokenWidget;
