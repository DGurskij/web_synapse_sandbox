import { Limb } from './Limb';
import { Muscle } from './Muscle';

export interface IMotorUnit {
  neuronId: number;
  limb: Limb;
  muscle: Muscle;
  gain: number;
}
