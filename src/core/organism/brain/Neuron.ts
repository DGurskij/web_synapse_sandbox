/**
 * Neuron is a tuple of:
 *
 *  0) unique neuron ID
 *
 *  1) state
 *
 *  2) type
 *
 *  3) membranePotential
 *
 *  4) activationThreshold
 *
 *  5) lastSpikeTime
 *
 *  6) refractoryPeriod
 *
 *  7) outAmplitude
 */
export type Neuron = [number, number, number, number, number, number, number, number];

/***
 * Neuron physical exist state
 */
export const enum NeuronState {
  FREE = 0,
  EXIST = 1,
  PRUNED = 2,
}

export const enum NeuronType {
  INTERNEURON = 0,
  SENSOR = 1,
  MOTOR = 2,
}

export const NEURON_TYPE_TO_STRING = {
  [NeuronType.INTERNEURON]: 'interneuron',
  [NeuronType.SENSOR]: 'sensor',
  [NeuronType.MOTOR]: 'motor',
};

/**
 * Neuron fields
 */
export const enum NeuronField {
  /**
   * Unique neuron ID, no changes during Brain life
   */
  ID = 0,
  /**
   * State, 0 - free, 1 - exist, 2 - pruned (deleted)
   */
  STATE = 1,
  /**
   * Type, 0 - interneuron, 1 - sensor, 2 - motor
   */
  TYPE = 2,
  /**
   * Membrane potential
   */
  V = 2,
  /**
   * Activation threshold
   */
  THRESH = 3,
  /**
   * Last spike time
   */
  LAST_T = 4,
  /**
   * Refractory period
   */
  REFRACTORY_PERIOD = 5,
  /**
   * Output amplitude
   */
  OUT_AMPLITUDE = 6,
}

/**
 * return true if neuron spiked, false otherwise
 */
export function stepNeuron(neuron: Neuron, input: number, timeNow: number) {
  // refractory period
  if (timeNow - neuron[NeuronField.LAST_T] < neuron[NeuronField.REFRACTORY_PERIOD]) {
    return false;
  }

  const newV = neuron[NeuronField.V] + input;

  if (newV >= neuron[NeuronField.THRESH]) {
    // spike
    neuron[NeuronField.V] = 0; // resting potential
    neuron[NeuronField.LAST_T] = timeNow;
    return true;
  } else {
    neuron[NeuronField.V] = newV;
    return false;
  }
}

export interface INeuronCreate {
  v: number;
  thresh: number;
  refractoryPeriod: number;
  outAmplitude: number;
}

export function fillNeuron(neuron: Neuron, type: NeuronType, config: INeuronCreate) {
  neuron[NeuronField.STATE] = NeuronState.EXIST;
  neuron[NeuronField.TYPE] = type;
  neuron[NeuronField.V] = config.v;
  neuron[NeuronField.THRESH] = config.thresh;
  neuron[NeuronField.LAST_T] = 0;
  neuron[NeuronField.REFRACTORY_PERIOD] = config.refractoryPeriod;
  neuron[NeuronField.OUT_AMPLITUDE] = config.outAmplitude;
}
