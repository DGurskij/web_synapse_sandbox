import { distance } from '../math';
import { Organism } from '../organism/Organism';
import { PhysicalObject } from './PhysicalObject';

const RESTITUTION = 0.3;
const MIN_DIST = 1e-6;

/**
 * Разрешение коллизии организм–физический объект (круг–круг).
 * Разводит объекты и применяет импульсы.
 */
export function resolveOrganismPhysicalCollision(
  organism: Organism,
  physical: PhysicalObject
): void {
  const bodyPos = organism.position;
  const objPos = physical.position;
  const bodyR = organism.getBodyRadius();
  const objR = physical.radius;

  const dx = objPos.x - bodyPos.x;
  const dy = objPos.y - bodyPos.y;
  const dist = distance(bodyPos, objPos);
  const minDist = bodyR + objR;

  if (dist >= minDist - MIN_DIST) {
    return;
  }

  const overlap = minDist - dist;

  let nx: number;
  let ny: number;

  if (dist < MIN_DIST) {
    nx = 1;
    ny = 0;
  } else {
    nx = dx / dist;
    ny = dy / dist;
  }

  // Разделение — сдвигаем оба объекта вдоль нормали
  const mOrg = organism.mass;
  const mObj = physical.mass;
  const totalM = mOrg + mObj;

  const orgShift = (mObj / totalM) * overlap;
  const objShift = (mOrg / totalM) * overlap;

  organism.translatePosition(-nx * orgShift, -ny * orgShift);
  physical.translatePosition(nx * objShift, ny * objShift);

  // Импульс для изменения скоростей (упругий отскок)
  const vOrg = organism.velocity;
  const vObj = physical.velocity;
  const vRel = (vOrg.x - vObj.x) * nx + (vOrg.y - vObj.y) * ny;

  if (vRel > 0) {
    const j = -(1 + RESTITUTION) * vRel / (1 / mOrg + 1 / mObj);
    organism.applyImpulse(j * nx, j * ny);
    physical.applyImpulse(-j * nx, -j * ny);
  }
}
