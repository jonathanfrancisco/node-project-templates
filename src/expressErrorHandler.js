module.exports = environment => {
  return (err, req, res, next) => {
    console.error(err)

    const getErrorFormat = (errMessage, errStatus) => {
      if (
        Array.isArray(errMessage) ||
        (typeof errMessage === 'object' && errMessage !== null)
      ) {
        return {
          error: {
            details: errMessage
          }
        }
      }
      return {
        error: {
          message:
            (!err.status || err.status === 500) && environment === 'production'
              ? 'Internal Server Error'
              : errMessage
        }
      }
    }

    return res
      .status(err.status || 500)
      .json(getErrorFormat(err.message, err.status))
  }
}
