import React from 'react';

function Square(props) {
    return (
        <button 
            className={props.highlighted ? "square highlighted" : "square"}
            onClick={props.onClick}
        >
          { props.value }
        </button>
    );
}

export default Square;