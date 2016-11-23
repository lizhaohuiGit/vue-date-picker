<template>
  <div class="vui-calendar" :class="cls">
    <header class="vui-calendar__header vui-clearfix">
      <i class="fa fa-backward" @click="setDate(calendar[10].month, calendar[10].year - 1)"></i>
      <i class="fa fa-caret-left" @click="setDate(calendar[10].month -1, calendar[10].year)"></i>
      <span>{{calendar[10].year}}年{{calendar[10].month}}月</span>
      <i class="fa fa-forward" @click="setDate(calendar[10].month, calendar[10].year + 1)"></i>
      <i class="fa fa-caret-right" @click="setDate(calendar[10].month + 1, calendar[10].year)"></i>
    </header>
    <table class="vui-calendar__content">
      <thead>
      <tr>
        <th>日</th>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="r in 6">
        <td v-for="d in 7"
            :class="{
                'vui-calendar__content__item--chosen':calendar[(r-1) * 7 + d-1] && chosenTime == calendar[(r-1) * 7 + d-1].time && !calendar[(r-1) * 7 + d-1].disabled,
                'vui-calendar__content__item--range':calendar[(r-1) * 7 + d-1] && isRange(calendar[(r-1) * 7 + d-1].time) && !calendar[(r-1) * 7 + d-1].disabled,
                'vui-calendar__content__item--overMonth':calendar[(r-1) * 7 + d-1] && calendar[(r-1) * 7 + d-1].overMonth,
                'vui-calendar__content__item--disabled':calendar[(r-1) * 7 + d-1] && calendar[(r-1) * 7 + d-1].disabled
            }"
            @click="chosen(calendar[(r-1) * 7 + d-1])">{{ calendar[(r-1) * 7 + d-1].date }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import util from './util';
import Moment from './moment'

export default {
  moment: null,                  // 日期对象
  props:{
    cls: String,                 // 自定义类名
    handleCb: Function,           // 回调函数
    date: {
      type: null,
      default: util.convertDate(new Date)
    },
    minDate: null,
    maxDate: null,
    rangeDate: null
  },
  created: function() {
    this.moment = new Moment({
      date: this.date,
      minDate: this.minDate,
      maxDate: this.maxDate
    });
    this.calendar = Object.freeze(this.moment.getCalendarObj());
    this.chosenTime = util.getOriginalTime(this.date);
  },
  data: function() {
    return {
      calendar: [],
      chosenTime: ''
    }
  },
  watch: {
    date: function(date) {
      this.moment.setCurrDate(date);
      this.chosenTime = util.getOriginalTime(date);
      this.refresh();
    },
    minDate: function() {
      this.moment.setMinDate(this.minDate);
      var minTime = util.getOriginalTime(this.minDate);
      if (minTime > this.chosenTime) {
        this.chosenTime = minTime;
        this.setDate(util.convertDate(this.minDate, 'MM'), util.convertDate(this.minDate, 'YY'));
        return;
      }
      this.refresh();
    },
    maxDate: function() {
      this.moment.setMaxDate(this.maxDate);
      this.refresh();
    },
    rangeDate: function() {
      this.refresh();
    }
  },
  methods: {
    chosen: function(dateObj) {
      if (dateObj.disabled) { return }
      this.chosenTime = dateObj.time;
      this.handleCb && this.handleCb(dateObj);
      if (dateObj.overMonth) {
        this.setDate(dateObj.month, dateObj.year);
      }
    },
    // 重置日历面板
    setDate: function(month, year) {
      var _month = month;
      if (month > 12) {
        _month = 1;
        year++;
      } else if (month < 1) {
        _month = 12;
        year--;
      }
      this.moment.setMonth(_month);
      this.moment.setYear(year);
      this.refresh();
    },
    refresh: function() {
      this.calendar = this.moment.getCalendarObj();
    },
    isRange: function(dateTime) {
      if (!this.rangeDate) return false;

      var rangeTime = util.getOriginalTime(this.rangeDate),
              maxRange = Math.max(rangeTime, this.chosenTime),
              minRange = Math.min(rangeTime, this.chosenTime);
      return dateTime >= minRange && dateTime <= maxRange;
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/scss">
  @import "assets/common";
  .vui-calendar {
    box-sizing: border-box;
    width: 240px;
    background: #fff;
    border: 1px solid #DBE0EB;
    font-size: 12px;
    text-align: center;
  }
  .vui-calendar__header {
    line-height: 36px;
    background: #F8F8FB;
    border-bottom: 1px solid #DBE0EB;
    padding-left: 10px;

    .fa{
      line-height: 36px;
      color: #DBE0EB;
      display: inline-block;
      padding: 0 5px;
      cursor: pointer;
      margin-right: 5px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -webkit-text-stroke-width: 0.2px;
      -moz-osx-font-smoothing: grayscale;
    }

    .fa-backward,
    .fa-forward {
      font-size: 12px;
    }

    .fa-caret-left,
    .fa-caret-right {
      font-size: 18px;
    }

    .fa-backward,
    .fa-caret-left {
      float: left;
    }

    .fa-forward,
    .fa-caret-right {
      float: right;
    }
  }


  .vui-calendar__content {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;

    thead th {
      font-weight: normal;
      line-height: 32px;
      color: #4A90E2;
      border-bottom: 1px solid #DBE0EB;;
    }

    tbody td{
      line-height: 28px;
      cursor: pointer;
    }
  }

  .vui-calendar__content__item--overMonth {
    cursor: default;
    color: #9B9B9B;
  }
  .vui-calendar__content__item--disabled {
    cursor: default;



    color: #9B9B9B;
    background: #F8F8FB;
  }
  .vui-calendar__content__item--range {
    background: rgba(74, 144, 226, 0.2);
  }
  .vui-calendar__content__item--chosen {
    background: #4A90E2;
    color: #fff;
  }
</style>
