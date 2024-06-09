import React, { useState } from 'react';
import type { CSSPropertiesVars } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogActions,
  LinearProgress,
  DialogTitle,
  Button,
  Stepper,
  Step,
  Stack,
  StepButton,
} from '@mui/material';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import { TILEMAP_SIZE, VRAM_SIZE } from '../../../../../constants/ram';
import useImportStore from '../../../stores/importStore';
import { validateHexDigit } from '../../../../tools/forms/validateHexDigit';
import { useDataContext } from '../../../hooks/useDataContext';
import { useFuzzySearch } from '../../../hooks/useFuzzySearch';
import type { ImportFormData } from './types';

import './index.scss';
import Step3 from './steps/Step3';

function ImportForm() {
  const { tileMap, vramContent, fileName, reset } = useImportStore();
  const { romContentArray } = useDataContext();
  const { busy, progress, findClosest } = useFuzzySearch();
  const [activeStep, setActiveStep] = useState<number>(0);
  const open = Boolean(tileMap?.length && vramContent?.length && fileName);

  const form = useForm({
    defaultValues: {
      vramOffset: '',
      tileMapOffset: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: true,
  });

  const {
    register,
    handleSubmit,
    getFieldState,
    formState: {
      isValid,
    },
  } = form;

  const vramOffsetField = register('vramOffset', {
    validate: validateHexDigit(0, romContentArray.length - VRAM_SIZE),
  });

  const tileMapOffsetField = register('tileMapOffset', {
    validate: validateHexDigit(0, romContentArray.length - TILEMAP_SIZE),
  });

  const onSubmit: SubmitHandler<ImportFormData> = (d) => {
    // eslint-disable-next-line no-console
    console.log(d);
  };

  const stepsCompleted: boolean[] = [
    (!getFieldState('vramOffset').invalid && getFieldState('vramOffset').isTouched),
    (!getFieldState('tileMapOffset').invalid && getFieldState('tileMapOffset').isTouched),
    false,
  ];

  const sliderStyles: CSSPropertiesVars = {
    '--num-items': 3,
    '--active-item': activeStep,
  };

  const cancel = () => {
    reset();
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={cancel}
    >
      <DialogTitle>Create new TileMap from BGB snapshot</DialogTitle>
      <LinearProgress
        variant="determinate"
        value={progress * 100}
      />
      <DialogContent>
        <Stack direction="column" useFlexGap spacing={2}>
          <Stepper activeStep={activeStep}>
            <Step completed={stepsCompleted[0]}>
              <StepButton
                color="inherit"
                onClick={() => setActiveStep(0)}
              >
                Find VRAM location
              </StepButton>
            </Step>
            <Step completed={stepsCompleted[1]}>
              <StepButton
                color="inherit"
                onClick={() => setActiveStep(1)}
              >
                Find TileMap location
              </StepButton>
            </Step>
            <Step completed={stepsCompleted[2]}>
              <StepButton
                color="inherit"
                onClick={() => setActiveStep(2)}
              >
                Edit TileMap
              </StepButton>
            </Step>
          </Stepper>


          <div
            className="import-form__steps-container"
            style={sliderStyles}
          >
            <ul className="import-form__steps-list">
              <li className="import-form__step">
                <Step1
                  form={form}
                  vramOffsetField={vramOffsetField}
                  findClosest={findClosest}
                  busy={busy}
                />
              </li>
              <li className="import-form__step">
                <Step2
                  form={form}
                  tileMapOffsetField={tileMapOffsetField}
                  findClosest={findClosest}
                  busy={busy}
                />
              </li>
              <li className="import-form__step">
                <Step3
                  cancel={cancel}
                  form={form}
                />
              </li>
            </ul>
          </div>


        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={cancel}>Cancel</Button>
        { activeStep < 3 ? (
          <Button
            disabled={!stepsCompleted[activeStep]}
            variant="contained"
            onClick={() => setActiveStep((current) => current + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!isValid}
            variant="contained"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ImportForm;
