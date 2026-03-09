import { Neuron, NeuronField, NeuronState, NeuronType } from './Neuron';
import { fillSynapse, Synapse, SynapseField, SynapseState } from './Synapse';

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
      0, // coord X
      0, // coord Y
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

export function freeSynapsePool(synapsePool: ISynapsePool) {
  const { synapses } = synapsePool;

  synapsePool.count = 0;

  for (let i = 0; i < synapses.length; i++) {
    synapses[i][SynapseField.STATE] = SynapseState.FREE;
  }
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

export function distributeNeurons2d(neurons: Neuron[], neuronRadius: number) {
  const count = neurons.length;
  const cell = neuronRadius * 5; // 2R (diameter) + 3R (gap) = 5R

  // find the size of the grid n x n, so that n^2 >= count
  const n = Math.ceil(Math.sqrt(count));

  const halfSpan = ((n - 1) * cell) / 2; // to center the grid in (0,0)

  const positions: { x: number; y: number }[] = [];

  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      if (positions.length >= count) break;
      const x = -halfSpan + ix * cell;
      const y = -halfSpan + iy * cell;
      positions.push({ x, y });
    }
  }

  // shuffle the positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (let i = 0; i < count; i++) {
    neurons[i][NeuronField.COORD_X] = positions[i].x;
    neurons[i][NeuronField.COORD_Y] = positions[i].y;
  }

  const poolRadius = Math.sqrt(halfSpan * halfSpan + halfSpan * halfSpan) + neuronRadius;

  console.log('poolRadius', poolRadius);
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

export interface IInitializeLog {
  /**
   * default is true
   */
  disable?: boolean;
  /**
   * Log every N neurons, default is 100
   */
  everyN?: number;
}

export function initializeNeuronsConnection2d(
  neurons: Neuron[],
  count: number,
  synapsesPools: ISynapsePool[],
  connectionConfig: IConnectionConfig,
  connectionRangeProfile: IConnectionRangeProfile,
  log: IInitializeLog = { disable: true },
) {
  const { nearestCount, middleCount, farthestCount } = connectionConfig;

  const { nearestRange, middleRange, farthestRange } = connectionRangeProfile;

  const nearestRangeSq = nearestRange * nearestRange;
  const middleRangeSq = middleRange * middleRange;
  const farthestRangeSq = farthestRange * farthestRange;

  const { disable, everyN } = log;

  const countToLog = everyN ?? 100;
  let neuronReadyCount = 0;

  for (let i = 0; i < count; i++) {
    const pre = neurons[i];
    const synapsePool = synapsesPools[i];

    const allocSynapse = (): Synapse => {
      if (synapsePool.count >= synapsePool.capacity) {
        throw new Error('Not enough synapses in synapsePool');
      }
      return synapsePool.synapses[synapsePool.count++];
    };

    // Collect all candidates (except self)
    const candidates: { index: number; distSq: number }[] = [];

    for (let j = 0; j < count; j++) {
      if (j === i) continue;

      const post = neurons[j];
      const dx = post[NeuronField.COORD_X] - pre[NeuronField.COORD_X];
      const dy = post[NeuronField.COORD_Y] - pre[NeuronField.COORD_Y];
      const distSq = dx * dx + dy * dy;

      candidates.push({ index: j, distSq });
    }

    // Sort by distance
    candidates.sort((a, b) => a.distSq - b.distSq);

    const chosen = new Set<number>();

    const pickInRange = (minSq: number, maxSq: number, need: number) => {
      if (need <= 0) return;

      for (let k = 0; k < candidates.length && need > 0; k++) {
        const { index, distSq } = candidates[k];

        if (distSq < minSq) continue;
        if (distSq > maxSq) break;
        if (chosen.has(index)) continue;

        chosen.add(index);

        const post = neurons[index];
        const syn = allocSynapse();

        fillSynapse(syn, {
          preNeuronId: pre[NeuronField.ID],
          postNeuronId: post[NeuronField.ID],
          weight: 0.5,
          maxWeight: 1,
          vesicles: 10,
          relaxationRate: 0.01,
          maxVesicles: 20,
        });

        need--;
      }
    };

    // nearest: [0, nearestRange]
    if (nearestRange > 0) {
      pickInRange(0, nearestRangeSq, nearestCount);
    }

    // middle: (nearestRange, middleRange]
    if (middleRange > nearestRange) {
      pickInRange(nearestRangeSq, middleRangeSq, middleCount);
    }

    // farthest: (middleRange, farthestRange]
    if (farthestRange > middleRange) {
      pickInRange(middleRangeSq, farthestRangeSq, farthestCount);
    }

    neuronReadyCount++;

    if (!disable && neuronReadyCount % countToLog === 0) {
      console.log('Neuron ready:', neuronReadyCount, 'of', count);
    }
  }
}
