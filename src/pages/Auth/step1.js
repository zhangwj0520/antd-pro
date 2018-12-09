import React, { Component } from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Divider,
  Card,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
const FormItem = Form.Item;

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
    return (
      <div>
        <Divider />
        <Form >
          <FormItem {...formItemLayout} label="用户名"  onSubmit={this.props.handleSubmit}>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
                {
                  min: 4,
                  message: formatMessage({ id: 'validation.userName.wrong-min' }),
                },
              ],
            })(
              <Input
                size="large"
                placeholder={formatMessage({ id: 'form.userName.placeholder' })}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            123456
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name')(<Input size="large" placeholder={'请输入姓名(选填)'} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号">
            {getFieldDecorator('mobile')(<Input size="large" placeholder={'请输入手机号(选填)'} />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}
