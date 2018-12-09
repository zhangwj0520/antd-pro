import React, { Component, Suspense, memo } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, Card, Tabs, Tag } from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import router from 'umi/router';
import styles from './curved.less';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { TimelineChart, Pie } from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';

//
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';

const { TabPane } = Tabs;

const CustomTab = ({ data, currentTabKey: currentKey }) => (
  <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
    <Col span={12}>
      <NumberInfo
        title={data.name}
        subTitle={
          <FormattedMessage id="app.analysis.conversion-rate" defaultMessage="Conversion Rate" />
        }
        gap={2}
        total={`${data.cvr * 100}%`}
        theme={currentKey !== data.name && 'light'}
      />
    </Col>
    <Col span={12} style={{ paddingTop: 36 }}>
      <Pie
        animate={false}
        color={currentKey !== data.name && '#BDE4FF'}
        inner={0.55}
        tooltip={false}
        margin={[0, 0, 0, 0]}
        percent={data.cvr * 100}
        height={64}
      />
    </Col>
  </Row>
);

const data = [
  {
    month: 'Jan',
    Tokyo: 170,
    London: 139,
    Des: '1月份111111',
    State: true,
  },
  {
    month: 'Feb',
    Tokyo: 169,
    London: 142,
    Des: '2月份2222222',
    State: false,
  },
  {
    month: 'Mar',
    Tokyo: 195,
    London: 157,
    Des: '3月份333333',
    State: true,
  },
  {
    month: 'Apr',
    Tokyo: 245,
    London: 185,
    Des: '4月份4444444',
    State: false,
  },
];
const ds = new DataSet();
const dv = ds.createView().source(data);
dv.transform({
  type: 'fold',
  fields: ['Tokyo', 'London'],
  // 展开字段集
  key: 'city',
  // key字段
  value: 'temperature', // value字段
});
console.log(dv);

@connect(({ medchart, chart, loading }) => ({
  medchart,
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    activeKey: '',
    chartIns: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
      // dispatch({
      //   type: 'medchart/fetch',
      //   payload: { name: '鸡内金' },
      // });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
  }

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };
  handleChartEvent = e => {
    console.log(e);
  };

  callback = key => {
    //console.log(key);
    this.setState({ activeKey: key });
    //this.state.chartIns.showTooltip({x:100,y:100})
    const pos = this.state.chartIns.getXY(dv.rows[0]);
    console.log(pos);
    console.log(this.state.chartIns.showTooltip({ x: 200, y: 100 }));
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { medchart, chart, loading } = this.props;
    //console.log(chart);
    //console.log(medchart)
    const { offlineData, offlineChartData } = chart;
    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const cols = {
      month: {
        range: [0, 1],
      },
    };

    const scale = {
      month: {
        alias: '月份',
      },
      temperature: {
        alias: '温度',
      },
    };
    const month_title = {
      autoRotate: { Boolean }, // 是否需要自动旋转，默认为 true
      //offset: {Number}, // 设置标题 title 距离坐标轴线的距离
      title: true,
      textStyle: {
        fontSize: '18',
        textAlign: 'center',
        fill: '#555',
        fontWeight: 'bold',
        //rotate: {角度}
      }, // 坐标轴文本属性配置
      //position: 'start' || 'center' || 'end', // 标题的位置，**新增**
    };
    const tem_title = {
      //autoRotate: {Boolean}, // 是否需要自动旋转，默认为 true
      //offset: {Number}, // 设置标题 title 距离坐标轴线的距离
      title: true,
      textStyle: {
        fontSize: '18',
        textAlign: 'center',
        fill: '#555',
        fontWeight: 'bold',
        //rotate: {角度}
      }, // 坐标轴文本属性配置
      //position: 'start' || 'center' || 'end', // 标题的位置，**新增**
    };
    //let chartIns;
    //console.log(this.state.activeKey);
    return (
      <GridContent>
        <Suspense fallback={null}>
          <Card
            loading={loading}
            className={styles.offlineCard}
            bordered={false}
            style={{ marginTop: 32 }}
          >
            <Tabs activeKey={this.state.activeKey || data[0].month} onChange={this.callback}>
              {data.map((item, index) => {
                if (item.State) {
                  return (
                    <TabPane tab={<Tag color="#87d068">{item.month}</Tag>} key={item.month}>
                      {item.Des}
                    </TabPane>
                  );
                } else {
                  return (
                    <TabPane tab={<Tag color="red">{item.month}</Tag>} key={item.month}>
                      {item.Des}
                    </TabPane>
                  );
                }
              })}
            </Tabs>
            <Chart
              height={400}
              data={dv}
              scale={cols}
              forceFit
              scale={scale}
              onGetG2Instance={g2Chart => {
                this.setState({ chartIns: g2Chart });
                let pos = g2Chart.getXY(dv.rows[0]);
                console.log(pos);
                g2Chart.showTooltip({ x: 100, y: 200 });
              }}
              onPlotClick={ev => {
                var point = {
                  x: ev.x,
                  y: ev.y,
                };
                var items = this.state.chartIns.getTooltipItems(point);
                //console.log(items[1].title);
                //console.log(ev);
                this.setState({ activeKey: items[0].title });
              }}
            >
              <Legend position="top" />
              <Axis name="month" title={month_title} />
              <Axis
                name="temperature"
                title={tem_title}
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
            <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
              {offlineData.map(shop => (
                <TabPane
                  tab={<CustomTab data={shop} currentTabKey={activeKey} />}
                  key={shop.name}
                />
              ))}
            </Tabs>
          </Card>
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;
