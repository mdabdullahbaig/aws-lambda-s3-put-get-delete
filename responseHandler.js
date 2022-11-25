class ResponseHandler {
  #response;

  constructor(response) {
    this.#response = response;
  }

  translator() {
    const responseBody = {
      data: [],
      message: "success",
    };

    const resp = this.#response;
    responseBody.data = {
      client_id: resp?.tenantid,
      blocklist_id: resp?.iblid,
      files: resp?.files,
      file: resp?.file,
    };

    return responseBody;
  }

  static create(internalBLocklistResponse) {
    try {
      return new ResponseHandler(internalBLocklistResponse);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default ResponseHandler;
