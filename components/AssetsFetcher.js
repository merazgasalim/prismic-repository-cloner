import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";

export default function AssetsFetcher({ assets, setAssets, setEnabled }) {
  const [loader, setLoader] = useState(false);

  const getAssets = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/assets");
      const ans = await res.json();

      if (res.status === 200) {
        console.log(JSON.parse(ans.assets));
        setAssets(JSON.parse(ans.assets));
        setEnabled((prevState) => {
          return { ...prevState, downloadAssets: true };
        });
      } else {
        console.log(ans.reason, ans.err);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };
  return (
    <Box>
      <Button onClick={getAssets} isLoading={loader} mb={2}>
        1. Get assets list
      </Button>{" "}
      {assets?.total && (
        <Text as={"span"}>
          {" "}
          {assets?.items.length}/{assets?.total} assets found.{" "}
        </Text>
      )}
    </Box>
  );
}
