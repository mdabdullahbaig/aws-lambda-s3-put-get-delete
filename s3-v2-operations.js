import AWS from "aws-sdk";
const client = new AWS.S3();

// Put single objects
export const putSingleObjectInS3 = async (body) => {
  const { client_id, blocklist_id, file } = body;

  const decodedFile = Buffer.from(file.base64_string, "base64");

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${client_id}/${blocklist_id}_${file.file_name}`,
    Body: decodedFile,
    ContentType: file.file_type,
  };

  try {
    const response = await client.putObject(params).promise();
    console.log("S3 File Upload Response", response);
  } catch (err) {
    console.log("S3 File Upload Error", err);
  }
};

// Get single objects
export const getSingleObjectInS3 = async (body) => {
  const { client_id, blocklist_id, file } = body;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${client_id}/${blocklist_id}_${file.file_name}`,
  };

  try {
    const response = await client.getObject(params).promise();
    console.log("S3 File Get Response", response);

    const base64String = response.Body.toString("base64");
    console.log("ReadableStream to Base64 String", base64String);
    return base64String;
  } catch (err) {
    console.log("S3 File Get Error", err);
  }
};

// Delete single objects
export const deleteSingleObjectInS3 = async (body) => {
  const { client_id, blocklist_id, file } = body;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${client_id}/${blocklist_id}_${file.file_name}`,
  };

  try {
    const response = await client.deleteObject(params).promise();
    console.log("S3 File Delete Response", response);
  } catch (err) {
    console.log("S3 File Delete Error", err);
  }
};

// Put multiple objects
export const putMultipleObjectInS3 = async (body) => {
  let result = [];
  const promises = body.files.map((file) => {
    return new Promise(async (resolve, reject) => {
      const decodedFile = Buffer.from(file.base64_string, "base64");
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${body.client_id}/${body.blocklist_id}_${file.file_name}`,
        Body: decodedFile,
        ContentType: file.file_type,
      };
      console.log("Params", params);
      try {
        const response = await client.putObject(params).promise();
        result.push({
          file_name: file.file_name,
          file_type: file.file_type,
          file_url: `s3://${process.env.BUCKET_NAME}/${body.client_id}/${body.blocklist_id}_${file.file_name}`,
        });
        resolve(response);
      } catch (err) {
        console.log("S3 File Upload Error", err);
        reject(err);
      }
    });
  });

  await Promise.all(promises);
  return result;
};

// Get multiple objects
export const getMultipleObjectInS3 = async (body) => {
  let result = [];
  const promises = body.files.map((file) => {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${body.client_id}/${body.blocklist_id}_${file.file_name}`,
      };

      try {
        const response = await client.getObject(params).promise();
        const base64String = response.Body.toString("base64");
        result.push({
          file_name: file.file_name,
          file_type: file.file_type,
          base64_string: base64String,
        });
        resolve(response);
      } catch (err) {
        console.log("S3 File Get Error", err);
        reject(err);
      }
    });
  });

  await Promise.all(promises);
  return result;
};

// Delete multiple objects
export const deleteMultipleObjectInS3 = async (body) => {
  let result = [];
  const promises = body.files.map((file) => {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${body.client_id}/${body.blocklist_id}_${file.file_name}`,
      };

      try {
        const response = await client.deleteObject(params).promise();
        result.push({
          file_name: file.file_name,
          file_type: file.file_type,
        });
        resolve(response);
      } catch (err) {
        console.log("S3 File Delete Error", err);
        reject(err);
      }
    });
  });

  await Promise.all(promises);
  return result;
};
