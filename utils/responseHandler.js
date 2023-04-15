const constants = require("./../utils/constants")

module.exports = (data = 'success', code = constants.STATUS_CODE.SUCCESS, msg = 'Success') => {
    let message = msg
    if (code === constants.STATUS_CODE.DATA_HAS_RUN_OUT) {
        message = 'Data has run out'
    }
    let meta = {
        success: true,
        code: code,
        message: message,
        // status: 'success',
    }
    let newData = data
    if (data && data.pagination) {
        meta.pagination = data.pagination
        newData = data.data
    }
    return {
        meta: meta,
        data: newData
    }
}