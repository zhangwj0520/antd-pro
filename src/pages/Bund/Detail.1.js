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
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
//import TableForm from './TableForm';
import isEqual from 'lodash/isEqual';
import styles from './style.less';
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
      detailList: this.props.bund.detailList,
      data: this.props.bund.detailList.data,
      id: this.props.bund.detailList._id,
      width: '100%',
      loading: false,
    };
  }

  componentDidMount() {}

  componentWillMount() {}

  getRowByKey(name, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.name === name)[0];
  }

  toggleEditable = (e, name) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(name, newData);
    console.log(target);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[name] = { ...target };
      }
      target.editable = !target.editable;

      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.unshift({
      key: `NEW_TEMP_ID_${this.index}`,
      quantity:'',
      editable: true,
      isNew: true,
      add:true
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    //onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, name) {
    console.log(e.target.value)
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(name, newData);

    if (target) {
      if (fieldName == 'zhongbiao') {
        target[fieldName] = e;
      } else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }
  handleFieldChange2(e, fieldName, name) {
    //console.log(e.target.value)
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(name, newData);
    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
    }
  }

  saveRow(e, name) {
    e.persist();
    this.setState({
      loading: true,
    });
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(name) || {};
    if (!target.dingdan_price || !target.quantity) {
      message.error('请填写完整成员信息。');
      e.target.focus();
      this.setState({
        loading: false,
      });
      return;
    }
    delete target.isNew;
    this.toggleEditable(e, name);
    const { data, id } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/updateOne',
      payload: { data, id },
    });

    this.setState({
      loading: false,
    });
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { width, loading, data } = this.state;
    console.log(data)
    //const expandedRowRender = record => <p>{record.description}</p>;
    const columns = [
      {
        title: '品名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 100,
        render: (text, record) => {
          if (record.add) {
            return (
              <Input
                value={text}
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
          if (record.editable) {
            return (
              <Select
                size="small"
                style={{ width: 80 }}
                placeholder="是否中标"
                onChange={e => this.handleFieldChange2(e, 'zhongbiao', record.name)}
              >
                <Option value={1}>是</Option>
                <Option value={0}>否</Option>
              </Select>
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
        width: 80,
        render: (text, record) => {
          if (record.add) {
            return (
              <Input
                //value={text}
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
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'back_quantity', record.name)}
                onKeyPress={e => this.handleKeyPress(e, record.name)}
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
                value={text}
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
                value={text}
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
                value={text}
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
        title: '品质及要求',
        dataIndex: 'description',
        key: 'description',
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
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper>
        <Fragment>
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加新品种
          </Button>
          <Table
            //expandedRowRender={expandedRowRender}
            scroll={{ x: 1300, y: 1000 }}
            bordered
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={record => (record.editable ? styles.editable : '')}
          />
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            添加新品种
          </Button>
        </Fragment>
        {/* {getFieldDecorator('members', {
          initialValue: tableData,
        })(<TableForm />)} */}
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
