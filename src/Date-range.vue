<template>
    <div class="vui-date-range" :class="cls">
        <input type="text" @click="toggle" class="date-picker__trigger vui-input" v-model="date" :placeholder="placeholder" readonly/>
        <div class="vui-date-range__box vui-clearfix" v-show="display" :class="{ 'vui-date-range__box--left': onLeft }">
            <div class="vui-date-range__box__selection">
                <div class="vui-inline-block">
                    <p class="vui-date-range__box__selection__label">开始时间</p>
                    <input type="text" class="vui-input" readonly :value="displayStart"/>
                </div>
                <div class="vui-inline-block">
                    <p class="vui-date-range__box__selection__label">结束时间</p>
                    <input type="text" readonly class="vui-input" :value="displayEnd"/>
                </div>
                <div>
                    <button type="button" @click="toggle" class="vui-button">取消</button><button type="button" class="vui-button vui-primary-button" @click="confirm">确定</button>
                </div>
            </div>
            <calendar :date.sync="start"
                      :range-date.sync="end"
                      :max-date="maxDate"
                      :handle-cb="startCb"></calendar>
            <calendar :date.sync="end"
                      :range-date.sync="start"
                      :max-date="maxDate"
                      :min-date.sync="start"
                      :handle-cb="endCb"></calendar>
        </div>
    </div>
</template>

<script>
    import util from  './util'
	import Calendar from './Calendar.vue'
    import Vue from 'vue'

    Vue.filter('convertDate', function(val, format) {
        return util.convertDate(val, format);
    });

    export default {
	    components: {
		    Calendar
	    },
	    props: {
            placeholder: [String, Number],
	    	cls: String,
		    maxDate: null,
            format: {
                type: [String, Number],
                default: 'YY-MM-DD'
            },
		    current: {
			    type: [String, Number],
			    default: ''
		    }
	    },
	    data () {
		    return {
		        date: this.current || '',
			    display: false,
			    start: new Date(),
			    end: new Date(),
			    onLeft: false      // 是否显示在左边
		    }
	    },
	    computed: {
	        displayStart () {
                return util.convertDate(this.start, this.format)
            },
            displayEnd () {
                return util.convertDate(this.end, this.format)
            },
		    startTime () {
			    return util.getOriginalTime(this.start);
		    },
		    endTime () {
			    return util.getOriginalTime(this.end);
		    }
	    },
	    watch: {
		    display () {
			    if (this.display) {
				    var left = this.$el.getBoundingClientRect().left,
						    calWidth = this.$el.querySelector('.vui-date-range__box').getBoundingClientRect().width,
						    docWidth = document.documentElement.clientWidth;
				    this.onLeft = left + calWidth > docWidth;
			    }
		    },
		    date (val) {
			    // 重置
			    if (!val) {
				    this.start = new Date();
				    this.end = new Date();
			    }
		    },
	    },
	    created () {
		    // 空白处关闭列表
		    document.addEventListener('click', function(e) {
			    if (this.display && !this.$el.contains(e.target)) {
				    this.toggle();
			    }
		    }.bind(this), false);
	    },
	    methods: {
		    toggle () {
			    this.display = !this.display;
		    },
		    confirm () {
			    this.toggle();
			    this.date = util.convertDate(this.start, this.format) + ' - ' + util.convertDate(this.end, this.format);
		    },
		    startCb (startDate) {
			    this.start = startDate.formatDate;
			    if (startDate.time > this.endTime) {
				    this.end = startDate.formatDate;
			    }
		    },
		    endCb (endDate) {
			    this.end = endDate.formatDate;
		    }
	    }
    }
</script>

<style lang="sass" rel="stylesheet/scss">
    @import "assets/common";
    .vui-date-range {
        position: relative;
        display: inline-block;
    }
	.vui-date-range__box {
		width: 746px;
		box-sizing: border-box;
		position: absolute;
		background: #FFFFFF;
		border: 1px solid #DBE0EB;
		box-shadow: 0 0 3px 0 rgba(0,0,0,0.10);
		border-radius: 2px;
		padding: 18px;
		z-index: 999;
		margin-top: 5px;
		font-size: 12px;
	}
	.vui-date-range__box .vui-calendar {
		float: left;
		margin-left: 10px;
	}
    .vui-date-range__box__selection {
        float: left;
    }
	.vui-date-range__box__selection .vui-input {
		box-sizing: border-box;
		font-size: 12px;
		width: 90px;
		margin-right: 10px;
		margin-bottom: 30px;
	}
	.vui-date-range__box__selection__label {
		margin-bottom: 10px;
	}
	.vui-date-range__box__selection .vui-primary-button {
		margin-left: 10px;
	}
	.vui-date-range__box .arrow--up {
		top: -8px;
		border-top-color: #Dbe0eb;
		border-width: 9px;
	}
	.vui-date-range__box .arrow--up:after {
		left: -9px;
		top: -11px;
		border-width: 9px;
	}
	.vui-date-range__box--left {
		margin-left: -572px;
	}
	.vui-date-range__box--left .arrow--up {
		right: 16px;
	}
</style>