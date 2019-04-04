/*
 * @Author: shixinghao 
 * @Date: 2018-02-24 10:27:02 
 * @Last Modified by: shixinghao
 * @Last Modified time: 2018-02-24 10:27:39
 * 正则
 */
module.exports = {
    key: /^(1[3-9])[0-9]{9}$/,
    telephone: /^(1[3-9])[0-9]{9}$/,
    mobilephone: /^(1[3-9])[0-9]{9}$/,
    phone: /^(1[3-9])[0-9]{9}$/,
    idCard: /^\d{17}([0-9]|X)$/,
    cardNo: /^(\d{16,22}|\d{12})$/,
    pwd: /^(?![^a-zA-Z]+$)(?!\D+$)[a-zA-Z\d]{6,16}$/,
    pwd2: /^(?![^a-zA-Z]+$)(?!\D+$)[a-zA-Z\d]{6,16}$/,
    deltaAmount: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/,
    amount: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/,
    profitAmount: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/,
    fxAmount: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/,
    stockCode: /^\d{6}$/,
    stockQty: /^[1-9]\d*00$/,
    qty: /^[1-9]\d*00$/,
    price: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/,
    drawAmount: /^([\d]+|([\d]+[.]?[\d]{1,2}))$/
}