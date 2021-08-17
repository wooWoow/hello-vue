<template>
  <div class="home">
    <a-divider>房间温湿度</a-divider>
    <div class="time-box">
      日期：
      <a-date-picker v-model="tody" class="date-picker-box" @change="onChange" />
      <span class="ml-10">采集传感器：DHT22</span>
    </div>
    <div id="home-echarts"></div>
    <a-divider>房间控制</a-divider>
    <div class="home-control-box">
      <div class="home-control-item">
        台灯 (状态：)
        <a-switch @change="onSwitchChange" v-model="no1" />
      </div>
      <div class="home-control-item">
        其他 (状态：)
        <a-switch @change="onSwitchChange" v-model="no2" />
      </div>
    </div>
  </div>
</template>

<script>
import Request from '../service/request';
import echarts from "echarts";
import moment from 'moment';

export default {
  name: 'Home',
  data () {
    return {
      humiture: [],
      tody: moment(),
      no1: false,
      no2: false
    };
  },
  created () {
    this.getTodayHours();
    this.getCurrentRelaysStatus();
  },
  methods: {
    moment,
    getTodayHours () {
      Request.get('/v1/home/humiture/today/hour').then(res => {
        if (res?.data?.code === 200 && res?.data?.data?.info) {
          const list = res?.data?.data?.info || [];
          const timeArr = [];
          const temperatureArr = [];
          const humidityArr = [];
          list.forEach(item => {
            if (item) {
              timeArr.push(item.date.replace(':00', ''));
              temperatureArr.push(item.temp);
              humidityArr.push(item.hum);
            }
          });

          this.initEcharts(timeArr, temperatureArr, humidityArr);
        }
      });
    },
    initEcharts (timeArr, temperatureArr, humidityArr) {
      const myChart = echarts.init(document.getElementById("home-echarts"));

      const option1 = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['温度', '湿度']
        },
        xAxis: [
          {
            type: 'category',
            data: timeArr,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '温度',
            min: -10,
            max: 45,
            interval: 5,
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          {
            type: 'value',
            name: '湿度',
            min: 0,
            max: 100,
            interval: 10,
            axisLabel: {
              formatter: '{value} %RH'
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            data: temperatureArr
          },
          {
            name: '湿度',
            type: 'bar',
            yAxisIndex: 1,
            data: humidityArr
          }
        ]
      };

      myChart.setOption(option1);
    },
    getTempAndHum (dateStr) {
      const formData = {
        params: {
          timeStr: dateStr
        }
      };
      Request.get('/v1/home/humiture/history/hour', formData).then(res => {
        const humitureData = res?.data?.data?.data;
        if (res?.data?.code === 200 && humitureData?.length > 0) {
          const timeArr = [];
          const temperatureArr = [];
          const humidityArr = [];
          const dataArr = humitureData[0]?.humiture_val?.split(',');
          dataArr.forEach((item, index) => {
            temperatureArr.push(item.split(';')[0]);
            humidityArr.push(item.split(';')[1]);
            if (index < 10) {
              timeArr.push('0' + index + ':00');
            } else {
              timeArr.push(index + ':00');
            }
          });
          this.initEcharts(timeArr, temperatureArr, humidityArr);
        } else if (res?.data?.code === 200 && humitureData?.length === 0) {
          this.initEcharts([], [], []);
        }
      }, () => {
        this.$message.error('温湿度数据查询失败');
      });
    },
    onChange (date, dateString) {
      if (moment().format().indexOf(dateString) >= 0) {
        this.getTodayHours();
      } else {
        this.getTempAndHum(dateString);
      }
    },
    getCurrentRelaysStatus () {
      Request.get('/v1/home/relays', {
        params: {
          gpioId: 22
        }
      }).then(res => {
        let status = res.data.data.info.replace('\n', '');
        status === '1' ? (this.no1 = false) : (this.no1 = true);
      }).finally(() => {
        Request.get('/v1/home/relays', {
          params: {
            gpioId: 23
          }
        }).then(res => {
          let status = res.data.data.info.replace('\n', '');
          status === '1' ? (this.no2 = false) : (this.no2 = true);
        });
      });
    },
    onSwitchChange () {
      const formData = {
        no1: this.no1,
        no2: this.no2
      };
      Request.post('/v1/home/relays', formData).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style scoped lang="scss">
#home-echarts {
  width: 100%;
  height: 650px;
  margin: 0 0 20px 0;
}
.time-box {
  position: relative;
  top: 20px;
  text-align: left;
  margin-left: 80px;
}
.date-picker-box {
  width: 180px;
  margin: 0 20px 20px 0;
}
.home-control-box {
  display: flex;
  margin-bottom: 50px;
}
.home-control-item {
  flex: 1;
  margin-left: 20px;
}
</style>
