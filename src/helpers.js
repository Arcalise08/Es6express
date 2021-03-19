import mongoose from "mongoose";

export const isObjectID = (id) => {
    try {
        return mongoose.Types.ObjectId(id)
    }
    catch {
        return false;
    }
}

export const apiResponse = ({success, msg, data, page, validator}) => {
    if (validator) {
        const errorArr = [];
        for (let i=0; i < validator.errors.length; i++) {
            const temp = {msg: validator.errors[i].msg, param: validator.errors[i].param,location: validator.errors[i].location}
            errorArr.push(temp);
        }
        if (errorArr.length > 0)
            return {errors: errorArr, success: false};
    }
    //api assumes response success if success isn't specified
    const responseBuilder = {
        success: success ?? true,
        data: data ?? null
    }
    if (msg)
        responseBuilder.msg = msg;
    if (page)
        responseBuilder.page = page

    return responseBuilder;
}
