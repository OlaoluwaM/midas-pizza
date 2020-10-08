import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { NavLink } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { SectionContainer } from './ErrorPages';
import { ReactComponent as ErrorSVG } from '../assets/error.svg';

const ErrorPageContainer = styled(SectionContainer)`
  justify-content: space-around;

  svg {
    scale: 0.7;
  }

  .error-message {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      padding-left: 2em;
      font-size: 2em;
      line-height: 1.5;
    }
  }
`;

function ErrorPage({ errorInfo }) {
  console.log(errorInfo);

  return (
    <ErrorPageContainer>
      <motion.div className="error-message">
        <h1>Something went wrong.....Try again later</h1>
        <button>
          <NavLink to="/">Home</NavLink>
        </button>
      </motion.div>
      <ErrorSVG />
    </ErrorPageContainer>
  );
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    // You can also log error messages to an error reporting service here
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error(errorInfo);
  }

  componentWillUnmount() {
    this.setState({
      error: false,
      errorInfo: null,
    });
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <ErrorPage errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}
