import RequestHandler from "./requestHandler.js";
import ResponseHandler from "./responseHandler.js";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,idtoken",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "X-Requested-With": "*",
};
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await app(event);
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(response),
    };
  } catch (err) {
    console.error(err, err.stack);
    return {
      statusCode: err.statusCode || 500,
      headers: headers,
      body: JSON.stringify({
        code: err.code,
        message: err.message,
      }),
    };
  }
};

const app = async (event) => {
  const requestHandler = RequestHandler.create(JSON.parse(event?.body));
  const response = await requestHandler.execute();
  const responseHandler = ResponseHandler.create(response);
  const resp = responseHandler.translator();
  return resp;
};
