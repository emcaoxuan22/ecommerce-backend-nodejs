'use strict'

const createHttpError = require("http-errors")
const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles } = require("../services/upload.service")

class UploadController {
    uploadFile = async(req, res, next) => {
        console.log('vao day ne')
       
        new SuccessResponse({
            massage: "Create new Product success!",
            metaData: await uploadImageFromUrl()
          }).send(res);
    }
    uploadFileThumb = async(req, res, next) => {
        const  {file} = req
        if(!file) throw createHttpError.BadRequest("File missing")
        new SuccessResponse({
            message:'upload successfully uploaded',
            metaData:await uploadImageFromLocal({
                path: file.path
            })
        }).send(res)
    }

    uploadImageFromLocalFiles = async(req, res, next) => {
        const  {files} = req
        if(!files) throw createHttpError.BadRequest("File missing")
        new SuccessResponse({
            message:'upload successfully uploaded',
            metaData:await uploadImageFromLocalFiles({
                files,
            })
        }).send(res)
    }
}

module.exports = new UploadController()