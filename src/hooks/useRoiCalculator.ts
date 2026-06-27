import { useState, useMemo } from 'react';
import { RoiInput, RoiOutput } from '../types';
import { calculateRoi } from '../utils/mathHelpers';

const defaultInput: RoiInput = {
  trucks: 150000,
  dailyKm: 120,
  dieselPrice: 95,
  subsidyPct: 0.30,
  materialType: 'hdpe'
};

export function useRoiCalculator() {
  const [inputs, setInputs] = useState<RoiInput>(defaultInput);

  const outputs = useMemo<RoiOutput>(() => {
    return calculateRoi(inputs);
  }, [inputs]);

  const updateInput = <K extends keyof RoiInput>(key: K, value: RoiInput[K]) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    inputs,
    outputs,
    updateInput
  };
}
export default useRoiCalculator;
