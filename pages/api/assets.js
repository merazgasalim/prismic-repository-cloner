import { downloadAsset, uploadAsset, getToken } from "@/lib/assets";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const token = await getToken();
        //Get all assets
        const myHeaders = new Headers();
        myHeaders.append("repository", process.env.Source_Repo);
        myHeaders.append("Authorization", `Bearer ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const ans = await fetch(
          "https://asset-api.prismic.io/assets?limit=1000",
          requestOptions
        );
        const assets = await ans.text();
        return res.status(200).json({ assets });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ reason: "server error", err });
      }
    //Download assets
    case "POST":
      try {
        const { assets } = req.body;

        for (let i = 0; i < assets.items.length; i++) {
          if (!assets.items[i]?.url) {
            console.log(assets.items[i]);
            continue;
          }
          await downloadAsset(
            assets.items[i].url,
            assets.items[i].id,
            assets.items[i].filename
          );
        }
        return res.status(200).json({ reason: "done" });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ reason: "server error", err });
      }
    case "PUT":
      const { assets } = req.body;
      const newAssets = [];
      const token = await getToken();
      try {
        for (let i = 0; i < assets.items.length; i++) {
          await uploadAsset(
            assets.items[i].id,
            assets.items[i].filename,
            token,
            assets,
            newAssets,
            i
          );
          //   let data = new FormData();
          //   data.append(
          //     "file",
          //     fs.createReadStream(
          //       `${process.env.Project_Path}/images/${assets.items[i].id}_${assets.items[i].filename}`
          //     )
          //   );

          //   let config = {
          //     method: "post",
          //     maxBodyLength: Infinity,
          //     url: "https://asset-api.prismic.io/assets",
          //     headers: {
          //       repository: process.env.Destination_Repo,
          //       Authorization: `Bearer ${token}`,
          //       ...data.getHeaders(),
          //     },
          //     data: data,
          //   };

          //   await axios
          //     .request(config)
          //     .then((response) => {
          //       console.log(JSON.stringify(response.data));
          //       newAssets.push({ ...response.data, prevID: assets.items[i].id });
          //     })
          //     .catch((error) => {
          //       console.log(error);
          //     });

          //wait 1s
         await delay(1500);
        }

        return res.status(200).json({ newAssets });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ reason: "server error", err });
      }
    default:
      return res.status(500).json({ reason: "Not allowed" });
  }
}
