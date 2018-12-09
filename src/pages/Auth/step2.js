import React, { Component } from 'react';
import { Form, Input, Icon, Row, Col, Checkbox, Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
const plainOptions = ['Apple', 'Pear', 'Orange'];
const FormItem = Form.Item;

//@Form.create()
export default class step1 extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
    const antuData = [{ value: 1, name: "页面权限:账单提交页面" }, { value: 2, name: 2 }, { value: 3, name: 2 }];
    return (
      <div>
        <Divider />
        <Form>
  
          <FormItem {...formItemLayout}>
            {getFieldDecorator('auth')(
              <Checkbox.Group style={{ width: '100%' }} onChange={this.props.onChange}>
                <Row>
                  {antuData.map((item, index) => (
                    <Col span={24} key={index} offset={6}>
                      <Checkbox style={{fontSize: '16px',fontWeight: 'bold'}} value={item.value}>{item.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
