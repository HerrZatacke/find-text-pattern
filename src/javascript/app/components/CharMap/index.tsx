import React from 'react';
import Char from '../Char';
import usePatternStore from '../../stores/patternStore';
import useSettingsStore from '../../stores/settingsStore';

import './index.scss';

function CharMap() {
  const codes = [...Array(256).keys()];
  const appendText = usePatternStore((state) => (state.appendText));
  const visible = useSettingsStore((state) => (state.charMapVisible));

  if (!visible) {
    return null;
  }

  return (
    <div className="charmap grid__container">
      <div className="charmap__list grid__col grid__col--12">
        {codes.map((code) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Char key={code} code={code} appendText={appendText} />
        ))}
      </div>
    </div>
  );
}

export default CharMap;
