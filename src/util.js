// 把源对象自身的属性扩展到目标对象
exports.extend = function(target) {
    if (target == null) { throw new Error('target cannot be null'); }

    var i = 0, len = arguments.length, key, src;
    while (++i < len) {
        src = arguments[i];
        if (src != null) {
            for (key in src) {
                if ( src.hasOwnProperty(key) ) { target[key] = src[key]; }
            }
        }
    }

    return target;
};

// 重置时间00:00:00, 返回时间戳
exports.getOriginalTime = function (date) {
    date = date ? ( date instanceof Date ? date : new Date(date) )
        : new Date;
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
};

// 日期转换
exports.convertDate = function (val, format) {
    if (!val)  return '';
    format = format || 'YY-MM-DD';
    var date = '';
    if (val.constructor == String && /^\d+$/.test(val)) {
        val = Number(val);
    }
    switch (val.constructor) {
        case Date: date = val;
            break;
        case String: date = new Date(val);
            break;
        case Number: date = ( val / 1e12 > 1 ) ? new Date(val) : new Date(val * 1000);
            break;
    }

    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        seconds = date.getSeconds(),
        day = date.getDay(),
        week = ['周日', '周一','周二','周三','周四','周五','周六'];

    return format.replace(/YY|MM|Mm|DD|dd|HH|mm|SS|WW/g, function(match) {
        var result = '';
        switch(match) {
            case 'YY': result = y;
                break;
            case 'MM': result = m;
                break;
            case 'Mm': result = m;
                break;
            case 'DD': result = d;
                break;
            case 'dd': result = d;
                break;
            case 'HH': result = hour;
                break;
            case 'mm': result = min;
                break;
            case 'SS': result = seconds;
                break;
            case 'WW': result = week[day];
                break;
        }
        if (/MM|DD|HH|mm|SS/.test(match)) {
            return result < 10 ? '0' + result : result;
        }
        return result;
    })
};