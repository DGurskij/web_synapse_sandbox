export const MATH_PI_MUL_TWO = Math.PI * 2;

export const SIZE_MUL = 0.85;

export const ZERO = 0;
export const ONE = 1;

export interface IPoint {
  x: number;
  y: number;
}

export type Rectangle = [number, number, number, number];
export type vec2 = [number, number];
export type vec3 = [number, number, number];

export function distance(o1: IPoint, o2: IPoint) {
  return Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2);
}

export function distanceSofteningRadius(o1: IPoint, o2: IPoint, softeningRadius: number) {
  return Math.sqrt((o1.x - o2.x) ** 2 + (o1.y - o2.y) ** 2 + softeningRadius ** 2);
}

export function isObjectInRectangle(obj: IPoint, rectangle: Rectangle) {
  return obj.x >= rectangle[0] && obj.y >= rectangle[1] && obj.x <= rectangle[2] && obj.y <= rectangle[3];
}

export function isInsideRectangle(x: number, y: number, width: number, height: number, availableError: number = 1) {
  return x >= -availableError && x <= width + availableError && y >= -availableError && y <= height + availableError;
}

export function floatEqual(a: number, b: number, epsilon: number = 0.000001) {
  return Math.abs(a - b) < epsilon;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(Math.min(max, value), min);
}
