const AWS = require("aws-sdk");
const fs = require("fs");
const s3 = new AWS.S3();

exports.uploadNew = async (req, folder) => {
  try {
    const fileContent = fs.readFileSync(req);
    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: req, // File name you want to save as in S3
      Body: fileContent,
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });
    // const destparams = {
    //   Bucket: folder,
    //   // Key: width.toString() + "-" + dstKey,
    //   Body: req,
    //   ContentType: "image",
    // };
    // const putResult = await s3.putObject(destparams).promise();
    // console.log(putResult);
  } catch (error) {
    console.log("catch error = ", error);
    return;
  }
};
