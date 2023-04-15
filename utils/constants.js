const statusCodes = {
    SUCCESS: "00",
    SERVER_ERROR: "-1",
    VALIDATION_ERROR: "01",
    DATA_HAS_RUN_OUT: "02",
}
exports.STATUS_CODE = statusCodes
exports.STATUS_CODES = [
    statusCodes.SUCCESS, statusCodes.SERVER_ERROR,
    statusCodes.VALIDATION_ERROR, statusCodes.DATA_HAS_RUN_OUT
]

exports.API_PATH = {
    V1: '/api/v1',
    V2: '/api/v2',
}