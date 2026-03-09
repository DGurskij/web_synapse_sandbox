import { clamp } from 'src/core/math';
import { Neuron, NeuronField } from './Neuron';

/**
 * Synapse is a tuple of:
 *
 *  0) state
 *
 *  1) preSynapticNeuron
 *
 *  2) postSynapticNeuron
 *
 *  3) weight
 *
 *  4) max weight
 *
 *  5) vesicles (resource)
 *
 *  6) relaxation rate
 *
 *  7) max vesicles
 *
 *  8) count bad ('usless') cycles
 */
export type Synapse = [number, number, number, number, number, number, number, number, number];

/***
 * Synapse physical exist state
 */
export const enum SynapseState {
  FREE = 0,
  EXIST = 1,
  PRUNED = 2,
}

/**
 * Neuron fields
 */
export const enum SynapseField {
  /**
   * State, 0 - free, 1 - exist, 2 - pruned (deleted)
   */
  STATE = 0,
  /**
   * Pre synaptic neuron id
   */
  PRE_SYNAPTIC_NEURON = 1,
  /**
   * Post synaptic neuron id
   */
  POST_SYNAPTIC_NEURON = 2,
  /**
   * Weight
   */
  WEIGHT = 3,
  /**
   * Max weight
   */
  MAX_WEIGHT = 4,
  /**
   * Vesicles (resource)
   */
  VESICLES = 5,
  /**
   * Relaxation rate
   */
  RELAXATION_RATE = 6,
  /**
   * Max vesicles
   */
  MAX_VESICLES = 7,
  /**
   * Count bad ('usless') cycles
   */
  COUNT_BAD_CYCLES = 8,
}

export function hebbianUpdate(synapse: Synapse, preNeuron: Neuron, postNeuron: Neuron, spikeStrongerThreshold: number = 5) {
  const dtPrePost = postNeuron[NeuronField.LAST_T] - preNeuron[NeuronField.LAST_T];

  let w = synapse[SynapseField.WEIGHT];

  // Amplification, if post neuron spiked shortly after pre neuron
  if (dtPrePost > 0 && dtPrePost < spikeStrongerThreshold) {
    // "5" - matching window
    w += 0.001;
  } else {
    // Weakening, if the connection does not lead to the post neuron spiking "on time"
    w -= 0.001;
  }

  synapse[SynapseField.VESICLES] = Math.max(synapse[SynapseField.VESICLES] - 0.1, 0);
  synapse[SynapseField.WEIGHT] = clamp(w, 0, synapse[SynapseField.MAX_WEIGHT]);
}

export function relaxSynapse(synapse: Synapse) {
  synapse[SynapseField.VESICLES] = Math.min(
    synapse[SynapseField.VESICLES] + synapse[SynapseField.RELAXATION_RATE],
    synapse[SynapseField.MAX_VESICLES],
  );
}

export function maintainSynapse(synapse: Synapse) {
  const isBad = synapse[SynapseField.VESICLES] < 0.01 && synapse[SynapseField.WEIGHT] < 0.01;

  if (isBad) {
    synapse[SynapseField.COUNT_BAD_CYCLES]++;
  } else {
    synapse[SynapseField.COUNT_BAD_CYCLES] = 0;
  }

  if (synapse[SynapseField.COUNT_BAD_CYCLES] > 1000) {
    console.log('pruning synapse', synapse[SynapseField.PRE_SYNAPTIC_NEURON], synapse[SynapseField.POST_SYNAPTIC_NEURON]);
    synapse[SynapseField.STATE] = SynapseState.PRUNED; // prune synapse
  }
}

export interface ISynapseCreate {
  preNeuronId: number;
  postNeuronId: number;
  weight: number;
  maxWeight: number;
  vesicles: number;
  relaxationRate: number;
  maxVesicles: number;
}

export function fillSynapse(synapse: Synapse, config: ISynapseCreate) {
  synapse[SynapseField.STATE] = SynapseState.EXIST;
  synapse[SynapseField.PRE_SYNAPTIC_NEURON] = config.preNeuronId;
  synapse[SynapseField.POST_SYNAPTIC_NEURON] = config.postNeuronId;
  synapse[SynapseField.WEIGHT] = config.weight;
  synapse[SynapseField.MAX_WEIGHT] = config.maxWeight;
  synapse[SynapseField.VESICLES] = config.vesicles;
  synapse[SynapseField.RELAXATION_RATE] = config.relaxationRate;
  synapse[SynapseField.MAX_VESICLES] = config.maxVesicles;
  synapse[SynapseField.COUNT_BAD_CYCLES] = 0;
}
