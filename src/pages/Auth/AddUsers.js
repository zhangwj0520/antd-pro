import React, { Component } from 'react';
import { Button, Checkbox, Row, Col, Modal, Steps, Form } from 'antd';
import { btnAuthority } from '@/utils/authority';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Step1 from './step1.js';
import Step2 from './step2.js';
import Step3 from './step3.js';
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];
const Step = Steps.Step;

@Form.create()
export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      userData: { passWord: '123456' },
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      visible: true,
      current: 1,
      steps: [
        {
          title: '人员基本信息',
        },
        {
          title: '角色权限设置',
        },
        {
          title: '完成',
        },
      ],
    };
  }

  onAddStuffing = () => {
    this.setState({
      visible: true,
    });
  };

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { userData, current } = this.state;
        //current += 1;
        console.log(current);
        console.log(values);
        userData = Object.assign({}, userData, values);
        this.setState({ userData, current });
      }
    });
  };
  handleComplete = () => {
    // dispatch({
    //   type: 'register/submit',
    //   payload: {
    //     ...values,
    //   },
    // });
  };

  render() {
    const { rightCode, checkedList, current, steps } = this.state;
    const { form } = this.props;
    const ModalFooter = (
      <div>
        <Row type="flex" justify="center">
          <Col>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={e => this.handleSubmit(e)}>
                下一步
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={this.handleComplete}>
                {' '}
                完成
              </Button>
            )}
          </Col>
        </Row>
      </div>
    );
    return (
      <PageHeaderWrapper title="添加用户" content="添加新用户,并配置权限">
        <Button
          disabled={!btnAuthority('admin')}
          type="primary"
          style={{ marginRight: 20, marginLeft: 10 }}
          icon="user"
          onClick={this.onAddStuffing}
        >
          添加新用户
        </Button>
        <Modal
          title="添加新用户"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={ModalFooter}
        >
          <Steps current={current}>
            {steps.map((item,index) => (
              <Step key={index} title={item.title} className={item.icon} />
            ))}
          </Steps>
          {current == "0" ? (
            <Step1 handleSubmit={this.handleSubmit} form={form} />
          ) : current == '1' ? (
            <Step2 handleSubmit={this.handleSubmit} form={form} onChange={this.onChange} />
          ) : (
            <Step3 />
          )}
        </Modal>

        {/* <div>
          <div style={{ borderBottom: '1px solid #E9E9E9' }}>
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              Check all
            </Checkbox>
          </div>
          <br />
          <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
            <Row>
              <Col span={24}>
                <Checkbox value="A">A</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="B">B</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="C">C</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="D">D</Checkbox>
              </Col>
              <Col span={24}>
                <Checkbox value="E">E</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
          <CheckboxGroup
            options={plainOptions}
            value={this.state.checkedList}
            onChange={this.onChange}
          />
        </div> */}
      </PageHeaderWrapper>
    );
  }
}
