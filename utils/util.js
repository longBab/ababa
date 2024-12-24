"use strict";
const formatTime = (format) => {
  const dataTime = /* @__PURE__ */ new Date();
  const year = dataTime.getFullYear();
  const month = dataTime.getMonth() + 1;
  const day = dataTime.getDate();
  const hour = dataTime.getHours();
  const minute = dataTime.getMinutes();
  const second = dataTime.getSeconds();
  if (format == "hm") {
    return [hour, minute].map(formatNumber).join(":");
  }
  if (format == "hms") {
    return [hour, minute, second].map(formatNumber).join(":");
  }
  if (format == "YMD") {
    return [year, month, day].map(formatNumber).join("/");
  }
  return [year, month, day].map(formatNumber).join("-") + " " + [hour, minute, second].map(formatNumber).join(":");
};
const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
const characterEscape = (data) => {
  data = data.replace(/\{/g, "%7B").replace(/\}/g, "%7D").replace(/\:/g, "%3A").replace(/\,/g, "%2C").replace(/\ /g, "%2C").replace(/\+/g, "%2B").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/\#/g, "%23").replace(/\&/g, "%26").replace(/\=/g, "%3D").replace(/\\/g, "%5C");
  return data;
};
const verifyPhone = (data) => {
  var mobile = /^[1][0-9][0-9]{9}$/;
  var isMobile = mobile.exec(data);
  return isMobile;
};
const verifyEmail = (data) => {
  let email = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if (email.test(data)) {
    return true;
  }
  return false;
};
const verifyNumberPassword = (data) => {
  let number = /^[0-9]*$/;
  if (number.test(data)) {
    return true;
  }
  return false;
};
const verifyNumber = (data) => {
  let is = true;
  var replaceArray = [];
  for (let i = 0; i < data.length; ++i) {
    var textValue = /^[0-9_.]$/.test(data.charAt(i));
    if (!textValue) {
      replaceArray.push(data.charAt(i));
    }
  }
  if (replaceArray.length != 0) {
    is = false;
  }
  return is;
};
const toFixed = (number, digit) => {
  return Number(number.toFixed(digit ? digit : 2));
};
const utilHelper = {
  formatTime,
  formatNumber,
  characterEscape,
  verifyPhone,
  verifyEmail,
  verifyNumber,
  verifyNumberPassword,
  toFixed
};
exports.utilHelper = utilHelper;
