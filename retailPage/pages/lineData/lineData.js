import * as echarts from '../shwoData/echarts';
var Chart = null;
const app = getApp();
var ajax = require("../../../utils/ajax.js")
var util = require("../../../utils/util.js")
Page({
  data: {
    ec: {
      onInit: function (canvas, width, height) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        return chart;
      },
      lazyLoad: true // 延迟加载
    },
    nowDate: '',
    dateArray:[],
    dayDate:[],
    record:{}
  },
  onLoad: function (options) {
    var date =  util.formatTime(new Date())
    var newData = date.replace('-', '年').replace('-', '月').substring(0, 8);
    this.setData({
      nowDate:newData
    });
    var uid = app.globalData.uid;
    this.getData(uid,newData)
    this.echartsComponnet = this.selectComponent('#mychart');
    //如果是第一次绘制
    if (!Chart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setOption(Chart); //更新数据
    }
  },
  onReady() {
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    //console.log(e.detail.value)
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart)
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  // 图表配置项
  getOption() {
    var self = this;
    var option = {
      title: {//标题
        text: '折线图',
        left: 'center'
      },
      renderAsImage: true, //支持渲染为图片模式
      color: ["#ffffff"],//图例图标颜色
      legend: {
        show: true,
        itemGap: 25,//每个图例间的间隔
        top: 30,
        x: 30,//水平安放位置,离容器左侧的距离  'left'
        z: 1,
        textStyle: {
          color: '#ffffff'
        }
      },
      grid: {//网格
        left: 30,
        top: 45,
        bottom:30,
        containLabel: true,//grid 区域是否包含坐标轴的刻度标签
      },
      xAxis: {//横坐标
        type: 'category',
        splitLine: {//坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        boundaryGap: false,//1.true 数据点在2个刻度直接  2.fals 数据点在分割线上，即刻度值上
        data: self.data.dayDate.time,
        axisLabel: {
          textStyle: {
            fontSize: 12,
            color: '#ffffff'
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff',//左边线的颜色
          }
        },
      },
      yAxis: {//纵坐标
        type: 'value',
        position: 'left',
        name: '分销订单量',//纵坐标名称
        nameTextStyle: {//在name值存在下，设置name的样式
          color: '#ffffff',
          fontStyle: 'normal'
        },
        splitNumber: 5,//坐标轴的分割段数
        splitLine: {//坐标轴在 grid 区域中的分隔线。
          show: true,
          lineStyle: {
            type: 'dashed',
            color:'#ffffff'
          }
        },
        axisLine: {
          lineStyle: {
            type: 'solid',
            color: '#fff'
          }
        },
        // min: 0,
        // max: 100,
      },
      series: [{
        type: 'line',
        data: self.data.dayDate.data,
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#50ACFE'
            }
          }
        },
        areaStyle: {
          normal: {
            color: '#8cd5c2' //改变区域颜色
          }
        },
      }],
    }
    return option;
  },
  getData(uid,month){
    var that = this;
    var item = {
      merchid:uid,
      month:month
    }
    wx.showLoading({ mask: 'true' });
    ajax.wxRequest('POST', 'Merchant/myRecord', item,
      (res) => {
        wx.hideLoading();
        //console.log(res)
        if (res.code == 200) {
          wx.hideLoading();
          that.setData({
            dateArray: res.data.graph.month,
            dayDate:res.data.graph.day,
            record:res.data.record
          })
        

        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }

      },
      (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '数据加载失败' + err,
          icon: "none"
        })
      })
  }
});
