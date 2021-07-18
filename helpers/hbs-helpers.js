const moment = require("moment");
const Category = require("../models/Category");

module.exports = {
  isPublic(value) {
    return value === "public" ? true : false;
  },
  isPrivate(value) {
    return value === "private" ? true : false;
  },
  isDradt(value) {
    return value === "draft" ? true : false;
  },
  // convertTime(timeIn) {
  //   const time = new Date(Date.parse(timeIn));
  //   const day = time.getDate();
  //   const month = time.getMonth() + 1;
  //   return `${day}/${month}`;
  // },
  generateDate(date, format) {
    return moment(date).format(format);
  },
  breadcrumb(location) {
    const l = location.split("/");
    return l;
  },
};
