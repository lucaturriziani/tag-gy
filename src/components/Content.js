import React from 'react';
import { highlightSelection } from '../utils';
import styled from 'styled-components';

const Outer = styled.div`
  width: 100%;
  height: 100%;
  //border: 1px solid black;
`;

const Inner = styled.div`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
`;

//Deve essere su una riga altrimenti va in errore lo spit tra una riga e l'altra
const text = `Reference docs and spreadsheets seemingly make the world go ’round, but what if employees could just close those tabs for good without losing that knowledge? One startup is taking on that complicated challenge. Predictably, the solution is quite complicated, as well, from a tech perspective, involving an AI solution that analyzes everything on your PC screen — all the time — and highlights text onscreen for which you could use a little bit more context. The team at Polarity wants its tech to help teams lower the knowledge barrier to getting stuff done and allow people to focus more on procedure and strategy than memorizing file numbers, IP addresses and jargon. The Connecticut startup just closed an $8.1 million “AA” round led by TechOperators, with Shasta Ventures, Strategic Cyber Ventures, Gula Tech Adventures and Kaiser Permanente Ventures also participating in the round. The startup closed its $3.5 million Series A in early 2017.`;


function Content({ setSelected }) {
  const onMouseUp = () => {
    const s = window.getSelection().toString();

    if (s === '') {
      return;
    }
    let stringSelected = highlightSelection();
    if(stringSelected){
      setSelected(stringSelected);
    }
  };

  const divideText = (text) => {
    const splitted = String(text).split(" ");
    return splitted;
  }

  return (
    <Outer className='c0003' onMouseUp={onMouseUp}>
      <Inner>
        {divideText(text).map( (item, index) => {
          return <span className='c0002' id={index} key={index}>{item}</span>
        })}
      </Inner>
    </Outer>
  );
}

export { Content };
