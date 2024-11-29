const asyncHandler = require("../utils/AsyncHandling");
const { logger } = require("../utils/logger");
const { uploadFile,downloadFile } = require("../utils/PinataHandling");
const { createResponse } = require("../utils/ResponseHandling");

const uploadonipfs =asyncHandler(async (req, res) => {
    const response= await uploadFile();
    logger.info("File uploaded to IPFS");
    logger.info("response"+response);
    return createResponse(res, 200, response);
});

const downloadonipfs = asyncHandler(async (req, res) => {
    const response= await downloadFile("bafkreidoaj7j555ck5uzpvkzlzkqwcjvoj5adlxw5jc6tnf6znd76mqkka");
    logger.info("File downloaded from IPFS in(web3Controller)");
    logger.info("response in web3Controller "+response);
    return createResponse(res, 200, response);
});

module.exports = {
    uploadonipfs,
    downloadonipfs
}