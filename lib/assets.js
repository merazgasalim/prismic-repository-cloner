const fs = require("fs");
const path = require("path");
const https = require("https");
const axios = require("axios");
const FormData = require("form-data");

// The path of the directory to save the image
const dirPath = "./images";

export const downloadAsset = async (imageUrl, imageId, imageName) => {
  return new Promise((resolve, reject) => {
    //create folder with image id to avoid files with same name
    const folderName = `${dirPath}/${imageId}`;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }

    const file = fs.createWriteStream(path.join(folderName, imageName));
    https
      .get(imageUrl, async (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close();
          console.log(`Image downloaded as ${imageName}`);
          resolve({ msg: `Image downloaded as ${imageName}` });
        });
      })
      .on("error", (err) => {
        fs.unlink(imageName);
        console.error(`Error downloading image: ${err.message}`);
        reject({ err: `Error downloading image: ${err.message}` });
      });
  });
};

export const uploadAsset = async (
  fileId,
  filename,
  token,
  assets,
  newAssets,
  i
) => {
  return new Promise((resolve, reject) => {
    let data = new FormData();
    data.append(
      "file",
      fs.createReadStream(
        `${process.env.Project_Path}/images/${fileId}/${filename}`
      )
    );

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://asset-api.prismic.io/assets",
      headers: {
        repository: process.env.Destination_Repo,
        Authorization: `Bearer ${token}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        newAssets.push({ ...response.data, prevID: assets.items[i].id });
        resolve({ msg: JSON.stringify(response.data) });
      })
      .catch((error) => {
        console.log(error);
        reject({ err: error });
      });
  });
};

export const getToken = async () => {
  // Get an auth token
  const authResponse = await fetch("https://auth.prismic.io/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: process.env.Repo_Login_Email,
      password: process.env.Repo_Login_Password,
    }),
  });

  const token = await authResponse.text();
  return token;
};
