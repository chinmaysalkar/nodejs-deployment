const AccessTokenModel = require('../models/user/accessTokenSchema');
const Blacklist = require('../models/user/blacklistSchema');


const deleteOldAccessToken = async (id) => {
  try {
    const oldAccessTokenData = await AccessTokenModel.findOne({ id: id });
    
    if (oldAccessTokenData && oldAccessTokenData.expiresAt > Date.now()) {
      const newBlacklist = new Blacklist({ token: oldAccessTokenData.token });
      await newBlacklist.save();
      await AccessTokenModel.deleteOne({ id: id });
    }

    
  } catch (error) {
    console.log('Error occurred while deleting old access token:', error);
  }
};


module.exports = { deleteOldAccessToken };
