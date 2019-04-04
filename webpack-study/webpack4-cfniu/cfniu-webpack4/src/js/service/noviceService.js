const HttpService = require('./httpService');
const constant = require('../util/constant');
const noviceService = {
  // 获取体验活动
  getExperienceList: function() {
    return new HttpService().request({
      url: constant.API.novice_experience,
      data: {
        matchNo: 'novice'
      }
    })
  }
}
module.exports = noviceService;