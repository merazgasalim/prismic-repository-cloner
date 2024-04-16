import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";

export default function DocumentsMigrator({newAssets,isEnabled}) {
    console.log(newAssets)
  const [loader, setLoader] = useState(false);
  const [isDone, setDone] = useState(false);
  const[nbrDocs,setNbrDocs]=useState(0)
  const[failures,setFailures]=useState(0)
  const migrateDocuments = async () => {
    try {
      setLoader(true);
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            newAssets,
        }),
      });
      const ans = await res.json();
      console.log(ans);
      if (res.status === 200) {
        setDone(true);
        setNbrDocs(ans.nbrDocs)
        setFailures(ans.failures)
      
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
      <Button
        onClick={migrateDocuments}
        isLoading={loader}
        mb={2}
        isDisabled={!isEnabled.migrateDocuments}
      >
        4. Migrate All Documents
      </Button>{" "}
      {isDone && (
        <Text as={"span"}> {nbrDocs-failures}/{nbrDocs} documents have been migrated successfully </Text>
      )}
    </Box>
  );
}
