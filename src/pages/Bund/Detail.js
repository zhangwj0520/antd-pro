import React, { PureComponent, Fragment } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
  Table,
  message,
  Popconfirm,
  Divider,
  Tag,
  Switch,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
//import TableForm from './TableForm';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
import { queryOneList, updateOneList } from '@/services/api';
const Option = Select.Option;

@connect(({ bund }) => ({
  bund,
}))
@Form.create()
class AdvancedForm extends PureComponent {
  index = 0;
  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      oneList: {},
      data: [],
      width: '100%',
      loading: false,
      target: {},
      key: 0,
      editable: true,
      total: 0,
    };
  }

  componentWillMount() {
    this.getInitData();
  }
  // componentDidMount() {
  //   //console.log(this.props.bund.queryOneData);
  // }

  getInitData() {
    const { id } = this.props.match.params;
    queryOneList(id).then(res => {
      const {
        status,
        oneList,
        oneList: { data },
      } = res;
      const total = data.length;
      if (status == 'ok') {
        this.setState({ oneList, data, total });
      }
    });
  }

  remove(name) {
    const { data, id } = this.state;
    const newData = data.filter(item => item.name !== name);
    updateOneList({ data: newData, id }).then(res => {
      const { status } = res;
      if (status == 'ok') {
        this.setState({ data: newData });
      }
    });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, name) {
    let { target } = this.state;
    if (target) {
      if (fieldName == 'zhongbiao' || fieldName == 'jiesuan') {
        target[fieldName] = e ? 1 : 0;
      } else {
        target[fieldName] = e.target.value;
      }
      console.log(target);
      this.setState({ target });
    }
  }

  getRowByKey(name) {
    const { data } = this.state;
    let target, key;
    //return  data.filter(item => item.name === name)[0];
    data.map((item, index) => {
      if (item.name === name) {
        target = item;
        key = index;
      }
    });
    return { target, key };
  }

  toggleEditable = (e, name) => {
    e.preventDefault();
    const { data, editable } = this.state;
    if (editable) {
      const { target, key } = this.getRowByKey(name);
      data[key].editable = true;
      this.setState({ data, target, key, editable: false });
    } else {
      message.warning('请先保存未完成的编辑任务!!!');
    }
  };

  saveRow() {
    let { data, target, key, editable, id } = this.state;
    let newData = data.map(item => ({ ...item }));
    delete target.editable;
    delete target.isNew;
    newData[key] = target;
    updateOneList({ data: newData, id }).then(res => {
      const { status } = res;
      if (status == 'ok') {
        this.setState({ data: newData, target: {}, editable: true });
      }
    });
  }

  cancel() {
    let { data, target, key, editable } = this.state;
    let newData = data.map(item => ({ ...item }));
    delete target.editable;
    newData[key] = target;
    this.setState({ data: newData, target: {}, editable: true });
  }
  //添加
  newMember = () => {
    let { data, total, editable } = this.state;
    if (editable) {
      const newData = data.map(item => ({ ...item }));
      const target = {
        key: total,
        editable: true,
        isNew: true,
        zhongbiao: '1',
        back_quantity: '0',
        caigou_price: '0',
        description: '0',
        dingdan_price: '0',
        quantity: '0',
        settlement: '0',
        jiesuan: '0',
      };
      newData.unshift(target);

      const key = 0;
      total += 1;
      this.setState({ data: newData, target, total, key, editable: false });
    } else {
      message.warning('请先保存未完成的添加!!!');
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { width, loading, target, data, editable, total } = this.state;
    console.log(data);
    const columns = [
      {
        title: '品名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
        render: (text, record) => {
          if (record.isNew) {
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'name', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
                placeholder="品名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '是否中标',
        dataIndex: 'zhongbiao',
        width: 140,
        fixed: 'left',
        filters: [
          {
            text: '是',
            value: 1,
          },
          {
            text: '否',
            value: 0,
          },
        ],
        sorter: (a, b) => a.zhongbiao - b.zhongbiao,
        onFilter: (value, record) => record.zhongbiao == value,
        render: (text, record) => {
          if (record.editable && !record.isNew) {
            return (
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                onChange={e => this.handleFieldChange(e, 'zhongbiao', record.name)}
              />
            );
          }
          if (text) {
            return <Tag color="#87d068">是</Tag>;
          } else {
            return <Tag color="magenta">否</Tag>;
          }
        },
      },
      {
        title: '计划采购量(Kg)',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        render: (text, record) => {
          if (record.isNew) {
            return (
              <Input
                //defaultValue={(text)=>{return this.state.add?0:text}}
                defaultValue={'0'}
                onChange={e => this.handleFieldChange(e, 'quantity', record.quantity)}
                onKeyPress={e => this.handleKeyPress(e, record.quantity)}
                placeholder="计划采购量(Kg)"
              />
            );
          }
          return text;
        },
      },
      {
        title: '退尾料(Kg)',
        dataIndex: 'back_quantity',
        key: 'back_quantity',
        width: 80,
        render: (text, record) => {
          if (record.editable && !record.isNew) {
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'back_quantity', record.back_quantity)}
                onKeyPress={e => this.handleKeyPress(e, record.back_quantity)}
                placeholder="退尾料(Kg)"
              />
            );
          }
          return text;
        },
      },
      {
        title: '订单单价(元)',
        dataIndex: 'dingdan_price',
        key: 'dingdan_price',
        width: 100,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'dingdan_price', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
                placeholder="订单单价(元)"
              />
            );
          }
          return text;
        },
      },
      {
        title: '采购单价(元)',
        dataIndex: 'caigou_price',
        key: 'caigou_price',
        width: 100,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'caigou_price', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
                placeholder="采购单价(元)"
              />
            );
          }
          return text;
        },
      },
      {
        title: '品种总订单价(元)',
        dataIndex: 'pingzhong_dingdan_totalPrice',
        key: 'pingzhong_dingdan_totalPrice',
        width: 120,
        render: (text, record) => {
          return (record.dingdan_price * (record.quantity - record.back_quantity)).toFixed(2);
        },
      },
      {
        title: '品种总采购价(元)',
        dataIndex: 'pingzhong_caigou_totalPrice',
        key: 'pingzhong_caigou_totalPrice',
        width: 120,
        render: (text, record) => {
          return (record.caigou_price * (record.quantity - record.back_quantity)).toFixed(2);
        },
      },
      {
        title: '已结算金额(元)',
        dataIndex: 'settlement',
        key: 'settlement',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'settlement', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
                placeholder="已结算金额"
              />
            );
          }
          return text;
        },
      },
      {
        title: '是否结算',
        dataIndex: 'jiesuan',
        width: 140,
        filters: [
          {
            text: '是',
            value: 1,
          },
          {
            text: '否',
            value: 0,
          },
        ],
        sorter: (a, b) => a.jiesuan - b.jiesuan,
        onFilter: (value, record) => record.jiesuan == value,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                onChange={e => this.handleFieldChange(e, 'jiesuan', record.name)}
              />
            );
          }
          if (text) {
            return <Tag color="#87d068">是</Tag>;
          } else {
            return <Tag color="magenta">否</Tag>;
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input.TextArea
                defaultValue={text}
                onChange={e => this.handleFieldChange(e, 'remark', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
                placeholder="备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '品质及要求',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        render: text => text,
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 130,
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.name)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.name)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.name)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.name)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.name)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.name)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <div>
          <Button
            style={{ width: '100%', marginTop: 3, marginBottom: 3 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加新品种
          </Button>
          <Table
            pagination={{ total, showSizeChanger: true }}
            scroll={{ x: 1400, y: 1000 }}
            bordered
            loading={loading}
            columns={columns}
            dataSource={data}
            rowClassName={record => (record.editable ? styles.editable : '')}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
