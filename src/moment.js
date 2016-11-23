import util from './util';

function Moment(date, config) {
    this.setCurrDate(date);
    this.config = util.extend({
        format: 'YY-MM-DD',
        maxDate: null,
        minDate: null
    }, typeof date == 'object' ? date : config);
}
Moment.prototype.getMonth = function() {
    return this.month;
};
Moment.prototype.setCurrDate= function(date) {
    this.dateTime = date && typeof date !== 'object' ? new Date(date) : new Date;
    this.year = this.dateTime.getFullYear();
    this.month = this.dateTime.getMonth() + 1;
    this.date = this.dateTime.getDate();
};
Moment.prototype.setYear = function(year) {
    this.year = Number(year);
};
Moment.prototype.setMonth = function(month) {
    this.month = Number(month);
};
Moment.prototype.setMinDate = function(date) {
    this.config.minDate = date;
};
Moment.prototype.setMaxDate = function(date) {
    this.config.maxDate = date;
};
Moment.prototype.prevMonth = function() {
    return {
        month: this.month == 1 ? 12 : this.month - 1,
        year: this.month == 1 ? this.year - 1 : this.year
    }
};
Moment.prototype.nextMonth = function() {
    return {
        month: this.month == 12 ? 1 : this.month + 1,
        year: this.month == 12 ? this.year + 1 : this.year
    }
};
Moment.prototype.getDays = function(year, month) {
    month = Number(month);
    year = Number(year);
    if (month == 2) {
        if ( year % 400 == 0 ||
            year % 4 == 0 && year % 100 !== 0 )
        { return 29; }
        return 28;
    }
    if (/^(1|3|5|7|8|10|12)$/.test(month)) { return 31 }
    return 30
};
Moment.prototype.getPrevMonthObj = function() {
    var month = this.prevMonth().month,
        year = this.prevMonth().year,
        date = [year, month, '1'].join('/');
    return this.getMonthObj(new Date(date));
};
Moment.prototype.getNextMonthObj = function() {
    var month = this.nextMonth().month,
        year = this.nextMonth().year,
        date = [year, month, '1'].join('/');
    return this.getMonthObj(new Date(date));
};
Moment.prototype.getMonthObj = function(date) {
    var _date = new Date( util.getOriginalTime(date || [this.year, this.month, this.date].join('/')) );
    var year = _date.getFullYear(),
        month = _date.getMonth() + 1,
        maxTime = this.config.maxDate ? util.getOriginalTime(this.config.maxDate) : Infinity,
        minTime = this.config.minDate ? util.getOriginalTime(this.config.minDate) : -Infinity,
        days = this.getDays(year, month),
        result = [];

    _date.setDate(1);

    for (var i=0; i<days; i++) {
        _date.setDate(i + 1);
        var _time =  util.getOriginalTime(_date);
        result.push({
            disabled: _time > maxTime || _time < minTime,         // 大于最大时间 || 小于最小时间
            overMonth: this.month != month,               // 不是当前月
            year: year,
            month: month,
            date: _date.getDate(),
            day: _date.getDay(),
            time: _time,
            formatDate: util.convertDate(_time, this.config.format)
        });
    }
    return result;


};
Moment.prototype.getCalendarObj = function () {
    var currObj = this.getMonthObj(),
        prevObj = this.getPrevMonthObj(),
        nextObj = this.getNextMonthObj(),
        prevCount = currObj[0].day,
        nextCount = 42 - prevCount - currObj.length,
        result = [];

    if (prevCount > 0) {
        result = result.concat(prevObj.slice(-prevCount));
    }
    result = result.concat(currObj);
    if (nextCount > 0) {
        result = result.concat(nextObj.slice(0, nextCount));
    }
    return result;
};

module.exports = Moment;