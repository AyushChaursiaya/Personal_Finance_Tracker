import React, { useState } from 'react';
import "./styles.css";

function Input({ label, state, setState, placeholder, type}) {

  return (
    <div className='input-wrapper'>
      <p className='label-input'>{label}</p>
      <input
        type={type}
        value={state}
        className='custom-input'
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  )
}

export default Input;
