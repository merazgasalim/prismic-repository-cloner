import {
  Box,
  Button, 
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

export default function AssetsDownloader({ assets,isEnabled,setEnabled }) {
  const [loader, setLoader] = useState(false);
  const[isDone,setDone]=useState(false)
  const downloadAssets = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assets,
        }),
      });
      const ans = await res.json();
      console.log(ans);
      if (res.status === 200) {
        setDone(true)
        setEnabled((prevState) => {
          return { ...prevState, uploadAssets: true };
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
      <Button onClick={downloadAssets} isLoading={loader} mb={2} isDisabled={!isEnabled.downloadAssets} >
        2. Download assets
      </Button>{" "}
     {isDone&& <Text as={"span"}> All assets have been downloaded successfully </Text>}
    </Box>
  );
}
