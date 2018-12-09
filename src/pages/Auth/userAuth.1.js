import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import { pushState } from 'redux-router';
import { fromJS, is } from 'immutable'
import { omit } from 'lodash'

const authData = ['admin', 'ddd', 'add']

const isAuthenticated = (args) => {
    const { WrappedComponent, rightCode, type } = { ...args }
    console.log(rightCode)
    class UserAuthWrapper extends Component {
        constructor(props) {
            super(props)
            this.state = {
                disabled: true
            }
        }
        componentWillMount() {
            const hasAuth = this.checkAuth(authData, rightCode)
            if (hasAuth) {
                this.setState({
                    disabled: false
                })
            } else {
                this.setState({
                    disabled: true
                })
            }
        }
        checkAuth = (data, rightCode) => {
            if (data) {
                const hasAuth = data.some((item) => {
                    return item === rightCode
                })
                return hasAuth
            }
        }
        // componentWillReceiveProps(nextProps) {
        //     const { authData } = nextProps

        //     let next = fromJS(this.props)
        //     let prev = fromJS(nextProps)
        //     if (!is(next, prev)) {
        //         const hasAuth = this.checkAuth(authData, rightCode)
        //         if (hasAuth) {
        //             this.setState({
        //                 disabled: false
        //             })
        //         } else {
        //             this.setState({
        //                 disabled: true
        //             })
        //         }
        //     }
        // }
        render() {
            const { disabled } = this.state
            const restProps = omit(this.props, 'authData', 'dispatch')
            if (type === 1 && disabled) {
                return null
            }
            if (disabled) {
                return <WrappedComponent disabled={disabled} {...restProps} />
            } else {
                return <WrappedComponent disabled={disabled} {...restProps} />
            }
        }
    }
    // UserAuthWrapper.propTypes = {
    //     authData: PropTypes.array,
    // }
    // UserAuthWrapper.displayName = `UserAuthWrapper(${getDisplayName(WrappedComponent)})`;

    // const mapStateToProps = (state) => ({
    //     //authData:state.user.empAuthData.btnRights,
    // });

    //return connect()(UserAuthWrapper);
    return UserAuthWrapper
}
export default isAuthenticated
