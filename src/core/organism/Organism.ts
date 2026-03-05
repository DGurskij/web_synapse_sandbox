import { IOrganismConfig } from 'src/interfaces';
import { IPoint } from '../math';
import { CircleShape } from 'src/model/CircleShape';
import { RectangleShape } from 'src/model/RectangleShape';
import { Body } from './Body';
import { Limb } from './Limb';

export interface ILimbWorldRect {
  cx: number;
  cy: number;
  halfWidth: number;
  halfHeight: number;
  angle: number;
}

export class Organism {
  private _body: Body;
  private _limbs: Limb[];

  private _position: IPoint;
  private _velocity: IPoint;
  private _acceleration: IPoint;

  private _angle: number;
  private _angularVelocity: number;
  private _angularAcceleration: number;

  private _mass: number;

  constructor(config: IOrganismConfig) {
    this._body = new Body(config.body ?? {});
    this._limbs = config.limbs?.map(limb => new Limb(limb)) ?? [];

    this._position = config.position ?? { x: 0, y: 0 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
    this._angle = 0;
    this._angularVelocity = 0;
    this._angularAcceleration = 0;
    this._mass = this._computeTotalMass();
  }

  private _computeTotalMass(): number {
    return this._body.mass + this._limbs.reduce((sum, limb) => sum + limb.mass, 0);
  }

  getLimbPivotInBodyFrame(index: number): IPoint {
    const limb = this._limbs[index];
    const ap = limb.attachmentPoint;
    const pi = limb.parentIndex;

    if (pi < 0) {
      return { x: ap.x, y: ap.y };
    }

    const parentPivot = this.getLimbPivotInBodyFrame(pi);
    const parentAngle = this.getLimbAngleInBodyFrame(pi);

    return {
      x: parentPivot.x + ap.x * Math.cos(parentAngle) - ap.y * Math.sin(parentAngle),
      y: parentPivot.y + ap.x * Math.sin(parentAngle) + ap.y * Math.cos(parentAngle),
    };
  }

  getLimbAngleInBodyFrame(index: number): number {
    const limb = this._limbs[index];
    const pi = limb.parentIndex;
    const base = pi < 0 ? 0 : this.getLimbAngleInBodyFrame(pi);
    return base + limb.angle;
  }

  private _limbDepths(): number[] {
    const depths: number[] = [];
    for (let i = 0; i < this._limbs.length; i++) {
      const pi = this._limbs[i].parentIndex;
      depths[i] = pi < 0 ? 0 : depths[pi] + 1;
    }
    return depths;
  }

  get position(): IPoint {
    return this._position;
  }

  get angle(): number {
    return this._angle;
  }

  get body(): Body {
    return this._body;
  }

  get limbs() {
    return this._limbs;
  }

  get velocity(): IPoint {
    return this._velocity;
  }

  get angularVelocity(): number {
    return this._angularVelocity;
  }

  get mass(): number {
    return this._mass;
  }

  getBodyRadius(): number {
    const { shape } = this._body;
    if (shape instanceof CircleShape) {
      return shape.radius;
    }
    return 0;
  }

  applyImpulse(fx: number, fy: number) {
    if (this._mass > 0) {
      this._velocity.x += fx / this._mass;
      this._velocity.y += fy / this._mass;
    }
  }

  translatePosition(dx: number, dy: number) {
    this._position.x += dx;
    this._position.y += dy;
  }

  /**
   * Применяет импульс в точке мира (для коллизий конечностей).
   * Учитывает как линейное, так и угловое ускорение организма.
   */
  applyImpulseAtPoint(worldX: number, worldY: number, fx: number, fy: number) {
    if (this._mass <= 0) return;
    const rx = worldX - this._position.x;
    const ry = worldY - this._position.y;
    const bodyR = this.getBodyRadius();
    const I = 0.5 * this._mass * bodyR * bodyR;
    this._velocity.x += fx / this._mass;
    this._velocity.y += fy / this._mass;
    this._angularVelocity += (rx * fy - ry * fx) / I;
  }

  /**
   * Возвращает прямоугольник конечности в мировых координатах (для коллизий).
   * null если форма не RectangleShape.
   */
  getLimbRectInWorld(index: number): ILimbWorldRect | null {
    const limb = this._limbs[index];
    const { shape } = limb;
    if (!(shape instanceof RectangleShape)) return null;
    const pivot = this.getLimbPivotInBodyFrame(index);
    const limbAngle = this.getLimbAngleInBodyFrame(index);
    const bodyAngle = this._angle;
    const ox = limb.offset.x + shape.width / 2;
    const oy = limb.offset.y + shape.height / 2;
    const cxBody = pivot.x + ox * Math.cos(limbAngle) + oy * Math.sin(limbAngle);
    const cyBody = pivot.y - ox * Math.sin(limbAngle) + oy * Math.cos(limbAngle);
    const cx = this._position.x + cxBody * Math.cos(bodyAngle) - cyBody * Math.sin(bodyAngle);
    const cy = this._position.y + cxBody * Math.sin(bodyAngle) + cyBody * Math.cos(bodyAngle);
    const worldAngle = bodyAngle - limbAngle;
    return {
      cx,
      cy,
      halfWidth: shape.width / 2,
      halfHeight: shape.height / 2,
      angle: worldAngle,
    };
  }

  update() {
    this._velocity.x += this._acceleration.x;
    this._velocity.y += this._acceleration.y;
    this._position.x += this._velocity.x;
    this._position.y += this._velocity.y;

    this._angularVelocity += this._angularAcceleration;
    this._angle += this._angularVelocity;

    this._velocity.x *= 0.92;
    this._velocity.y *= 0.92;
    this._angularVelocity *= 0.92;

    const depths = this._limbDepths();
    const order = this._limbs.map((_, i) => i).sort((a, b) => depths[a] - depths[b]);

    for (const i of order) {
      this._limbs[i].update();
    }

    this._acceleration = { x: 0, y: 0 };
    this._angularAcceleration = 0;
  }

  interactWithWorld() {
    const cos = Math.cos(this._angle);
    const sin = Math.sin(this._angle);

    const forces: [number, number][] = [];
    for (let i = 0; i < this._limbs.length; i++) {
      forces[i] = this._limbs[i].interactWithWorld();
    }

    for (let i = 0; i < this._limbs.length; i++) {
      const limb = this._limbs[i];
      const [fx, fy] = forces[i];
      const pi = limb.parentIndex;

      if (pi >= 0) {
        const ap = limb.attachmentPoint;
        const childAngle = limb.angle;
        const c = Math.cos(childAngle);
        const s = Math.sin(childAngle);
        const fxParent = fx * c - fy * s;
        const fyParent = fx * s + fy * c;
        const torqueOnParent = ap.x * fyParent - ap.y * fxParent;
        this._limbs[pi].addTorqueFromChild(torqueOnParent);
      }

      const pivot = this.getLimbPivotInBodyFrame(i);
      const limbAngle = this.getLimbAngleInBodyFrame(i);
      const fCos = Math.cos(limbAngle);
      const fSin = Math.sin(limbAngle);
      const fxBody = fx * fCos - fy * fSin;
      const fyBody = fx * fSin + fy * fCos;

      const torque = pivot.x * fyBody - pivot.y * fxBody;
      this._angularAcceleration += (0.005 * torque) / this._mass;

      const worldFx = fxBody * cos - fyBody * sin;
      const worldFy = fxBody * sin + fyBody * cos;

      this._acceleration.x += worldFx / this._mass;
      this._acceleration.y += worldFy / this._mass;
    }
  }
}
