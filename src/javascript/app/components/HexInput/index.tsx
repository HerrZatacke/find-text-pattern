import React from 'react';
import { clsx } from 'clsx';
import usePatternStore from '../../stores/patternStore';
import useRomStore from '../../stores/romStore';
import './index.scss';

function HexInput() {
  const { setHex, inputHexError, hex, cleanHex, findInRom, length } = usePatternStore((state) => ({
    setHex: state.setHex,
    inputHexError: state.inputHexError,
    hex: state.hex,
    cleanHex: state.cleanHex,
    findInRom: state.findInRom,
    length: state.rawPattern.length,
  }));

  const romSize = useRomStore((store) => (store.romSize));

  return (
    <div className="hex-input grid__container">
      <label
        className={clsx(
          'grid__col',
          'grid__col--12',
          {
            'hex-input--has-error': inputHexError,
          },
        )}
        htmlFor="hexInput"
      >
        <span className="hex-input__label">
          { `Hex Text: (${length})` }
        </span>
        <div className="hex-input__group">
          <textarea
            id="hexInput"
            className="hex-input__input grid__col--12"
            value={hex}
            onBlur={cleanHex}
            onChange={({ target }) => setHex(target.value)}
          />
          <button
            type="button"
            className="hex-input__search"
            onClick={findInRom}
            disabled={!!inputHexError || !romSize || !length}
          >
            Search
          </button>
        </div>
      </label>
      { inputHexError && <p className="hex-input__error grid__col grid__col--12">{inputHexError}</p> }
    </div>
  );
}

export default HexInput;
