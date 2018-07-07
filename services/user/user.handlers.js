const crypto = require('crypto');

const {
  NOT_CREATED,
  DUPLICATE_ENTITY,
  AUTHENTICATION_ERROR
} = require("../../lib/errors.json");

const {
  models: { User, UserAuth },
  http: { makeStandardError },
  auth,
  utils :{randomString}
} = parsony.getBundle();

exports.create = async function(data) {
  const username = data.username; // type:string *required
  const password = data.password; // type:string *required
  const usernameExists = await _isUsername(username);
  if (!usernameExists) {
    try {
      const {hash, salt} = _hash(password);
      const newUser = await User.create(
        {
          username: username,
          UserAuth: {
            passwordHash: hash,
            salt
          }
        },
        {
          include: [
            {
              model: UserAuth
            }
          ]
        }
      );
      const session = await auth.createSession(newUser.id);
      return {
        userId: newUser.id,
        sessionToken: session.sessionToken,
        sessionStart: session.sessionStart
      };
    } catch (err) {
      /*istanbul ignore next*/
      throw makeStandardError(NOT_CREATED);
    }
  } else {
    throw makeStandardError(DUPLICATE_ENTITY);
  }
};

exports.login = async function(data) {
  const username = data.username; // type:string *required
  const password = data.password; // type:string *required

  try{
    const userId = await auth.checkCredentials(username, password);
    const session = await auth.createSession(userId);
    return {
      userId,
      sessionToken: session.sessionToken,
      sessionStart: session.sessionStart
    };
  } catch(e){
    throw makeStandardError(AUTHENTICATION_ERROR,e.detail)
  }

};

async function _isUsername(username) {
  let user = await User.find({ where: { username } });
  return user !== null;
}

function _hash(password) {
  const salt = randomString(16);
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  return {
    hash : hash.digest('hex'),
    salt
  }
}

exports.logout = async function(data) {
  let sessionToken = data.sessionObj.sessionToken;
  await auth.destroySession(sessionToken);
  return { endedSessionToken: sessionToken };
};

exports.loadSession = async function(data) {
  return {
    userId: data.sessionObj.userId,
    sessionToken: data.sessionObj.sessionToken,
    sessionStart: data.sessionObj.sessionStart
  };
};

exports.updateEmail = async function(data) {
  const email = data.email; // type:string *required

  /***** IMPLEMENT METHOD *****/

  return data;
};

exports.sendConfirmEmail = async function(data) {
  /***** IMPLEMENT METHOD *****/

  return data;
};

exports.confirmEmailWithCode = async function(data) {
  const email = data.email; // type:string *required
  const confirmationCode = data.confirmationCode; // type:string *required

  /***** IMPLEMENT METHOD *****/

  return data;
};
