import { ApiAction } from "./constants.js";
import { requestValidation } from "./requestValidation.js";
// import {
//   putSingleObjectInS3,
//   putMultipleObjectInS3,
//   getSingleObjectInS3,
//   getMultipleObjectInS3,
//   deleteSingleObjectInS3,
//   deleteMultipleObjectInS3,
// } from "./s3-v3-operations.js";
import {
  putSingleObjectInS3,
  putMultipleObjectInS3,
  getSingleObjectInS3,
  getMultipleObjectInS3,
  deleteSingleObjectInS3,
  deleteMultipleObjectInS3,
} from "./s3-v2-operations.js";

class RequestHandler {
  #body;
  constructor(body) {
    this.#body = body || {};
  }

  async validator() {
    await requestValidation(this.#body);
  }

  async execute() {
    try {
      await this.validator();
      let response = {
        tenantid: this.#body.client_id,
        iblid: this.#body.blocklist_id,
      };

      if (this.#body.api_action === ApiAction.S_PUT) {
        const result = await putSingleObjectInS3(this.#body);
        response.file = result;
      }

      if (this.#body.api_action === ApiAction.M_PUT) {
        const result = await putMultipleObjectInS3(this.#body);
        response.files = result;
      }

      if (this.#body.api_action === ApiAction.S_GET) {
        const result = await getSingleObjectInS3(this.#body);
        response.file = result;
      }

      if (this.#body.api_action === ApiAction.M_GET) {
        const result = await getMultipleObjectInS3(this.#body);
        response.files = result;
      }

      if (this.#body.api_action === ApiAction.S_DELETE) {
        const result = await deleteSingleObjectInS3(this.#body);
        response.file = result;
      }

      if (this.#body.api_action === ApiAction.M_DELETE) {
        const result = await deleteMultipleObjectInS3(this.#body);
        response.files = result;
      }

      return response;
    } catch (err) {
      throw err;
    }
  }

  static create(body) {
    try {
      return new RequestHandler(body);
    } catch (err) {
      throw err;
    }
  }
}

export default RequestHandler;
