/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DoubleArrow from '@mui/icons-material/DoubleArrow';
import TilesDisplay from '../../../content/TilesDisplay';
import useImportStore from '../../../../stores/importStore';
import { useDataContext } from '../../../../hooks/useDataContext';
import { toTiles } from '../../../../../tools/toTiles';
import { VRAM_SIZE } from '../../../../../../constants/ram';
import type { FuzzySearchResult } from '../../../../../workers/fuzzySearch.worker';
import type { ImportFormData, VRAMButton } from '../types';
import { hexPad } from '../../../../../tools/hexPad';


interface Props {
  vramOffsetField: UseFormRegisterReturn<'vramOffset'>
  busy: boolean,
  findClosest: (term: Uint8Array) => Promise<FuzzySearchResult>,
  form: UseFormReturn<ImportFormData>
}

function Step1({
  vramOffsetField,
  busy,
  findClosest,
  form,
}: Props) {
  const { vramContent, fileName } = useImportStore();
  const { romContentArray } = useDataContext();
  const [customStartPadding, setCustomStartPadding] = useState<number>(0x0800);
  const [customSize, setCustomSize] = useState<number>(0x0100);

  const vramButtons = useMemo<VRAMButton[]>(() => {
    if (vramContent?.length !== 0x1800) {
      return [];
    }

    return [
      { pad: customStartPadding, size: customSize },
      { pad: 0x0000, size: 0x0800 },
      { pad: 0x0800, size: 0x0800 },
      { pad: 0x1000, size: 0x0800 },
    ]
      .map(({ pad, size }): VRAMButton => {
        const addr = pad + 0x8000;
        const title = `${hexPad(addr, 4)} - ${hexPad(addr + size - 1, 4)}`;
        const data = vramContent.subarray(pad, pad + size);

        return {
          title,
          vramPadding: pad,
          data,
          tiles: toTiles(data),
        };
      });
  }, [customStartPadding, customSize, vramContent]);

  const {
    setValue,
    watch,
    formState: {
      errors,
    },
  } = form;

  const vramOffsetFieldValue = watch('vramOffset');
  const vramOffset = vramOffsetFieldValue === '' || !!errors.vramOffset ? null : parseInt(vramOffsetFieldValue, 16);

  const romContentVRAMTiles = useMemo<string[]>(() => {
    if (vramOffset !== null) {
      const romContentVRAMContent = romContentArray.slice(vramOffset, vramOffset + VRAM_SIZE);
      return toTiles(new Uint8Array(romContentVRAMContent));
    }

    return [];
  }, [romContentArray, vramOffset]);

  return (
    <Stack direction="column" useFlexGap spacing={2}>
      <DialogContentText>
        { `Select which part of the snapshot VRAM from "${fileName}" should be matched against currently loaded ROM?` }
      </DialogContentText>
      <Stack direction="row" useFlexGap spacing={4} justifyContent="center" alignItems="center">
        <Stack direction="column" useFlexGap spacing={2}>
          <Slider
            min={0x0000}
            max={0x1700}
            step={0x0100}
            value={customStartPadding}
            onChange={(_, value) => setCustomStartPadding(value as number)}
          />
          <Slider
            min={0x0000}
            max={0x0400}
            step={0x0010}
            value={customSize}
            onChange={(_, value) => setCustomSize(value as number)}
          />
          <ButtonGroup orientation="vertical">
            {
              vramButtons.map(({ tiles, title, data, vramPadding }, index) => (
                <Button
                  key={index}
                  size="large"
                  disabled={busy}
                  onClick={async () => {
                    setValue('vramOffset', '', { shouldTouch: true, shouldValidate: true });
                    const { pos } = await findClosest(data);
                    setValue('vramOffset', (pos - vramPadding).toString(16), { shouldTouch: true, shouldValidate: true });
                    // trigger('vramOffset');
                  }}
                >
                  <Stack direction="column" useFlexGap spacing={1}>
                    <Typography variant="body2">
                      {title}
                    </Typography>
                    <TilesDisplay
                      zoom={1}
                      tiles={tiles}
                      tilesPerLine={Math.min(16, tiles.length)}
                    />
                  </Stack>
                </Button>
              ))
            }
          </ButtonGroup>
        </Stack>
        <DoubleArrow />
        {
          romContentVRAMTiles.length ? (
            <TilesDisplay
              zoom={2}
              tiles={romContentVRAMTiles}
              tilesPerLine={16}
            />
          ) : (
            <Typography
              className="import-form__vram-preview"
              variant="body2"
              align="center"
            >
              {
                busy ?
                  'Searching ROM...' :
                  'Try to find the VRAM offset by searching for one of the options to the left.'
              }
            </Typography>
          )
        }
      </Stack>
      <TextField
        {...vramOffsetField}
        margin="dense"
        label="VRAM Offset"
        fullWidth
        variant="standard"
        error={Boolean(!busy && errors.vramOffset)}
        helperText={!busy && errors.vramOffset?.message}
        InputProps={{
          startAdornment: <InputAdornment position="start">0x</InputAdornment>,
        }}
      />
    </Stack>
  );
}

export default Step1;
