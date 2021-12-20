import React from 'react';
import zxcvbn from 'zxcvbn';

const Forca_password = ({ password }) => {
  const testResult = zxcvbn(password);
  const num = testResult.score * 100/4;

  const createPassLabel = () => {
    switch(testResult.score) {
      case 0:
        return 'Muito Fraca';
      case 1:
        return 'Fraca';
      case 2:
        return 'Moderada';
      case 3:
        return 'Forte';
      case 4:
        return 'Muito Forte';
      default:
        return '';
    }
  }

  const funcProgressColor = () => {
    switch(testResult.score) {
      case 0:
        return '#828282';
      case 1:
        return '#ff0000';
      case 2:
        return '#ff9900';
      case 3:
        return '#00ff00';
      case 4:
        return '#006600';
      default:
        return 'none';
    }
  }

  const changePasswordColor = () => ({
    width: `${num}%`,
    background: funcProgressColor(),
    height: '7px'
  })

  return (
    <>
      <div className="progress" style={{ height: '7px' }}>
        <div className="progress-bar" style={changePasswordColor()}></div>
      </div>
      <p style={{ color: funcProgressColor() }}>{createPassLabel()}</p>
    </>
  )
}

export default Forca_password