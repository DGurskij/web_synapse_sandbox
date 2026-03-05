import { distance } from '../math';
import { Organism } from '../organism/Organism';
import { ILimbWorldRect } from '../organism/Organism';
import { PhysicalObject } from './PhysicalObject';

const RESTITUTION = 0;
const MIN_DIST = 1e-6;
const MAX_RELATIVE_VELOCITY = 8;
const MAX_IMPULSE = 25;

/** Результат теста rect-circle: есть ли коллизия, нормаль, глубина, точка контакта на rect */
function testRectCircleCollision(
  rect: ILimbWorldRect,
  cx: number,
  cy: number,
  radius: number,
): { hit: boolean; nx: number; ny: number; depth: number; contactX: number; contactY: number } {
  const cosA = Math.cos(-rect.angle);
  const sinA = Math.sin(-rect.angle);
  const relX = (cx - rect.cx) * cosA - (cy - rect.cy) * sinA;
  const relY = (cx - rect.cx) * sinA + (cy - rect.cy) * cosA;
  const closestX = Math.max(-rect.halfWidth, Math.min(rect.halfWidth, relX));
  const closestY = Math.max(-rect.halfHeight, Math.min(rect.halfHeight, relY));
  const distSq = (relX - closestX) ** 2 + (relY - closestY) ** 2;
  const dist = Math.sqrt(distSq);

  if (dist >= radius - MIN_DIST) {
    return { hit: false, nx: 0, ny: 0, depth: 0, contactX: 0, contactY: 0 };
  }

  const depth = radius - dist;
  let nx: number;
  let ny: number;
  let contactLocalX: number;
  let contactLocalY: number;

  if (dist < MIN_DIST) {
    nx = 1;
    ny = 0;
    contactLocalX = closestX;
    contactLocalY = closestY;
  } else {
    nx = (relX - closestX) / dist;
    ny = (relY - closestY) / dist;
    contactLocalX = closestX;
    contactLocalY = closestY;
  }

  const cosB = Math.cos(rect.angle);
  const sinB = Math.sin(rect.angle);
  const worldNx = nx * cosB - ny * sinB;
  const worldNy = nx * sinB + ny * cosB;
  const contactX = rect.cx + contactLocalX * cosB - contactLocalY * sinB;
  const contactY = rect.cy + contactLocalX * sinB + contactLocalY * cosB;

  return { hit: true, nx: worldNx, ny: worldNy, depth, contactX, contactY };
}

/**
 * Разрешение коллизии конечность–физический объект.
 * Применяет импульсы с учётом точки контакта (отталкивание организма при ударе тяжёлым объектом).
 */
function resolveLimbPhysicalCollision(organism: Organism, physical: PhysicalObject, limbIndex: number): void {
  const rect = organism.getLimbRectInWorld(limbIndex);
  if (!rect) return;

  const result = testRectCircleCollision(rect, physical.position.x, physical.position.y, physical.radius);

  if (!result.hit) return;

  const { nx, ny, depth, contactX, contactY } = result;
  const mOrg = organism.mass;
  const mObj = physical.mass;
  const totalM = mOrg + mObj;
  const limbMass = organism.limbs[limbIndex].mass;

  const orgShift = (mObj / totalM) * depth;
  const objShift = (mOrg / totalM) * depth;

  organism.translatePosition(-nx * orgShift, -ny * orgShift);
  physical.translatePosition(nx * objShift, ny * objShift);

  const vOrg = organism.velocity;
  const vObj = physical.velocity;
  const rx = contactX - organism.position.x;
  const ry = contactY - organism.position.y;
  const vContactX = vOrg.x - organism.angularVelocity * ry;
  const vContactY = vOrg.y + organism.angularVelocity * rx;
  let vRel = (vContactX - vObj.x) * nx + (vContactY - vObj.y) * ny;
  vRel = Math.min(vRel, MAX_RELATIVE_VELOCITY);

  if (vRel > 0) {
    const mEffOrg = limbMass * 0.5 + mOrg * 0.5;
    let j = (-(1 + RESTITUTION) * vRel) / (1 / mEffOrg + 1 / mObj);
    j = Math.min(j, MAX_IMPULSE);
    organism.applyImpulseAtPoint(contactX, contactY, j * nx, j * ny);
    physical.applyImpulse(-j * nx, -j * ny);
  }
}

/**
 * Разрешение коллизии организм–физический объект (тело + конечности).
 */
export function resolveOrganismPhysicalCollision(organism: Organism, physical: PhysicalObject): void {
  for (let i = 0; i < organism.limbs.length; i++) {
    resolveLimbPhysicalCollision(organism, physical, i);
  }

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

  const mOrg = organism.mass;
  const mObj = physical.mass;
  const totalM = mOrg + mObj;

  const orgShift = (mObj / totalM) * overlap;
  const objShift = (mOrg / totalM) * overlap;

  organism.translatePosition(-nx * orgShift, -ny * orgShift);
  physical.translatePosition(nx * objShift, ny * objShift);

  const vOrg = organism.velocity;
  const vObj = physical.velocity;
  let vRel = (vOrg.x - vObj.x) * nx + (vOrg.y - vObj.y) * ny;
  vRel = Math.min(vRel, MAX_RELATIVE_VELOCITY);

  if (vRel > 0) {
    let j = (-(1 + RESTITUTION) * vRel) / (1 / mOrg + 1 / mObj);
    j = Math.min(j, MAX_IMPULSE);
    organism.applyImpulse(j * nx, j * ny);
    physical.applyImpulse(-j * nx, -j * ny);
  }
}
