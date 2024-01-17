'use strict'

const { SuccessResponse } = require("../core/success.response")
const profiles = [
    {
        usr_id:1,
        use_name: 'CR7',
        usr_avt: 'imaged.com/user/1'
    },
    {
        usr_id:2,
        use_name: 'M10',
        usr_avt: 'imaged.com/user/2'
    },
    {
        usr_id:1,
        use_name: 'Longcv',
        usr_avt: 'imaged.com/user/3'
    }

]

const profile = [
    {
        usr_id:1,
        use_name: 'CR7',
        usr_avt: 'imaged.com/user/1'
    },
   

]

class ProfileController {
    // admin
    profiles = async(req, res, next  ) => {
        new SuccessResponse({
            message:'view all profile',
            metaData: profiles
    }).send(res)
    }
    profile = async(req, res, next  ) => {
        new SuccessResponse({
            message:'view all profile',
            metaData: profile
        }).send(res)
        }
}

module.exports = new ProfileController()