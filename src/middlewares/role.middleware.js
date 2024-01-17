const AccessControl = require('accesscontrol')

const grantList = [
    {role: 'admin', resource:'profile', action:'read:any', attributes:'*'},
    {role: 'user', resource:'profile', action:'read:own', attributes:'*'}
]

module.exports = new AccessControl(grantList)