import { ShapeConfig } from 'src/model/ShapeFactory';
import { IPoint } from '../math';

/**
 * Structures with descriptions ot the organism fields and how it works
 */

/**
 * Body configuration
 */

export interface IBodyConfig {
  /**
   * default is circle with radius = size / 2
   */
  shapeCfg?: ShapeConfig;
  /**
   * Mass of the body
   */
  mass?: number;
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
  direction?: IPoint;
}

/**
 * Limb configuration
 */
export interface ILimbConfig {
  /**
   * Parent: -1 or undefined = body, 0..n = index of parent limb
   */
  parentIndex?: number;
  /**
   * Attachment point relative to parent: body center if parent is body,
   * parent limb's pivot (in parent's local coords) if parent is a limb
   */
  attachmentPoint?: IPoint;
  /**
   * Small offset from attachment for drawing (centers shape). Default: from shape.
   */
  offset?: IPoint;
  /**
   * Mass of the limb
   */
  mass?: number;
  /**
   * Rotate limb relative attachment point
   */
  attachmentAngle?: number;
  /**
   * Max rotation angle in radians (symmetric: ±maxAngle from base direction)
   */
  maxAngleDispersion?: [number, number];

  /**
   * Muscles of the limb
   */
  muscles?: readonly IMuscleConfig[];

  /**
   * Shape of the limb, default is rectangle with width = size and height = size / 2
   */
  shapeCfg?: ShapeConfig;
}

/**
 * Organism configuration
 */
export interface IOrganismConfig {
  position?: IPoint;

  /**
   * Body of the organism
   */
  body?: IBodyConfig;
  /**
   * Limbs of the organism
   */
  limbs?: readonly ILimbConfig[];
}
