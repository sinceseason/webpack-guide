import { getPromise } from './utilService';
import HttpService from './httpService';
const liangplusService = {
  // 获取股票指数市场行情(行业，创业，概念)
  getStockMarket: function() {
    const self = this;
    // 000001,399001,399006
    // 14901：个股；14902：指数；14903：行业；14904：概念
    const stockMarkets = [{
      code: '000001',
      name: '上证指数',
      price: '--',
      chg: '--',
      ratio: '--'
    }, {
      code: '399001',
      name: '深证成指',
      price: '--',
      chg: '--',
      ratio: '--'
    }, {
      code: '399006',
      name: '创业板指',
      price: '--',
      chg: '--',
      ratio: '--'
    }];
    return self.queryStockMarketState(stockMarkets[0].code).then(function(data) {
      self.updateStockMarket(stockMarkets[0], data);
      return self.queryStockMarketState(stockMarkets[1].code);
    }).then(function(data) {
      self.updateStockMarket(stockMarkets[1], data);
      return self.queryStockMarketState(stockMarkets[2].code);
    }).then(function(data) {
      self.updateStockMarket(stockMarkets[2], data);
      return getPromise(stockMarkets);
    })
  },
  updateStockMarket: function(sm, data) {
    sm.price = data.message.price || 0;
    sm.ratio = data.message.ratio || 0 + '%';
    sm.chg = data.message.chg || 0;
    sm.type = sm.chg < 0 ? '↓' : '↑';
  },
  queryStockMarketState: function(code) {
    return new HttpService().request({
      url: '/api/csf/index/realtime/state',
      type: 'liang',
      data: {
        code: code,
        type: 14902
      }
    })
  }
}

export default liangplusService;