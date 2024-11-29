const { PinataSDK } = require("pinata-web3")
const fs = require("fs")
require("dotenv").config()
const path = require("path")
const asyncHandler = require("./AsyncHandling")
const { hash } = require("crypto")
const { logger } = require("./logger")



const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL
})

const uploadFile= async (data) => {
  try {

    const tempDir = path.join(__dirname, "../temp"); // Ensure path is correct
    const filePath = path.join(tempDir, "newTemp.txt");

    // Ensure `temp` directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create the new file
    fs.writeFileSync(filePath, JSON.stringify(data));

    const blob = new Blob([fs.readFileSync(filePath)], { type: "text/plain" });
    const file = new File([blob], "temp.txt", { type: "text/plain" });
    const upload = await pinata.upload.file(file);
    console.log(upload)
    return upload;
  } catch (error) {
    console.log(error)
  }
}

const downloadFile = async (hash) => {
  try{
  const file = await pinata.gateways.get(hash);
  logger.info("File downloaded from IPFS");
  logger.info("response "+file.data);
  return file.data;
  }catch(error){
    logger.error("Error in downloading file from IPFS");
    logger.error("error "+error);
  }
}


module.exports = {
    uploadFile,
    downloadFile
    }