import * as prismic from "@prismicio/client";

import { getToken } from "@/lib/assets";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const { newAssets } = req.body;

      const token = await getToken();
      //Get all shared slices
      const slicesRes = await fetch("https://customtypes.prismic.io/slices", {
        headers: {
          repository: process.env.Source_Repo,
          Authorization: `Bearer ${token}`,
        },
      });
      const slices = await slicesRes.json();
      
      //Migrate all slices
      for (let i = 0; i < slices.length; i++) {
        await fetch("https://customtypes.prismic.io/slices/insert", {
          method: "POST",
          headers: {
            repository: process.env.Destination_Repo,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slices[i]),
        });
      }
      //return res.status(200).json({ ok: true });
      //Get all types
      const typesRes = await fetch(
        "https://customtypes.prismic.io/customtypes",
        {
          headers: {
            repository: process.env.Source_Repo,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const types = await typesRes.json();

      // migrate all types
      for (let i = 0; i < types.length; i++) {
        await fetch("https://customtypes.prismic.io/customtypes/insert", {
          method: "POST",
          headers: {
            repository: process.env.Destination_Repo,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(types[i]),
        });
      }

      //Get all documents
      const client = prismic.createClient(process.env.Source_Repo, {});
      let allDocuments = await client.dangerouslyGetAll();
      let failures = 0;

      //Migrate documents
      for (let i = 0; i < allDocuments.length; i++) {
        let document = JSON.stringify(allDocuments[i]);
        //Update assets id with new one
        for (let j = 0; j < newAssets.length; j++) {
          document = document.replaceAll(newAssets[j].prevID, newAssets[j].id);
        }

        const r = await fetch("https://migration.prismic.io/documents", {
          method: "POST",
          headers: {
            repository: process.env.Destination_Repo,
            "x-api-key": process.env.Migration_Api_Key,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...JSON.parse(document),
            title: `document ${i}`,
          }),
        });
        const ans = await r.text();
        console.log(ans);
        //Number of failures
        if (ans.search(`"id":`) === -1) failures++;
        await delay(1500);
      }

      return res
        .status(200)
        .json({ done: true, nbrDocs: allDocuments.length, failures });
    default:
      return res.status(500).json({ reason: "Not allowed" });
  }
}
