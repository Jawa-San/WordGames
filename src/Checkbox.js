import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <label className="container">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <div className="checkmark" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Hide the default checkbox */
  .container input {
   position: absolute;
   opacity: 0;
   cursor: pointer;
   height: 0;
   width: 0;
  }

  .container {
   display: block;
   position: relative;
   cursor: pointer;
   font-size: 25px;
   user-select: none;
  }

  /* Create a custom checkbox */
  .checkmark {
   position: relative;
   top: 0;
   left: 0;
   height: 1.3em;
   width: 1.3em;
   background: black;
   border-radius: 50px;
   transition: all 0.7s;
   --spread: 20px;
  }

  /* When the checkbox is checked, add a blue background */
  .container input:checked ~ .checkmark {
  background: black;
  box-shadow: -10px -10px var(--spread) 0px #d87bf0, 0 -10px var(--spread) 0px #83f3ec, 10px -10px var(--spread) 0px #83f3ec, 10px 0 var(--spread) 0px #d87bf0, 10px 10px var(--spread) 0px #83f3ec, 0 10px var(--spread) 0px #d87bf0, -10px 10px var(--spread) 0px #d87bf0;
  }
  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
   content: "";
   position: absolute;
   display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark:after {
   display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark:after {
   left: 0.55em;
   top: 0.35em;
   width: 0.25em;
   height: 0.5em;
   border: solid #f0f0f0;
   border-width: 0 0.15em 0.15em 0;
   transform: rotate(45deg);
  }
`;

export default Checkbox;
