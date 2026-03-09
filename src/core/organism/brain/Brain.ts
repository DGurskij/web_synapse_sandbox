import {
  createNeuronPool,
  createNeuronSynapsePool,
  distributeNeurons2d,
  freeSynapsePool,
  IConnectionConfig,
  IConnectionRangeProfile,
  initializeNeuronsConnection2d,
  ISynapsePool,
} from './BrainPools';
import {
  fillNeuron,
  INeuronCreate,
  Neuron,
  NEURON_RADIUS,
  NEURON_TYPE_TO_STRING,
  NeuronField,
  NeuronState,
  NeuronType,
  stepNeuron,
} from './Neuron';
import { hebbianUpdate, maintainSynapse, relaxSynapse, SynapseField, SynapseState } from './Synapse';

export interface IBrainCreate {
  neuronCapacity: number;
  neuronMaxOutgoingSynapses: number;
  spikeStrongerThreshold: number;

  motorNeuronCount: number;
  sensorNeuronCount: number;
  interneuronCount: number;

  motorNeuronConfig: INeuronCreate;
  sensorNeuronConfig: INeuronCreate;
  interneuronConfig: INeuronCreate;

  connectionConfig: IConnectionConfig;
  connectionRangeProfile: IConnectionRangeProfile;
}

export class Brain {
  private _neuronCount: number;
  private _neuronCapacity: number;
  private _neuronMaxOutgoingSynapses: number;
  private _neurons: Neuron[];

  private _idToIndex: Map<number, number>;

  private _motorNeuronConfig: INeuronCreate;
  private _sensorNeuronConfig: INeuronCreate;
  private _interneuronConfig: INeuronCreate;

  private _connectionConfig: IConnectionConfig;
  private _connectionRangeProfile: IConnectionRangeProfile;

  private _idleNeuronsIds: Record<NeuronType, number[]>;

  private _spikesPrev: boolean[];
  private _spikesNext: boolean[];

  private _spikeStrongerThreshold: number;

  private _neuronOutgoingSynapses: ISynapsePool[]; // [neuronIndex][synapses]
  private _totalSynapseCount: number = 0;

  private _previousTime: number = 0;

  private _inputs: Float32Array;

  private _lastTickSpikedNeurons: number = 0;

  constructor(config: IBrainCreate) {
    this._neuronCount = 0;
    this._neuronCapacity = config.neuronCapacity;
    this._neuronMaxOutgoingSynapses = config.neuronMaxOutgoingSynapses;
    this._neurons = createNeuronPool(this._neuronCapacity);
    distributeNeurons2d(this._neurons, NEURON_RADIUS);

    console.log('Neurons pool created with capacity:', this._neurons.length);

    this._idToIndex = new Map<number, number>();

    this._motorNeuronConfig = config.motorNeuronConfig;
    this._sensorNeuronConfig = config.sensorNeuronConfig;
    this._interneuronConfig = config.interneuronConfig;

    this._connectionConfig = config.connectionConfig;
    this._connectionRangeProfile = config.connectionRangeProfile;

    this._spikesPrev = Array(this._neuronCapacity).fill(false);
    this._spikesNext = Array(this._neuronCapacity).fill(false);

    this._spikeStrongerThreshold = config.spikeStrongerThreshold;

    this._neuronOutgoingSynapses = createNeuronSynapsePool(this._neuronCapacity, this._neuronMaxOutgoingSynapses);

    console.log('Synapse pools created with capacity of each pool:', this._neuronOutgoingSynapses.length);

    this._previousTime = 0;
    this._inputs = new Float32Array(this._neuronCapacity);

    this._idleNeuronsIds = {
      [NeuronType.SENSOR]: [],
      [NeuronType.INTERNEURON]: [],
      [NeuronType.MOTOR]: [],
    };

    for (let i = 0; i < config.sensorNeuronCount; i++) {
      this.synthesisNeuron(NeuronType.SENSOR, this._sensorNeuronConfig);
    }

    console.log('Synthesized', config.sensorNeuronCount, 'sensor neurons');

    for (let i = 0; i < config.motorNeuronCount; i++) {
      this.synthesisNeuron(NeuronType.MOTOR, this._motorNeuronConfig);
    }

    console.log('Synthesized', config.motorNeuronCount, 'motor neurons');

    for (let i = 0; i < config.interneuronCount; i++) {
      this.synthesisNeuron(NeuronType.INTERNEURON, this._interneuronConfig);
    }

    console.log('Synthesized', config.interneuronCount, 'interneuron neurons');

    initializeNeuronsConnection2d(
      this._neurons,
      this._neuronCount,
      this._neuronOutgoingSynapses,
      this._connectionConfig,
      this._connectionRangeProfile,
      {
        everyN: 1000,
      },
    );

    console.log('Neurons connection initialized, count:', this._neuronCount);
  }

  get totalSynapseCount() {
    return this._totalSynapseCount;
  }

  useNeurons(count: number, type: NeuronType) {
    if (this._idleNeuronsIds[type].length < count) {
      throw Error(`Not enough free ${NEURON_TYPE_TO_STRING[type]} neurons`);
    }

    return this._idleNeuronsIds[type].splice(0, count);
  }

  /**
   * Allocate neuron from free neurons pool
   */
  private synthesisNeuron(type: NeuronType, cfg: INeuronCreate): number {
    if (this._neuronCount >= this._neuronCapacity) {
      throw Error('Overload, no free neurons');
    }

    const idx = this._neuronCount++;
    const neuron = this._neurons[idx];

    fillNeuron(neuron, type, cfg);

    const id = neuron[NeuronField.ID];
    this._idToIndex.set(id, idx);

    this._idleNeuronsIds[type].push(id);

    return id;
  }

  private createSynapse(preNeuronId: number, postNeuronId: number) {
    const preIndex = this._idToIndex.get(preNeuronId);

    if (preIndex === undefined) {
      return null;
    }

    const pool = this._neuronOutgoingSynapses[preIndex];

    if (pool.count >= pool.capacity) {
      throw new Error('Not enough space for synapses');
    }

    const synapse = pool.synapses[pool.count++];

    synapse[SynapseField.STATE] = SynapseState.EXIST;
    synapse[SynapseField.PRE_SYNAPTIC_NEURON] = preNeuronId;
    synapse[SynapseField.POST_SYNAPTIC_NEURON] = postNeuronId;
    synapse[SynapseField.WEIGHT] = 0;
    synapse[SynapseField.MAX_WEIGHT] = 1;
    synapse[SynapseField.VESICLES] = 100;
    synapse[SynapseField.RELAXATION_RATE] = 0.01;
    synapse[SynapseField.MAX_VESICLES] = 100;
    synapse[SynapseField.COUNT_BAD_CYCLES] = 0;

    return synapse;
  }

  setTime(timeNow: number) {
    this._previousTime = timeNow;
  }

  /**
   * return [isSpiked, amplitude]
   */
  spikedWithAmplitude(id: number): [boolean, number] {
    const idx = this._idToIndex.get(id);

    if (idx !== undefined) {
      if (this._spikesPrev[idx]) {
        return [true, this._neurons[idx][NeuronField.OUT_AMPLITUDE]];
      }
    }

    return [false, 0];
  }

  addExternalInput(id: number, value: number) {
    const idx = this._idToIndex.get(id);
    if (idx !== undefined) {
      this._inputs[idx] += value;
    }
  }

  think(timeNow: number) {
    // const dt = timeNow - this._previousTime;

    for (let pre = 0; pre < this._neuronCount; pre++) {
      // skip non-spiking neurons
      if (!this._spikesPrev[pre]) {
        continue;
      }

      const preNeuron = this._neurons[pre];
      const preOut = preNeuron[NeuronField.OUT_AMPLITUDE];
      const pool = this._neuronOutgoingSynapses[pre];
      const { synapses } = pool;
      const synapseCount = pool.count;

      for (let j = 0; j < synapseCount; j++) {
        const synapse = synapses[j];

        if (synapse[SynapseField.STATE] !== SynapseState.EXIST) {
          continue; // PRUNED/FREE ignore, they will be cleaned by update()
        }

        const postNeuronId = synapse[SynapseField.POST_SYNAPTIC_NEURON];
        const postIndex = this._idToIndex.get(postNeuronId);

        if (postIndex !== undefined) {
          const postNeuron = this._neurons[postIndex];

          const weight = synapse[SynapseField.WEIGHT];
          const vesicles = synapse[SynapseField.VESICLES];

          // contribution to post neuron
          const effW = weight * vesicles;
          this._inputs[postIndex] += preOut * effW;

          // learning/wear by fact of transmission
          hebbianUpdate(synapse, preNeuron, postNeuron, this._spikeStrongerThreshold);
          // here is no relax/maintain/compact - this is done by update()
        }
      }
    }

    // step neurons: integration of input + threshold + refractory period
    for (let i = 0; i < this._neuronCount; i++) {
      const neuron = this._neurons[i];
      const spiked = stepNeuron(neuron, this._inputs[i], timeNow);
      this._spikesNext[i] = spiked;

      this._lastTickSpikedNeurons += spiked ? 1 : 0;
    }

    // copy spikes array
    const tmp = this._spikesPrev;
    this._spikesPrev = this._spikesNext;
    this._spikesNext = tmp;

    // clear next spikes array and inputs
    this._spikesNext.fill(false, 0, this._neuronCount);
    this._inputs.fill(0, 0, this._neuronCount);

    this._previousTime = timeNow;
  }

  update() {
    for (let i = 0; i < this._neuronCount; i++) {
      const { synapses, count } = this._neuronOutgoingSynapses[i];

      for (let j = 0; j < count; j++) {
        relaxSynapse(synapses[j]);
        maintainSynapse(synapses[j]);
      }
    }

    this.compactNeurons();
    this.compactSynapses();

    // console.log('last tick spiked neurons:', this._lastTickSpikedNeurons);
    this._lastTickSpikedNeurons = 0;
  }

  private compactNeurons() {
    let k = 0;

    while (k < this._neuronCount) {
      if (this._neurons[k][NeuronField.STATE] === NeuronState.PRUNED) {
        const lastIndex = this._neuronCount - 1;

        const removedId = this._neurons[k][NeuronField.ID];
        this._idToIndex.delete(removedId);

        if (k !== lastIndex) {
          const movedNeuron = this._neurons[lastIndex];
          const movedId = movedNeuron[NeuronField.ID];

          // swap neurons
          const tmp = this._neurons[k];
          this._neurons[k] = movedNeuron;
          this._neurons[lastIndex] = tmp;

          // swap spikes
          const tmpPrev = this._spikesPrev[k];
          this._spikesPrev[k] = this._spikesPrev[lastIndex];
          this._spikesPrev[lastIndex] = tmpPrev;

          // swap synapse pool
          const tmpPool = this._neuronOutgoingSynapses[k];
          this._neuronOutgoingSynapses[k] = this._neuronOutgoingSynapses[lastIndex];
          this._neuronOutgoingSynapses[lastIndex] = tmpPool;

          // update index for moved neuron
          this._idToIndex.set(movedId, k);
        }

        this._neurons[lastIndex][NeuronField.STATE] = NeuronState.FREE; // now deleted object marked as free
        freeSynapsePool(this._neuronOutgoingSynapses[lastIndex]);
        this._neuronCount--;
      } else {
        k++;
      }
    }
  }

  private compactSynapses() {
    let totalSynapseCount = 0;

    for (let i = 0; i < this._neuronCount; i++) {
      const synapsePool = this._neuronOutgoingSynapses[i];

      const { synapses } = synapsePool;
      let synapseCount = synapsePool.count;

      let k = 0;

      while (k < synapseCount) {
        if (synapses[k][SynapseField.STATE] === SynapseState.PRUNED) {
          const lastIndex = synapseCount - 1;

          if (k !== lastIndex) {
            // swap with last object
            const tmp = synapses[k];
            synapses[k] = synapses[lastIndex];
            synapses[lastIndex] = tmp;
          }

          synapses[lastIndex][SynapseField.STATE] = SynapseState.FREE; // now deleted object marked as free
          synapseCount--;
        } else {
          k++;
        }
      }

      // update pool count
      synapsePool.count = synapseCount;
      totalSynapseCount += synapseCount;
    }

    this._totalSynapseCount = totalSynapseCount;
  }

  releaseMemory() {
    // safety release pools
    for (let i = 0; i < this._neuronCount; i++) {
      const pool = this._neuronOutgoingSynapses[i];
      pool.count = 0;
      pool.capacity = 0;
      pool.synapses = [];
    }

    this._neuronOutgoingSynapses = [];
    this._totalSynapseCount = 0;

    this._neuronCount = 0;
    this._neuronCapacity = 0;
    this._neuronMaxOutgoingSynapses = 0;
    this._neurons = [];
    this._idToIndex = new Map<number, number>();
    this._spikesPrev = [];
    this._spikesNext = [];
  }
}
