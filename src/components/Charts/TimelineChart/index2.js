import React from 'react';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
import autoHeight from '../autoHeight';
import styles from './index.less';

@autoHeight()
class TimelineChart extends React.Component {
  render() {
    const {
      title,
      height = 400,
      padding = [60, 20, 40, 40],
      titleMap = {
        y1: 'y1',
        y2: 'y2',
      },
      borderWidth = 2,
      data = [
        {
          x: 0,
          y1: 0,
          y2: 0,
        },
      ],
    } = this.props;

    data.sort((a, b) => a.x - b.x);

    let max;
    if (data[0] && data[0].y1 && data[0].y2) {
      max = Math.max(
        [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
        [...data].sort((a, b) => b.y2 - a.y2)[0].y2
      );
    }

    const ds = new DataSet({
      state: {
        start: data[0].x,
        end: data[data.length - 1].x,
      },
    });

    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.x;
          return date <= ds.state.end && date >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          newRow[titleMap.y1] = row.y1;
          newRow[titleMap.y2] = row.y2;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: [titleMap.y1, titleMap.y2], // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const timeScale = {
      type: 'time',
      tickInterval: 60 * 60 * 1000,
      mask: 'HH:mm',
      range: [0, 1],
    };

    const cols = {
      x: timeScale,
      value: {
        max,
        min: 0,
      },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );
    //...
    const data1 = [
      {
        month: 'Jan',
        Tokyo: 7.0,
        London: 3.9,
      },
      {
        month: 'Feb',
        Tokyo: 6.9,
        London: 4.2,
      },
      {
        month: 'Mar',
        Tokyo: 9.5,
        London: 5.7,
      },
      {
        month: 'Apr',
        Tokyo: 14.5,
        London: 8.5,
      },
      {
        month: 'May',
        Tokyo: 18.4,
        London: 11.9,
      },
      {
        month: 'Jun',
        Tokyo: 21.5,
        London: 15.2,
      },
      {
        month: 'Jul',
        Tokyo: 25.2,
        London: 17.0,
      },
      {
        month: 'Aug',
        Tokyo: 26.5,
        London: 16.6,
      },
      {
        month: 'Sep',
        Tokyo: 23.3,
        London: 14.2,
      },
      {
        month: 'Oct',
        Tokyo: 18.3,
        London: 10.3,
      },
      {
        month: 'Nov',
        Tokyo: 13.9,
        London: 6.6,
      },
      {
        month: 'Dec',
        Tokyo: 9.6,
        London: 4.8,
      },
    ];
    //const ds = new DataSet();
    const dv1 = ds.createView().source(data1);
    dv1.transform({
      type: 'fold',
      fields: ['Tokyo', 'London'],
      // 展开字段集
      key: 'city',
      // key字段
      value: 'temperature', // value字段
    });
    console.log(dv1);
    const cols1 = {
      month: {
        range: [0, 1],
      },
    };
    return (
      <div >
        <div>
          <h4>123</h4>
          <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
            <Axis name="x" />
            <Tooltip />
            <Legend name="key" position="top" />
            <Geom type="line" position="x*value" size={borderWidth} color="key" />
          </Chart>
          <div style={{ marginRight: -20 }}>
            <SliderGen />
          </div>
          <h4>2222</h4>
          <Chart height={400} data={dv1} scale={cols1} forceFit>
            <Legend />
            <Axis name="month" />
            <Axis
              name="temperature"
              label={{
                formatter: val => `${val}°C`,
              }}
            />
            <Tooltip
              crosshairs={{
                type: 'y',
              }}
            />
            <Geom
              type="line"
              position="month*temperature"
              size={2}
              color={'city'}
              shape={'smooth'}
            />
            <Geom
              type="point"
              position="month*temperature"
              size={4}
              shape={'circle'}
              color={'city'}
              style={{
                stroke: '#fff',
                lineWidth: 1,
              }}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export default TimelineChart;
