import React from 'react';
import Char from '../../content/Char';
import usePatternStore from '../../../stores/patternStore';

import './index.scss';
import SearchBlock from '../../content/SearchBlock';

function CharMap() {
  const codes = [...Array(256).keys()];
  const { appendText } = usePatternStore();

  return (
    <>
      <SearchBlock />
      <div className="charmap grid__container">
        <div className="grid__col grid__col--12">
          <div className="charmap__list">
            {codes.map((code) => (
              <Char key={code} code={code} appendText={appendText} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CharMap;
