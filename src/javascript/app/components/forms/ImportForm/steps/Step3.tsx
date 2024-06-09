import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import type { UseFormReturn } from 'react-hook-form';
import type { ImportFormData } from '../types';
import useImportStore from '../../../../stores/importStore';
import useTileMapsStore from '../../../../stores/tileMapsStore';

interface Props {
  form: UseFormReturn<ImportFormData>
  cancel: () => void,
}

function Step3({ form, cancel }: Props) {
  const { addTileMap } = useTileMapsStore();
  const { fileName } = useImportStore();
  const navigateTo = useNavigate();

  const {
    getValues,
    formState: { errors },
  } = form;

  const createTileMap = () => {
    const {
      vramOffset: vramOffsetFieldVBalue,
      tileMapOffset: tileMapOffsetFieldValue,
    } = getValues();

    const vramOffset = vramOffsetFieldVBalue === '' || !!errors.vramOffset ? null : parseInt(vramOffsetFieldVBalue, 16);
    const tileMapOffset = tileMapOffsetFieldValue === '' || !!errors.tileMapOffset ? null : parseInt(tileMapOffsetFieldValue, 16);

    if (vramOffset == null || tileMapOffset == null) {
      return;
    }

    const internalMapping = Array(32 * 32)
      .fill('')
      .map((_, index: number) => (
        tileMapOffset + index
      ));

    addTileMap({
      title: fileName || '',
      internalMapping,
      vramOffset,
      width: 32,
      height: 32,
    });

    cancel();

    navigateTo('/tilemaps');
  };

  return (
    <Button
      size="large"
      fullWidth
      variant="contained"
      onClick={createTileMap}
    >
      Create Tilemap
    </Button>
  );
}

export default Step3;
