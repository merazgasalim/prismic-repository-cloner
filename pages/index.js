import { Container, Heading } from "@chakra-ui/react";

import { useState } from "react";

import AssetsFetcher from "@/components/AssetsFetcher";
import AssetsDownloader from "@/components/AssetsDownloader";
import AssetsUploader from "@/components/AssetsUploader";
import DocumentsMigrator from "@/components/DocumentsMigrator";

export default function Home() {
  const [assets, setAssets] = useState([]);
  const [newAssets, setNewAssets] = useState([]);
  const [isEnabled, setEnabled] = useState({});

  return (
    <Container maxW={"5xl"}>
      <Heading textAlign={"center"}>Prismic Migration Tool</Heading>
      <AssetsFetcher
        assets={assets}
        setAssets={setAssets}
        setEnabled={setEnabled}
      />
      <AssetsDownloader
        assets={assets}
        isEnabled={isEnabled}
        setEnabled={setEnabled}
      />
      <AssetsUploader
        assets={assets}
        setNewAssets={setNewAssets}
        isEnabled={isEnabled}
        setEnabled={setEnabled}
      />
      <DocumentsMigrator newAssets={newAssets} isEnabled={isEnabled} />
    </Container>
  );
}
