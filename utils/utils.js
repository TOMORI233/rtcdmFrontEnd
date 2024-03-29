/* 根据出生日期算出年龄 */
function jsGetAge (strBirthday) {
  var returnAge

  if (strBirthday === null) {
    return returnAge
  }

  var strBirthdayArr = strBirthday.split('-')
  var birthYear = strBirthdayArr[0]
  var birthMonth = strBirthdayArr[1]
  var birthDay = strBirthdayArr[2]

  const d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1
  var nowDay = d.getDate()

  if (nowYear === birthYear) {
    returnAge = 0// 同年 则为0岁
  } else {
    var ageDiff = nowYear - birthYear // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        var dayDiff = nowDay - birthDay// 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        var monthDiff = nowMonth - birthMonth// 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = '生日非法'// 返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge// 返回周岁年龄
}

// function otherfunc ()

export default {
  jsGetAge
  // , otherfunc
}
