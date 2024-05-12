import React from 'react';
import { clsx } from 'clsx';
import usePatternStore from '../../stores/patternStore';
import useRomStore from '../../stores/romStore';
import './index.scss';

function TextInput() {
  const { setText, inputTextError, text, length, findInRom } = usePatternStore((state) => ({
    setText: state.setText,
    inputTextError: state.inputTextError,
    text: state.text,
    findInRom: state.findInRom,
    length: state.rawPattern.length,
  }));

  const romSize = useRomStore((store) => (store.romSize));

  return (
    <div className="text-input grid__container">
      <label
        className={clsx(
          'grid__col',
          'grid__col--12',
          {
            'text-input--has-error': inputTextError,
          },
        )}
        htmlFor="textInput"
      >
        <span className="text-input__label">Text:</span>
        <div className="text-input__group">
          <input
            id="textInput"
            className="text-input__input"
            type="text"
            value={text}
            onChange={({ target }) => setText(target.value)}
          />
          <button
            type="button"
            className="text-input__search"
            onClick={findInRom}
            disabled={!!inputTextError || !romSize || !length}
          >
            Search
          </button>
        </div>
      </label>
      { inputTextError && <p className="text-input__error grid__col grid__col--12">{inputTextError}</p> }
    </div>
  );
}

export default TextInput;
