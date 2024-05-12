import React from 'react';
import useGridStore from '../../stores/gridStore';
import useSettingsStore from '../../stores/settingsStore';
import './index.scss';
import useRomStore from '../../stores/romStore';
import usePatternStore from '../../stores/patternStore';

export function Settings() {
  const { gridRows, gridCols, setGridRows, setGridCols } = useGridStore((state) => ({
    gridRows: state.gridRows,
    gridCols: state.gridCols,
    setGridRows: state.setGridRows,
    setGridCols: state.setGridCols,
  }));

  const { visible, setVisible, renderTextGrid, setRenderTextGrid } = useSettingsStore((state) => ({
    visible: state.charMapVisible,
    setVisible: state.setCharMapVisible,
    renderTextGrid: state.renderTextGrid,
    setRenderTextGrid: state.setRenderTextGrid,
  }));

  const {
    maxPage,
    pageSize,
    romPage,
    setFile,
    setPageSize,
    setRomPage,
    cleanRomPage,
  } = useRomStore((state) => ({
    maxPage: state.maxPage,
    pageSize: state.pageSize,
    romPage: state.romPage,
    setFile: state.setFile,
    setPageSize: state.setPageSize,
    setRomPage: state.setRomPage,
    cleanRomPage: state.cleanRomPage,
  }));

  const { found, setCurrentFound, currentFound } = usePatternStore((state) => ({
    found: state.found,
    setCurrentFound: state.setCurrentFound,
    currentFound: state.currentFound,
  }));

  return (
    <div className="grid__container settings">
      <div className="grid__col grid__col--1 settings__grid">
        <label>
          <span className="settings__label">
            Cols:
          </span>
          <input
            min={0}
            max={32}
            type="number"
            value={gridCols}
            onChange={({ target }) => setGridCols(target.value)}
          />
        </label>
      </div>
      <div className="grid__col grid__col--1 settings__grid">
        <label>
          <span className="settings__label">
            Rows:
          </span>
          <input
            min={0}
            max={4}
            type="number"
            value={gridRows}
            onChange={({ target }) => setGridRows(target.value)}
          />
        </label>
      </div>
      <div className="grid__col grid__col--1 settings__grid">
        <label>
          <span className="settings__label">
            { `P: ${(parseInt(romPage, 10) || 0)}/${maxPage}`}
          </span>
          <input
            min={0}
            max={maxPage}
            type="number"
            value={romPage}
            onBlur={cleanRomPage}
            onChange={({ target }) => setRomPage(target.value)}
          />
        </label>
      </div>
      <div className="grid__col grid__col--2 settings__grid">
        <label>
          <span className="settings__label">
            Pagesize:
          </span>
          <select
            value={pageSize}
            onChange={({ target }) => setPageSize(target.value)}
          >
            <option value={0x100}>0x100 (256b)</option>
            <option value={0x200}>0x200 (512b)</option>
            <option value={0x400}>0x400 (1kb)</option>
            <option value={0x800}>0x800 (2kb)</option>
            <option value={0x1000}>0x1000 (4kb)</option>
            <option value={0x2000}>0x2000 (8kb)</option>
            <option value={0x4000}>0x4000 (16kb)</option>
          </select>
        </label>
      </div>
      <div className="grid__col grid__col--7">
        <span className="settings__label">
          { found.length ? `Found: ${currentFound + 1}/${found.length}` : 'nothing found' }
        </span>
        <div className="settings__group">
          <button
            type="button"
            className="settings__button"
            onClick={() => setCurrentFound(currentFound - 1)}
            disabled={!found.length}
          >
            {'<<'}
          </button>
          <button
            type="button"
            className="settings__button"
            onClick={() => setCurrentFound(currentFound + 1)}
            disabled={!found.length}
          >
            {'>>'}
          </button>
          <button
            type="button"
            className="settings__button"
            onClick={() => setVisible(!visible)}
          >
            { visible ? 'Hide charmap' : 'Show charmap'}
          </button>
          <button
            type="button"
            className="settings__button"
            onClick={() => setRenderTextGrid(!renderTextGrid)}
          >
            { renderTextGrid ? 'Full grid' : 'Text grid' }
          </button>
          <label
            className="settings__file file-input"
          >
            Load file
            <input
              type="file"
              className="settings__file-input"
              onChange={({ target }) => setFile(target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
