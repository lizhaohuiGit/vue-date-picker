<script src="../../kf.meidaila.net/build/utils.js"></script>
<template>
  <div id="app">
    <Date-picker></Date-picker>
    <Date-range></Date-range>
  </div>
</template>

<script>
import DatePicker from './Date-picker.vue'
import DateRange from './Date-range.vue'
export default {
  name: 'app',
  components: {
    DatePicker,
    DateRange
  }
}
</script>

<style>
  .vui-date-picker {
    float: left;
    width: 400px;
  }
</style>
