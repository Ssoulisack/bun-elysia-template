export class DataNotFoundError extends Error {
    constructor(message?:string) {
        if(message){
            super(message)
        }else{
            super("Data not found")
        }
    }
}