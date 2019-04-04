const HttpService = require('./httpService');
const constant = require('../util/constant');
const matchService = {
  joinNovice: function(data) {
    return new HttpService({
      method: 'post'
    }).request({
      url: constant.API.match_joinNovice,
      data: {
        matchId: data.matchId
      }
    })
  }
}

module.exports = matchService;