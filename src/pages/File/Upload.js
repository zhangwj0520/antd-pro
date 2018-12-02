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
  };

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'rule/fetch',
  //   });
  // }
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
          const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]); //获得以第一列为键名的sheet数组对象
          if (sheetArray) {
            let len = sheetArray.length;
            if (len === 0) {
              delete outputs[sheet];
              break;
            }
            const sheetOne = sheetArray[0];
            const nameObj = {};
            for (let item in sheetOne) {
              const temp = 'aa' + item;
              if (temp.indexOf('名称') > 0) {
                nameObj.name = item;
              }
              if (temp.indexOf('数量') > 0) {
                nameObj.quantity = item;
              }
              if (temp.indexOf('单价') > 0) {
                nameObj.dingdan_price = item;
              }
              if (temp.indexOf('采购价') > 0) {
                nameObj.caigou_price = item;
              }
            }
            if (Object.keys(nameObj).length === 0) {
              message.error('文件格式错误,请保证表格第一行是类型');
              return;
            }
            for (let i = 0; i < len; i++) {
              const cur = sheetArray[i];
              var obj = {
                name: cur[nameObj.name],
                key: cur[nameObj.name] + Math.random(),
                quantity: cur[nameObj.quantity],
                dingdan_price: cur[nameObj.dingdan_price],
                caigou_price: cur[nameObj.caigou_price] || 0,
                // return: 0,
                // ok: false,
                // status: 0,
                // totle_dingdan_price: 0,
                // totle_caigou_price: 0,
              };
              outputs[sheet].push(obj);
            }
          }
        }
        this.setState({ dataSourse: outputs });
      } catch (e) {
        return false;
      }
    };
    fileReader.readAsBinaryString(files[0]);
  };
  onSave = () => {
    this.setState({
      visible: true,
    });
  };
  onCancle = () => {
    this.setState({
      visible: false,
      dataSourse: {},
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
    console.log(dataSourse);
    const data = Object.entries(dataSourse);
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
    return (
      <PageHeaderWrapper title="上传文件">
        <input type="file" id="excel-file" onChange={this.readExcel} />
        {data.length ? (
          <Button type="primary" onClick={this.onSave}>
            保存
          </Button>
        ) : null}
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
        <Modal title="添加订单信息" visible={this.state.visible} footer={this.ModalFooter}>
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
              })(<Cascader options={vender} placeholder="请选择厂家'" />)}
            </FormItem>

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
