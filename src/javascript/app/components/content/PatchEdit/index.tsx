import React, { useEffect, useMemo, useState } from 'react';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { usePatch } from '../../../hooks/usePatch';
import { hexPad } from '../../../../tools/hexPad';
import { useDataContext } from '../../../hooks/useDataContext';
import { findCharByCode } from '../../../../tools/findChar';
import { intlSplit } from '../../../../tools/intlSplit';
import { stringToNumeric } from '../../../../tools/stringToNumeric';
import { MapCharTask } from '../../../../../types/MapChar';

interface ReplacementInfo {
  replacedText: string,
  terminator: boolean,
  newTextValid: boolean,
}

const getErrorText = (newTextValid: boolean, terminatorOk: boolean): string => {
  if (!newTextValid) {
    return 'Your text contains invalid characters';
  }

  if (!terminatorOk) {
    return 'Your text would replace a string terminator';
  }

  return '';
};

function PatchEdit() {
  const {
    editLocation,
    setEditLocation,
    editChar,
    addPatchText,
  } = usePatch();

  const { romContentArray } = useDataContext();

  const [newText, setNewText] = useState<string>(editChar?.value || '');
  const [allowReplaceTerm, setAllowReplaceTerm] = useState<boolean>(false);

  useEffect(() => {
    setAllowReplaceTerm(false);
    setNewText(editChar?.value || '');
  }, [editChar]);

  const { replacedText, terminator, newTextValid } = useMemo<ReplacementInfo>(() => {
    let testNewTextValid: boolean;
    try {
      stringToNumeric(newText);
      testNewTextValid = true;
    } catch (error) {
      testNewTextValid = false;
    }

    const info: ReplacementInfo = {
      replacedText: '',
      terminator: false,
      newTextValid: testNewTextValid,
    };

    if (editLocation === null) {
      return info;
    }

    const chars = [...romContentArray.subarray(editLocation, editLocation + intlSplit(newText).length)];

    return chars.reduce((acc: ReplacementInfo, code: number): ReplacementInfo => {
      const mapChar = findCharByCode(code);

      return {
        replacedText: `${acc.replacedText}${mapChar?.value || ''}`,
        terminator: acc.terminator || mapChar?.special === MapCharTask.STRING_TERM,
        newTextValid: acc.newTextValid,
      };
    }, info);

  }, [editLocation, newText, romContentArray]);

  const terminatorOk = (!terminator || allowReplaceTerm);
  const errorText = getErrorText(newTextValid, terminatorOk);

  const handleCancel = () => {
    setEditLocation(null);
  };

  const handleApply = () => {
    addPatchText(newText);
  };

  const canApply = newText.length > 0 && terminatorOk;

  return (
    <Dialog
      open={editLocation !== null}
      onClose={handleCancel}
    >
      <DialogTitle>{`Editing location ${editLocation !== null ? hexPad(editLocation, 6) : ''}`}</DialogTitle>
      <DialogContent>
        <Stack direction="column" useFlexGap spacing={4}>
          <DialogContentText>
            Your new text will replace a part of the ROM at the specified location.
          </DialogContentText>
          <TextField
            disabled
            multiline
            label="Original text"
            variant="outlined"
            size="small"
            fullWidth
            value={replacedText}
          />
          <TextField
            id="patchText"
            label="Replacement text"
            value={newText}
            onChange={({ target }) => setNewText(target.value)}
            variant="outlined"
            size="small"
            fullWidth
            error={!!errorText}
            helperText={errorText}
            autoFocus
            InputProps={{
              onFocus: ({ target }) => target.select(),
            }}
          />
          <FormControlLabel
            label="Allow replacing string terminators"
            control={(
              <Switch
                checked={allowReplaceTerm}
                onChange={(_, checked) => setAllowReplaceTerm(checked)}
                size="medium"
                color="error"
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleApply} disabled={!canApply}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PatchEdit;
