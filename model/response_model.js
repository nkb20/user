class JsonResponse {
    constructor(status, message, data) {
      this.status = status;
      this.message = message;
      this.data = data;
    }
  
    static success( message = "Request completed",data) {
      return new JsonResponse("success", message, data);
    }
      
    static error(message = "Something went wrong") {
      return new JsonResponse("fail", message);
    }
  }
  
  module.exports=JsonResponse;

  