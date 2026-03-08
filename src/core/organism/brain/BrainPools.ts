import { Neuron, NeuronState, NeuronType } from './Neuron';
import { Synapse, SynapseState } from './Synapse';

export function createNeuronPool(capacity: number) {
  let id = 1;
  return Array.from(
    { length: capacity },
    (): Neuron => [
      id++, // unique neuron ID
      NeuronState.FREE, // state
      NeuronType.INTERNEURON, // type
      0, // membrane potential
      0, // activation threshold
      0, // last spike time
      0, // refractory period
      0, // output amplitude
    ],
  );
}

export interface ISynapsePool {
  count: number;
  capacity: number;
  synapses: Synapse[];
}

export function createSynapsePool(capacity: number) {
  return Array.from(
    { length: capacity },
    (): Synapse => [
      SynapseState.FREE, // state
      0, // pre synaptic neuron index
      0, // post synaptic neuron index
      0, // weight
      1, // max weight
      0, // vesicles
      0, // relaxation rate
      0, // max vesicles
      0, // count bad ('usless') cycles
    ],
  );
}

/**
 * Prepare neuron synapse pool for given capacity
 */
export function createNeuronSynapsePool(neuronCount: number, maxOutgoingSynapses: number) {
  return Array.from(
    { length: neuronCount },
    (): ISynapsePool => ({
      count: 0,
      capacity: maxOutgoingSynapses,
      synapses: createSynapsePool(maxOutgoingSynapses),
    }),
  );
}
