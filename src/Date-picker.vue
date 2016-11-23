<template>
  <div :class="cls" class="vui-date-picker">
    <input type="text" class="vui-input" :disabled="disabled"  @click="toggle" :value="date" readonly/>
    <calendar :min-date="minDate" :date="currentDate" :handle-cb="pick" v-show="display"></calendar>
  </div>
</template>

<script>
import Calendar from './Calendar.vue'

export default {
  components: {
    Calendar
  },
  data () {
      return {
        display: false,
        date: this.currentDate || ''
      }
  },
  props:{
    cls: String,
    minDate: null,
    disabled: {
      type: Boolean,
      default: false
    },
    currentDate: {
      type: null,
      default: ''
    }
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
    pick (dateObj) {
      this.toggle();
      this.date = dateObj.formatDate;
    }
  }
}
</script>
<style lang="sass" rel="stylesheet/scss">
	@import "assets/common";
	.vui-date-picker {
		.vui-calendar {
			margin-top: 5px;
		}
	}
</style>
