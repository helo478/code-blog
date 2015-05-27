/**
 * Created by Donald on 5/25/2015.
 */
function PasswordHasher() {

  var bcrypt = require('bcrypt');

  var saltWorkFactor = 10;

  return {
    hashPassword: function(password, callback) {

      bcrypt.genSalt(saltWorkFactor, function(err, salt) {
        // TODO handle error

        bcrypt.hash(password, salt, function(err, hash) {
          // TODO handle error

          callback(hash);
        });
      });
    },
    comparePasswordHash: function(hash1, hash2) {

    }
  };
}

module.exports.PasswordHasher = PasswordHasher;