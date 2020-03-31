import React from 'react'
import Typist from 'react-typist'

function TextBubble (props) {
  return (
    <div>
      <Typist cursor={{ show: false }}>
        {props.text}
      </Typist>
    </div>
  )
}

export default TextBubble
