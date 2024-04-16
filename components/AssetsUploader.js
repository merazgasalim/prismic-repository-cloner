import {
    Box,
    Button, 
    Text,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  
  export default function AssetsUploader({ assets ,setNewAssets,isEnabled,setEnabled }) {
    const [loader, setLoader] = useState(false);
    const[isDone,setDone]=useState(false)
    const downloadAssets = async () => {
      try {
        setLoader(true);
        const res = await fetch("/api/assets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assets,
          }),
        });
        const ans = await res.json();
        console.log(ans.newAssets);
        if (res.status === 200) {
          setDone(true)
          setNewAssets(ans.newAssets)
          setEnabled((prevState) => {
            return { ...prevState, migrateDocuments: true };
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
        <Button onClick={downloadAssets} isLoading={loader} mb={2} isDisabled={!isEnabled.uploadAssets}>
          3. Upload assets
        </Button>{" "}
       {isDone&& <Text as={"span"}> All assets have been uploaded successfully </Text>}
      </Box>
    );
  }
  