<template>
  <div>
    <div class="byted-schedule">
      <table :key="itemKey" class="byted-schedule-calendar-table">
        <thead>
          <tr>
            <th rowspan="8" class="byted-schedule-week-td">星期/时间</th>
            <th colspan="24">00:00 - 12:00</th>
            <th colspan="24">12:00 - 24:00</th>
          </tr>
          <tr>
            <td v-for="index of 24" :key="index" colspan="2">
              {{ index - 1 }}
            </td>
          </tr>
        </thead>
        <tbody @mouseleave="handelMouseLeave">
          <!-- <div v-show="is_show_mask" class="mask" :style="'width:' + mask_width + 'left:' + mask_left + 'height:' + mask_height + 'top:' + mask_top" /> -->
          <tr v-for="(item, weekIndex) in week" :key="item">
            <td @mouseenter="handelMouseEnter">{{ item }}</td>
            <td
              v-for="timeIndex of timeLength"
              :ref="`td${weekIndex * timeLength + timeIndex - 1}`"
              :key="timeIndex"
              :colspan="48 / timeLength"
              :data-week="weekIndex"
              :data-time="timeIndex"
              :class="
                timeArray[weekIndex * timeLength + timeIndex - 1] === '1'
                  ? 'selected'
                  : ''
              "
              class="byted-schedule-calendar-atom-time"
              @mousedown="handelMouseDown(weekIndex, timeIndex - 1,$event)"
              @mousemove="handelMouseMove(weekIndex, timeIndex - 1,$event)"
              @mouseup="handelMouseUp(weekIndex, timeIndex - 1,$event)"
            />
          </tr>
          <tr @mouseenter="handelMouseEnter">
            <td colspan="49">
              <div style="display: flex; justify-content: space-between">
                <span style="margin-left: 10px">高峰时间段:</span>
                <a
                  :underline="false"
                  style="margin-right: 10px;color: #1890FF;cursor:pointer"
                  @click="clearAllTime"
                >清空</a>
              </div>
              <div style="text-align: start; padding: 0 10px">
                <div v-for="(item, key) in timeObject" :key="key">
                  <span v-if="item.length" style="margin-right: 10px">{{
                    key
                  }}</span>
                  <span v-if="item.length">{{ item.join("、") }}</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeChoiceRange',
  props: {
    value: {
      type: String,
      default: ''
    },
    timeWidth: {
      type: Number,
      default: 7
    },
    timeLength: {
      type: Number,
      default: 48
    }
  },
  data () {
    return {
      is_show_mask: false,
      startWeekIndex: null,
      startTimeIndex: null,
      endWeekIndex: null,
      endTimeIndex: null,
      week: [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ],
      cellStyle: {
        // color: 'red'
      },
      timeArray: [],
      itemKey: '',
      timeObject: {
        星期一: [],
        星期二: [],
        星期三: [],
        星期四: [],
        星期五: [],
        星期六: [],
        星期日: []
      },
      box_screen_left: 0, // 定位td的left位置
      box_screen_top: 0, // 定位td的top位置
      start_x: 0,
      start_y: 0,
      end_x: 0,
      end_y: 0
    }
  },
  computed: {
    mask_width () {
      return `${Math.abs(this.end_x - this.start_x)}px;`
    },
    mask_height () {
      return `${Math.abs(this.end_y - this.start_y)}px;`
    },
    mask_left () {
      return `${Math.min(this.start_x, this.end_x) - this.box_screen_left}px;`
    },
    mask_top () {
      return `${Math.min(this.start_y, this.end_y) - this.box_screen_top}px;`
    }
  },
  created () {
    if (this.value) {
      this.timeArray = this.value.split('')
      for (var weekIndex = 0; weekIndex < this.timeWidth; weekIndex++) {
        this.handelClick(weekIndex)
      }
    } else {
      this.timeArray = []
      for (var i = 0; i < this.timeWidth * this.timeLength; i++) {
        this.timeArray[i] = '0'
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      const dom_box = document.querySelector('.byted-schedule-calendar-atom-time')
      this.box_screen_left = dom_box.getBoundingClientRect().left - 76
      this.box_screen_top = dom_box.getBoundingClientRect().top
    },
    handelClick (weekIndex, timeIndex) {
      var rowStartIndex = weekIndex * this.timeLength
      var i = 0
      var startAndEndTimeList = [] // 记录开始和结束时间
      while (i < this.timeLength) {
        if (this.timeArray[rowStartIndex + i] === '1') {
          var item = {
            startTime: null,
            endTime: null
          }
          item.startTime = i * (24 / this.timeLength)
          var obj = this.findEndTime(weekIndex, i)
          i = obj.index
          item.endTime = obj.endTime
          startAndEndTimeList.push(item)
        }
        i++
      }
      var checkedTimeList = []
      for (let k = 0; k < startAndEndTimeList.length; k++) {
        var start = this.numToTime(startAndEndTimeList[k].startTime)
        var end = this.numToTime(startAndEndTimeList[k].endTime)
        var str = start + '~' + end
        checkedTimeList.push(str)
      }
      this.timeObject[this.week[weekIndex]] = JSON.parse(
        JSON.stringify(checkedTimeList)
      )
    },
    findEndTime (weekIndex, timeIndex) {
      var index = weekIndex * this.timeLength + timeIndex
      var obj = {}
      obj.index = timeIndex
      if (this.timeArray[index] === '0') {
        obj.endTime = timeIndex * (24 / this.timeLength)
        return obj
      }
      // 如果选择了当天最后时段
      if (timeIndex === this.timeLength - 1 && this.timeArray[index] === '1') {
        obj.endTime = this.timeLength * (24 / this.timeLength)
        return obj
      }
      return this.findEndTime(weekIndex, timeIndex + 1)
    },
    numToTime (num) {
      var hour = parseInt(num)
      var minute = num % 1
      hour = hour < 10 ? '0' + hour : hour + ''
      minute = minute === 0 ? '00' : minute * 60 + ''
      return hour + ':' + minute
    },
    findStartAndEndTime (weekIndex, timeIndex) {
      var startX
      var startY
      var endX
      var endY
      startX =
          this.startWeekIndex < weekIndex ? this.startWeekIndex : weekIndex
      startY =
          this.startTimeIndex < timeIndex ? this.startTimeIndex : timeIndex
      endX = this.startWeekIndex < weekIndex ? weekIndex : this.startWeekIndex
      endY = this.startTimeIndex < timeIndex ? timeIndex : this.startTimeIndex
      return {
        startX,
        startY,
        endX,
        endY
      }
    },
    handelMouseDown (weekIndex, timeIndex, event) {
      this.handleScroll()// 获取一下组件在视窗的位置
      this.startWeekIndex = weekIndex
      this.startTimeIndex = timeIndex
      // 选择框
      this.is_show_mask = true
      this.start_x = event.clientX
      this.start_y = event.clientY
      this.end_x = event.clientX
      this.end_y = event.clientY
    },
    handelMouseMove (weekIndex, timeIndex, event) {
      this.endWeekIndex = weekIndex
      this.endTimeIndex = timeIndex
      if (this.startWeekIndex !== null) {
        // event.path[0].style.background='#7594ef'
        const { startX, endX, startY, endY } = this.findStartAndEndTime(
          weekIndex,
          timeIndex
        )
        for (var i = startX; i <= endX; i++) {
          for (var j = startY; j <= endY; j++) {
            this.$refs[`td${i * this.timeLength + j}`][0].style.background =
                '#7594ef'
          }
        }
      }
      this.end_x = event.clientX
      this.end_y = event.clientY
    },
    handelMouseLeave (event) {
      if (this.startWeekIndex !== null) {
        this.handelMouseUp(this.endWeekIndex, this.endTimeIndex)
      }
    },
    handelMouseEnter (event) {
      if (this.startWeekIndex !== null) {
        this.handelMouseUp(this.endWeekIndex, this.endTimeIndex)
      }
    },
    handelMouseUp (weekIndex, timeIndex) {
      if (this.startWeekIndex !== null) {
        const { startX, endX, startY, endY } = this.findStartAndEndTime(
          weekIndex,
          timeIndex
        )
        var value =
            this.timeArray[
              this.startWeekIndex * this.timeLength + this.startTimeIndex
            ]
        for (var i = startX; i <= endX; i++) {
          for (var j = startY; j <= endY; j++) {
            this.timeArray[i * this.timeLength + j] = value === '1' ? '0' : '1'
            this.itemKey = Math.random()
            this.handelClick(i, j)
          }
        }
      }
      this.startWeekIndex = null
      this.startTimeIndex = null
      this.endWeekIndex = null
      this.endTimeIndex = null
      this.$emit('input', this.timeArray.join(''))
      this.is_show_mask = false
      this.resSetXY()
    },
    resSetXY () {
      this.start_x = 0
      this.start_y = 0
      this.end_x = 0
      this.end_y = 0
    },
    clearAllTime () {
      for (var i = 0; i < this.timeWidth * this.timeLength; i++) {
        this.timeArray[i] = '0'
      }
      this.timeObject = {
        星期一: [],
        星期二: [],
        星期三: [],
        星期四: [],
        星期五: [],
        星期六: [],
        星期日: []
      }
      this.$emit('input', '')
    }
  }
}
</script>

  <style scoped>
  .byted-schedule {
    user-select: none;
  }
  .byted-schedule table {
    border: 1px solid #ebebeb;
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    font-size: 12px;
  }
  .byted-schedule-calendar-table {
    border-collapse: separate;
    border-radius: 4px;
  }
  .byted-schedule-calendar-table tr td,
  .byted-schedule-calendar-table tr th {
    border-left: none;
    border-top: none;
    border-bottom: 1px solid;
    border-bottom-color: #ebebeb;
    border-right: 1px solid;
    border-right-color: #ebebeb;
    font-size: 14px;
    text-align: center;
    min-width: 11px;
    line-height: 1.8em;
    /* transition: background 200ms ease; */
    color: $lightDefaultTextColor;
    background: transparent;
    padding: 0;
  }
  .byted-schedule-week-td {
    width: 75px;
    padding: 20px 0;
  }
  .byted-schedule-calendar-table .selected {
    background: #1890ff !important;
  }
  .byted-schedule-calendar-atom-time:hover {
    background: #edf1fd;
  }
  tbody{
    position: relative;
      overflow: hidden;
  }
  .mask {
      position: absolute;
      background: red;
      opacity: 0.4;
      z-index: 999;
  }
  </style>
