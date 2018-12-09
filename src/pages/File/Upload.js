import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Tabs,
  Table,
  Modal,
  Cascader,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Upload.less';
import XLSX from 'xlsx';
import dateFormat from 'dateformat';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const TextArea = Input.TextArea;

/* eslint react/no-multi-comp:0 */
@connect(({ file }) => ({ file }))
// @connect(state => state)
@Form.create()
class TableList extends PureComponent {
  state = {
    dataSourse: {},
    visible: false,
    sn: '',
    vender: '',
    dingdan_time: '',
  };

  componentDidMount() {
    // const fruitColor = new Map()
    //   .set('red', ['apple', 'strawberry'])
    //   .set('yellow', ['banana', 'pineapple'])
    //   .set('purple', ['grape', 'plum']);
    // function test(color) {
    //   return fruitColor.get(color) || [];
    // }
    // console.log(test('red'))
  }
  readExcel = e => {
    const files = e.target.files;
    const outputs = {}; //清空接收数据
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      try {
        const data = ev.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary',
        });
        for (let sheet in workbook.Sheets) {
          outputs[sheet] = [];
          const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { header: 1 }); //获得以第一列为键名的sheet数组对象
          if (sheetArray.length) {
            let flag = 0,
              i = 0,
              name = 0,
              quantity = 0,
              dingdan_price = 0,
              caigou_price = '',
              zhongbiao = '',
              description = '',
              specifications = '',
              origin = '';
            for (; i < 4; i++) {
              let cur = sheetArray[i];
              //console.log(cur)
              for (let m = 0; m < cur.length - 1; m++) {
                if (cur[m] == null) {
                  cur[m] = 'null';
                }
              }
              // console.log(cur);
              for (let [index, elem] of cur.entries()) {
                // 匹配订单编号
                let sn = /[a-zA-Z]{2,3}(\d{8})$/g.exec(elem);
                if (sn) {
                  this.setState({
                    sn: sn[0],
                    dingdan_time: sn[1],
                  });
                }
                // 厂家
                let vender = /(\u5d07\u5149)|(\u91d1\u5d07\u5149)|(\u7d2b\u4e91\u817e)|(\u4e5d\u53d1)/g.exec(
                  elem
                );
                if (vender) {
                  this.setState({
                    vender: vender[0],
                  });
                }
                // 品名
                if (/\u54c1\u540d/g.test(elem)) {
                  name = index;
                  flag = i;
                }
                // 采购量
                if (/\u91c7\u8d2d\u91cf/g.test(elem)) {
                  quantity = index;
                }
                // 单价
                if (/\u5355\u4ef7/g.test(elem)) {
                  dingdan_price = index;
                }
                // 采购价
                if (/\u91c7\u8d2d\u4ef7/g.test(elem)) {
                  caigou_price = index;
                  console.log(elem);
                }
                // 中标
                if (/\u4e2d\u6807/g.test(elem)) {
                  zhongbiao = index;
                }
                // 品质及要求
                if (/\u54c1\u8d28\u53ca\u8981\u6c42/g.test(elem)) {
                  description = index;
                }
                // 规格
                if (/\u89c4\u683c/g.test(elem)) {
                  specifications = index;
                }
                // 产地
                if (/\u4ea7\u5730/g.test(elem)) {
                  origin = index;
                }
              }
            }
            //console.log(`循环从${flag}开始`);
            for (let j = flag + 1; j <= sheetArray.length - 1; j++) {
              let cur = sheetArray[j];
              let obj = {
                key: j - i,
                name: cur[name],
                quantity: cur[quantity],
                dingdan_price: cur[dingdan_price],
                caigou_price: cur[caigou_price] || 0,
                zhongbiao: cur[zhongbiao] || 0,
                specifications: cur[specifications],
                origin: cur[origin],
                description: cur[description],
                jiesuan: 0, //结算
                back_quantity: 0, //退尾料
                settlement: 0, //是否结算
              };
              outputs[sheet].push(obj);
            }
          } else {
            delete outputs[sheet];
          }
          console.log(outputs);
        }
        //console.log(outputs);
        this.setState({ dataSourse: outputs });
      } catch (e) {
        console.log(e);
        return false;
      }
    };
    fileReader.readAsBinaryString(files[0]);
  };
  onSave = () => {
    const { dispatch } = this.props;
    const { dataSourse, sn, vender, dingdan_time } = this.state;
    for (const key in dataSourse) {
      //console.log(key)
      let values = { sn, vender, dingdan_time };
      if (key === '医院' || key === '同仁堂') {
        values.venderType = key;
      } else {
        values.venderType = '无';
      }
      values.data = dataSourse[key];
      values['key'] = sn + key;
      console.log(values);
      dispatch({
        type: 'file/upload',
        payload: values,
      });
    }
  };
  onCancle = () => {
    this.setState({
      visible: false,
      // dataSourse: {},
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const { dataSourse } = this.state;
        values.time = Number(values.time.format('YYYYMMDD'));
        for (const key in dataSourse) {
          if (key === '医院' || key === '同仁堂') {
            values.venderType = key;
          } else {
            values.venderType = '无';
          }
          values.data = dataSourse[key];
          values['key'] = Math.floor(Math.random() * 10000000);
          console.log(values);
          dispatch({
            type: 'file/upload',
            payload: values,
          });
        }
        this.onCancle();
      }
    });
  }

  ModalFooter = (
    <div>
      <Row type="flex" justify="center">
        <Col>
          <Button type="primary" onClick={this.onCancle}>
            取消
          </Button>
          <Button type="primary" onClick={e => this.handleSubmit(e)}>
            提交
          </Button>
        </Col>
      </Row>
    </div>
  );

  render() {
    const { dataSourse, loading, selectedRows } = this.state;
    //console.log(dataSourse);
    const data = Object.entries(dataSourse);
    //console.log(data);
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '品名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '数量(Kg)',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: '订单价格(元)',
        dataIndex: 'dingdan_price',
        key: 'dingdan_price',
      },
      {
        title: '采购价格(元)',
        dataIndex: 'caigou_price',
        key: 'caigou_price',
      },
      {
        title: '是否中标',
        dataIndex: 'zhongbiao',
        key: 'zhongbiao',
        render: (text, record) => {
          if (text) {
            return '是';
          } else {
            return '否';
          }
        },
      },
    ];
    const vender = [
      {
        value: '紫云腾',
        label: '紫云腾',
      },
      {
        value: '九发',
        label: '九发',
      },
      {
        value: '崇光',
        label: '崇光',
      },
      {
        value: '金崇光',
        label: '金崇光',
      },
    ];

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const Option = Select.Option;
    return (
      <PageHeaderWrapper>
        <Row gutter={8}>
          <Col className={styles.btn_addPic} id="fileupload" span={11} offset={1}>
            <Button className={styles.filePre} type="primary">
              上传文件
            </Button>
            <input
              type="file"
              className={styles.filePrew}
              id="excel-file"
              onChange={this.readExcel}
            />
          </Col>
          <Col span={12}>
            {data.length ? (
              <Button type="primary" onClick={this.onSave}>
                保存
              </Button>
            ) : null}
          </Col>
        </Row>

        {data.length ? (
          <Tabs defaultActiveKey="0">
            {data.map((item, index) => (
              <TabPane tab={item[0]} key={index}>
                <Table dataSource={item[1]} columns={columns} key={item[0]} />
              </TabPane>
            ))}
          </Tabs>
        ) : (
          <h2>请上传文件</h2>
        )}
        <Modal
          title="添加订单信息"
          visible={this.state.visible}
          footer={this.ModalFooter}
          onCancel={this.onCancle}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="订单编号">
              {getFieldDecorator('sn', {
                rules: [
                  {
                    required: true,
                    message: '请输入订单编号',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="订单厂家">
              {getFieldDecorator('vender', {
                rules: [
                  {
                    required: true,
                    message: '请选择厂家',
                  },
                ],
              })(
                <Select>
                  {vender.map(function(item, index) {
                    return (
                      <Option key={index} value={item.value}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="订单厂家">
              {getFieldDecorator('vender', {
                rules: [
                  {
                    required: true,
                    message: '请选择厂家',
                  },
                ],
              })(<Cascader options={vender} placeholder="请选择厂家" />)}
            </FormItem> */}

            <FormItem {...formItemLayout} label="订单日期">
              {getFieldDecorator('time', {
                rules: [{ type: 'object', required: true, message: 'Please select time!' }],
              })(<DatePicker format="YYYY-MM-DD" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark')(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
