/**
 *
 * LoginPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import Recaptcha from 'react-recaptcha';
import _ from 'lodash';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { ENVIRONMENT, GOOGLE_RECAPTURE_KEY } from '../../config';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import {
  makeSelectErrors,
  makeSelectIsLoggingIn,
  makeSelectSuccess,
  makeSelectWarnings,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import Logo from '../../images/logo.svg';
import { requestAuthentication, defaultLoad } from './actions';
import { getErrorsForKey, isNullOrEmpty } from '../../utils/helpers';
import { makeSelectRouteLocation } from '../App/selectors';
import FormValidation from '../../components/common/FormValidation';

/* eslint-disable react/prefer-stateless-function */
export class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loginDetails: {
        password: '',
        identity: '',
        domain: '',
      },
      showReCapture: ENVIRONMENT === 'production',
      reCaptureToken: ENVIRONMENT !== 'production',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateDetails = this.validateDetails.bind(this);
    this.onCaptureChange = this.onCaptureChange.bind(this);
  }

  componentWillMount() {
    const { dispatchDefaultLoad } = this.props;
    dispatchDefaultLoad();
  }

  /**
   * check when form changes or form elements change, update state
   * @param {Object} event form object on submit
   */
  handleChange(event) {
    const { loginDetails } = this.state;
    const field = _.get(event, 'target.name', '');
    const value = _.get(event, 'target.value', '');
    _.set(loginDetails, field, value);
    this.setState({ loginDetails });
  }

  /**
   * Update capture after change
   * @param {string} value capture string value
   */
  onCaptureChange(value) {
    this.setState({ reCaptureToken: value });
  }

  /**
   * Validate that the form is valid and the fields match required validation
   * @param {Object} loginDetails -  values of form elements
   */
  validateDetails(loginDetails) {
    let isValid = true;
    const errors = {};
    const {
      usernameValidation,
      passwordValidation,
      domainValidation,
    } = messages;
    if (isNullOrEmpty(loginDetails.domain)) {
      _.set(
        errors,
        `${domainValidation.id}`,
        <FormattedMessage {...domainValidation} />,
      );
      isValid = false;
    }

    if (isNullOrEmpty(loginDetails.identity)) {
      _.set(
        errors,
        `${usernameValidation.id}`,
        <FormattedMessage {...usernameValidation} />,
      );
      isValid = false;
    }
    if (isNullOrEmpty(loginDetails.password)) {
      _.set(
        errors,
        `${passwordValidation.id}`,
        <FormattedMessage {...passwordValidation} />,
      );
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  }

  /**
   * Submit form
   * @param {Object} event form object on submit
   */
  handleSubmit(event) {
    // eslint-disable-next-line no-shadow
    const { dispatchRequestAuthentication } = this.props;
    const { loginDetails } = this.state;
    const details = _.clone(loginDetails);
    event.preventDefault();
    if (this.validateDetails(details)) {
      dispatchRequestAuthentication(details);
    }
  }

  render() {
    const { errors, showReCapture, reCaptureToken } = this.state;
    const {
      responseErrors,
      responseWarnings,
      responseSuccess,
      isLoggingIn,
    } = this.props;
    return (
      <Segment>
        <Helmet>
          <title>Login Page</title>
          <meta name="description" content="Description of Login Page" />
        </Helmet>
        <Grid
          textAlign="center"
          style={{ height: '100vh' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" textAlign="center">
              <Image src={Logo} /> <FormattedMessage {...messages.header} />
            </Header>
            <Form size="large" onSubmit={this.handleSubmit} error>
              <Segment stacked>
                <FormValidation
                  errorMessages={responseErrors}
                  successMessage={responseSuccess}
                  warningMessages={responseWarnings}
                />
                <Form.Input
                  name="domain"
                  onChange={this.handleChange}
                  fluid
                  icon="globe"
                  iconPosition="left"
                  placeholder="Domain"
                />
                <Message negative error>
                  {getErrorsForKey({
                    errors,
                    errorKey: messages.domainValidation,
                  }) || null}
                </Message>
                <Form.Input
                  name="identity"
                  onChange={this.handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                />
                <Message negative error>
                  {getErrorsForKey({
                    errors,
                    errorKey: messages.usernameValidation,
                  }) || null}
                </Message>
                <Form.Input
                  onChange={this.handleChange}
                  name="password"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Message negative error>
                  {getErrorsForKey({
                    errors,
                    errorKey: messages.passwordValidation,
                  }) || null}
                </Message>
                <Button
                  fluid
                  size="large"
                  primary
                  disabled={isLoggingIn || !reCaptureToken}
                >
                  {isLoggingIn ? (
                    <FormattedMessage {...messages.loggingIn} />
                  ) : (
                    <FormattedMessage {...messages.login} />
                  )}
                </Button>
                {showReCapture ? (
                  <Segment compact basic>
                    <Recaptcha
                      sitekey={GOOGLE_RECAPTURE_KEY}
                      render="explicit"
                      verifyCallback={this.onCaptureChange}
                    />
                  </Segment>
                ) : null}
              </Segment>
            </Form>
            <Message attached="bottom" warning>
              <Icon name="help" />
              <FormattedHTMLMessage
                {...messages.signUpQuestion}
                values={{
                  signUpLink: '#',
                }}
              />
            </Message>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

LoginPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  dispatchRequestAuthentication: PropTypes.func,
  dispatchDefaultLoad: PropTypes.func,
  isLoggingIn: PropTypes.bool,
  responseErrors: PropTypes.any,
  responseWarnings: PropTypes.any,
  responseSuccess: PropTypes.any,
  history: PropTypes.object,
  currentRoute: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  isLoggingIn: makeSelectIsLoggingIn(),
  currentRoute: makeSelectRouteLocation(),
  responseErrors: makeSelectErrors(),
  responseSuccess: makeSelectSuccess(),
  responseWarnings: makeSelectWarnings(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    dispatchDefaultLoad: () => dispatch(defaultLoad()),
    dispatchRequestAuthentication: (data) =>
      dispatch(requestAuthentication({ dispatch, data })),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'loginPage', reducer });
const withSaga = injectSaga({ key: 'loginPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LoginPage);
