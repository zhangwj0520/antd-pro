import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default class StepForm extends PureComponent {
  render() {
    const { location, children } = this.props;
    return <div>{children}</div>;
  }
}
