import React from "react";

type progressBarProps = {
  bgcolor: string;
  completed: number;
}

const ProgressBar = (props: progressBarProps) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 20,
    width: 360,
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed * 3.33}%`,
    backgroundColor: bgcolor,
    transition: 'width 1s ease-in-out',
    borderRadius: 'inherit',
    textAlign: 'right' as const
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold' as const
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${30 - completed} 초`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;