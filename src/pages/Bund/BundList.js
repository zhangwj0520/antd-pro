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
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Popconfirm,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['未结算', '部分结算', '已结算'];
const status = ['未结算', '部分结算', '已结算'];

/* eslint react/no-multi-comp:0 */
@connect(({ bund }) => ({
  bund,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    editable: false,
  };

  columns = [
    {
      title: '订单编号',
      dataIndex: 'sn',
      key: 'sn',
    },
    {
      title: '发货日期',
      dataIndex: 'fahuo_time',
      editable: true,
      sorter: (a, b) => a.time - b.time,
      key: 'fahuo_time',
      //render: val => <span>{moment(val).format('YYYY年MM月DD日')}</span>,
      //render: val => <span>{val}</span>,
      render: (text, record) => {
        if (record.editing) {
          return (
            <DatePicker
              onChange={(data, fahuo_time) => this.onSave(data, fahuo_time, record)}
              placeholder="选择发货日期"
            />
          );
        }
        return (
          <span onClick={this.toggleEdit.bind(this, record._id)}>
            {text ? text : '请选择发货日期'}
          </span>
        );
      },
    },
    {
      title: '订单厂家',
      dataIndex: 'vender',
      key: 'vender',
    },
    {
      title: '总订单金额(元)',
      dataIndex: 'dingdan_totalPrice',
      key: 'dingdan_totalPrice',
    },
    {
      title: '总中标金额(元)',
      dataIndex: 'zhongbiao_totalPrice',
      key: 'zhongbiao_totalPrice',
    },
    {
      title: '总采购金额(元)',
      dataIndex: 'caigou_totalPrice',
      key: 'caigou_totalPrice',
    },
    {
      title: '已结算金额(元)',
      dataIndex: 'jiesuan_price',
      key: 'jiesuan_price',
    },
    {
      title: '类别',
      dataIndex: 'venderType',
      key: 'venderType',
    },
    {
      title: '结算状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {/* <a onClick={() => this.deleteLite(record._id)}>删除</a> */}
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteLite(record._id)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.detailList(record)}>查看详细</a>
        </Fragment>
      ),
    },
  ];

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/fetch',
    });
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { dispatch } = props;
  //   dispatch({
  //     type: 'bund/fetch',
  //   });
  // }
  onSave = (data, fahuo_time, record) => {
    console.log(record._id);
    console.log(fahuo_time);

    const { dispatch } = this.props;
    dispatch({
      type: 'bund/updateTime',
      payload: { id: record._id, fahuo_time },
    });
    this.toggleEdit();
  };

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
  toggleEdit(id) {
    // const editing = !this.state.editing;
    // this.setState({ editing });
    console.log(id);
    //const { data, editable } = this.state;
    // if (editable) {
    //   const { target, key } = this.getRowByKey(name);
    //   data[key].editable = true;
    //   this.setState({ data, target, key, editable: false });
    // } else {
    //   message.warning('请先保存未完成的编辑任务!!!');
    // }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // dispatch({
    //   type: 'rule/fetch',
    //   payload: params,
    // });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  // handleUpdateModalVisible = (flag, record) => {
  //   this.setState({
  //     updateModalVisible: !!flag,
  //     stepFormValues: record || {},
  //   });
  // };
  deleteLite = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bund/deleteList',
      payload: { id },
    });
  };
  detailList = record => {
    const { dispatch } = this.props;
    router.push(`/bund/bundlist/detail/${record._id}`);
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    //console.log(this.props.bund);
    // console.log(this.props.rule);
    const {
      //rule: { data },
      bund: { data },
      loading,
    } = this.props;
    console.log(data);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
    };
    const updateMethods = {
      // handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
