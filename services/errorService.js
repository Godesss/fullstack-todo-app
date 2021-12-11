
export class ErrorHandler extends Error { 
    
    constructor(status,message,type ="",errors = []){
        super(message)
        this.status = status;
        this.message = message;
        this.errors = errors
        this.type = type
    }
    static unAuthorizedUser() {
        return new ErrorHandler(401,"user doesn't authorizated","auth")
    }
    static badRequest(message,type = "",errors = []) {
        return new ErrorHandler(400,message,type,errors)
    }
}
