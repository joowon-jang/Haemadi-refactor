import { memo } from 'react';
import { node, oneOf, func } from 'prop-types';

import styles from './Button.module.css';

// props type 정의
Button.propTypes = {
  children: node.isRequired,
  type: oneOf(['normal', 'angled', 'stroke']),
  state: oneOf(['default', 'primary', 'disabled']),
  onClick: func,
};

// Button Component
function Button({ children, type = 'normal', state = 'default', onClick }) {
  const classNames = `${styles[type]} ${styles[state]}`;

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={state === 'disabled'}
      aria-disabled={state === 'disabled'}
    >
      <span>{children}</span>
    </button>
  );
}

export default memo(Button);
