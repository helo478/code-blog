/**
 * Created by Donald on 6/13/2015.
 */
function Error() {

  return {
    'throw': function(res, error, cause) {
      console.log(error, cause);
      res.setHeader("content-type", "application/json");
      res.send(JSON.stringify({
        success: false,
        error: error,
        cause: cause}));
    }
  };
}

module.exports = new Error();