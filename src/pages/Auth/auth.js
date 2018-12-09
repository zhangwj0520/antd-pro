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
      rightCode: 'btn',
      userData: { aaa: 11 },
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      visible: true,
      current: 1,
      steps: [
        {
          title: '人员基本信息',
          //content: BasicInfo
        },
        {
          title: '角色权限设置',
          //content: SetAuth
        },
        {
          title: '完成',
          //content: SetAuth
        },
      ],
    };
  }

  onChangeRule = () => {
    //const rightCode1=this.state.rightCode=='admin'?'useradmin':'admin'
    this.setState({ rightCode: this.state.rightCode == 'admin' ? 'useradmin' : 'admin' });
    console.log(this.state.rightCode);
  };
  onAddStuffing = () => {
    console.log('tianjian');
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
        console.log(values)
        userData = Object.assign({}, userData, values);
        this.setState({ userData, current });
      }
    });
  };

  render() {
    const { rightCode, checkedList, current, steps } = this.state;
    //console.log(checkedList);
    const { form } = this.props;
    //console.log(this.props)
    const ModalFooter = (
      <div>
        <Row type="flex" justify="center">
          <Col>
            {/* {current> 0 && <Button style={{marginLeft:8}} type="gohst" onClick={(e)=>this.props.prev()}>上一步</Button>} */}
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
      <PageHeaderWrapper>>
        <h1>权限</h1>
        <Button
          disabled={!btnAuthority(rightCode)}
          type="primary"
          style={{ marginRight: 20, marginLeft: 10 }}
          icon="user"
          onClick={this.onAddStuffing}
        >
          新增人员
        </Button>
        <Button
          type="primary"
          style={{ marginRight: 20, marginLeft: 10 }}
          icon="user"
          onClick={this.onChangeRule}
        >
          更改权限
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={ModalFooter}
        >
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} className={item.icon} />
            ))}
          </Steps>
          {current == 0 ? (
            <Step1 handleSubmit={this.handleSubmit} form={form} />
          ) : current == '1' ? (
            <Step2 handleSubmit={this.handleSubmit} form={form} onChange={this.onChange}/>
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
