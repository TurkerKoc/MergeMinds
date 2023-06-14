
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const PricingTable = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const iframeSrc = `
    <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
    <stripe-pricing-table pricing-table-id="prctbl_1NIJ2CFeAkHftgQCbtamKdbo"
    publishable-key="pk_test_51NIDePFeAkHftgQCcIP0TKwixTGI1pxkOaFk4g9s7JEIpqlCuZoE1bAART5xg7o5WcuDBqFJFEMjPzLeV9ofd6hA00GeD6UdL8">
    </stripe-pricing-table>
  `;

  

  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      // Adjust the iframe height to match its content
      const { contentWindow, contentDocument } = iframeRef.current;
      const height = contentDocument.documentElement.scrollHeight;
      contentWindow.postMessage({ type: 'setHeight', height }, '*');
    }

    


  }, []);


  return (
    <WidgetWrapper style={{ height: "fit-content" }}>
      <FlexBetween>
        <Typography color={dark} variant="h3" fontWeight="990" style={{ marginBottom: "1rem" }}>
          Payment
        </Typography>
       
      </FlexBetween>
      <iframe
        ref={iframeRef}
        title="Payment Button"
        srcDoc={iframeSrc}
        width="100"
        height="800"
        style={{ width: "100%", height: "424px", borderRadius: "0.75rem" }}
      />

  

  
    </WidgetWrapper>
  );
};

export default PricingTable;
