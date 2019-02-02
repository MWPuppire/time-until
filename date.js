/*  CONFIGURATION - EDIT DATE HERE */

/* TARGET DAYS MUST BE "month/day" */
var TARGETS = [

]
/* OPTIONAL TITLES FOR TARGET DAYS */
var TITLES = {

}
/* OPTIONAL BIRTHDAY CONFIGURATION */
/* ANY BIRTHDAY HAS TO BE A TARGET */
var BIRTHDAYS = [

]
var YEARS = {

}
var NAMES = {

}

/*  CODE - DO NOT EDIT BEYOND HERE */

var days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

function suffix (num) {
  var len = num.toString().length
  var isTeen = num.toString()[0] === '1' && len === 2
  if (isTeen) {
    return num + 'th'
  }
  var lastNum = num.toString().slice(-1)
  return lastNum === '1'
    ? num + 'st'
    : lastNum === '2'
      ? num + 'nd'
      : lastNum === '3'
        ? num + 'rd'
        : num + 'th'
}

function parseMS (ms) {
  var roundToZero = ms > 0 ? Math.floor : Math.ceil
  return {
    days: roundToZero(ms / 86400000),
    hours: roundToZero(ms / 3600000) % 24,
    minutes: roundToZero(ms / 60000) % 60,
    seconds: roundToZero(ms / 1000) % 60
  }
}

function pluralize (word, count) {
  return count === 1 ? word : word + 's'
}

function prettyMS (m) {
  var ret = [ ]
  function add (val, str) {
    if (val === 0) {
      return
    }
    var postfix = ' ' + pluralize(str, val)
    ret.push(val + postfix)
  }
  var parsed = parseMS(m)
  add(Math.trunc(parsed.days / 365), 'year')
  add(parsed.days % 365, 'day')
  add(parsed.hours, 'hour')
  add(parsed.minutes, 'minute')
  add(parsed.seconds, 'second')
  var last = ret.pop()
  return ret.join(', ') + ', and ' + last
}

function remove (name) {
  TARGETS = TARGETS.filter(function (el) { return el !== name })
  BIRTHDAYS = BIRTHDAYS.filter(function (el) { return el !== name })
  delete TITLES[name]
  delete YEARS[name]
  delete NAMES[name]
}

function btnRemove () {
  var date = prompt('What day? ("day/month" format)')
  remove(date)
}

document.getElementById('remove').onclick = btnRemove

function add (date, birthday, title, name) {
  TARGETS.push(date)
  if (birthday) {
    BIRTHDAYS.push(date)
    if (title) {
      YEARS[date] = title
    }
    if (name) {
      NAMES[date] = name
    }
  } else {
    if (title) {
      TITLES[date] = title
    }
  }
}

function btnAdd () {
  var date = prompt('What day? ("day/month" format)')
  var birthday = /^(?:y|yes|true|1)$/i.test(prompt('Is it a birthday?'))
  var title = ''
  var name = ''
  if (birthday) {
    title = prompt('What year was the birth?')
    name = prompt('What is the name?')
  } else {
    title = prompt('What is the title (if any)?')
  }
  add(date, birthday, title, name)
}

document.getElementById('add').onclick = btnAdd

function main () {
  var date = new Date()
  var dd = date.getDate()
  var mm = date.getMonth() + 1
  var div = document.getElementById('main')
  for (var i = 0; i < TARGETS.length; i++) {
    if (i === 0) {
      div.innerHTML = ''
    } else {
      div.innerHTML += '<br><hr><br>'
    }
    var targetDay = TARGETS[i]
    var targetSplit = targetDay.split('/')
    var tm = parseInt(targetSplit[0])
    var td = parseInt(targetSplit[1])
    var year = date.getFullYear()
    if (mm > tm || (mm === tm && dd > td)) {
      year += 1
    }
    var today = `${mm}/${dd}/${year}`
    var fullTargetDay = targetDay + '/' + year
    var target = new Date(fullTargetDay)
    var birthday = BIRTHDAYS.indexOf(targetDay) !== -1
    if (birthday) {
      var difYear = (YEARS[targetDay]
        ? year - YEARS[targetDay]
        : false)
      if (today === fullTargetDay) {
        div.innerHTML +=
          'It is ' +
          days[target.getDay()] +
          ', ' +
          months[target.getMonth()] +
          ' ' +
          suffix(target.getDate()) +
          ', ' +
          target.getFullYear() +
          (NAMES[targetDay]
            ? ', ' + NAMES[targetDay] + (difYear
              ? ' ' + suffix(difYear) + ' birthday.'
              : ' birthday.'
            )
            : '.'
          )
      } else {
        div.innerHTML +=
          'It is ' +
          prettyMS(Math.abs(date.getTime() - target.getTime())) +
          ' until ' +
          days[target.getDay()] +
          ', ' +
          months[target.getMonth()] +
          ' ' +
          suffix(target.getDate()) +
          ', ' +
          target.getFullYear() +
          (NAMES[targetDay]
            ? ', ' + NAMES[targetDay] + (difYear
              ? "'s " + suffix(difYear) + ' birthday.'
              : ' birthday.'
            )
            : '.'
          )
      }
    } else {
      if (today === fullTargetDay) {
        div.innerHTML +=
          'It is ' +
          days[target.getDay()] +
          ', ' +
          months[target.getMonth()] +
          ' ' +
          suffix(target.getDate()) +
          ', ' +
          target.getFullYear() +
          (TITLES[targetDay]
            ? ', which is ' + TITLES[targetDay] + '.'
            : '.'
          )
      } else {
        div.innerHTML +=
          'It is ' +
          prettyMS(Math.abs(date.getTime() - target.getTime())) +
          ' until ' +
          days[target.getDay()] +
          ', ' +
          months[target.getMonth()] +
          ' ' +
          suffix(target.getDate()) +
          ', ' +
          target.getFullYear() +
          (TITLES[targetDay]
            ? ', which is ' + TITLES[targetDay] + '.'
            : '.'
          )
      }
    }
  }
}

setInterval(main, 1000)
