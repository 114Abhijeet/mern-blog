// We can use the error Constructor from JavaScript to create the error
export const errorHandler = (statusCode, message) => {
    const error = new Error();
//If you change the spelling of statusCode and message(in error.statusCode & error.message)when setting the property 
// but do not change it accordingly in the middleware(in index.js while accessing error.statusCode & error.message)
// ,the middleware will not find the property and will default to the fallback value(500 & Internal Server Error).
    error.statusCode= statusCode;
    error.message= message;
    return error;
  };