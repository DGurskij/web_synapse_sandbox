import { Shape2dConfig } from 'src/shape/Shape2dFactory';
import { IPoint2d } from '../math';

/**
 * Structures with descriptions ot the organism fields and how it works
 */

/**
 * Body configuration
 */

export interface IBodyConfig {
  position: IPoint2d;
  /**
   * Mass of the body
   */
  mass: number;
  /**
   * Shape of the body
   */
  shapeCfg: Shape2dConfig;
  /**
   * Color of the body
   */
  color: string;
}

/**
 * Muscle configuration
 */
export interface IMuscleConfig {
  /**
   * Strength of the muscle (force per unit contraction)
   */
  strength?: number;
  /**
   * Endurance of the muscle
   */
  endurance?: number;
  /**
   * Max endurance of the muscle
   */
  maxEndurance?: number;
  /**
   * Restore rate of the endurance per tick
   */
  enduranceRestoreKf?: number;
  /**
   * Direction of the force vector
   */
  direction?: IPoint2d;
}

/**
 * Limb configuration
 */
export interface ILimbConfig {
  /**
   * Attachment point relative to parent: body center if parent is body,
   * parent limb's pivot (in parent's local coords) if parent is a limb
   */
  parentAttachmentPoint: IPoint2d;
  /**
   * Small offset from attachment for drawing (centers shape). Default: 0, 0
   */
  selfAttachmentPoint?: IPoint2d;
  /**
   * Mass of the limb
   */
  mass: number;
  /**
   * Rotate limb relative attachment point
   */
  initialAngle?: number;
  /**
   * Max rotation angle in radians (symmetric: ±maxAngle from base direction)
   */
  maxAngleDispersion?: [number, number];

  /**
   * Muscles of the limb
   */
  muscles?: IMuscleConfig[];

  /**
   * Shape of the limb, default is rectangle with width = size and height = size / 2
   */
  shapeCfg: Shape2dConfig;

  /**
   * Color of the limb
   */
  color: string;

  childLimbs?: ILimbConfig[];
}

export interface INeuronConfig {
  v: number;
  thresh: number;
  refractoryPeriod: number;
  outAmplitude: number;
}

export interface IConnectionConfig {
  nearestCount: number;
  middleCount: number;
  farthestCount: number;
}

export interface IConnectionRangeProfile {
  nearestRange: number;
  middleRange: number;
  farthestRange: number;
}

export interface IBrainConfig {
  neuronCapacity: number;
  neuronMaxOutgoingSynapses: number;
  spikeStrongerThreshold: number;

  motorNeuronCount: number;
  sensorNeuronCount: number;
  interneuronCount: number;

  motorNeuronConfig: INeuronConfig;
  sensorNeuronConfig: INeuronConfig;
  interneuronConfig: INeuronConfig;

  connectionConfig: IConnectionConfig;
  connectionRangeProfile: IConnectionRangeProfile;
}

/**
 * Organism configuration
 */
export interface IOrganismConfig {
  /**
   * Body of the organism
   */
  body: IBodyConfig;
  /**
   * Limbs of the organism
   */
  limbs?: ILimbConfig[];
  /**
   * Brain of the organism
   */
  brain: IBrainConfig;
}
