import bulletUrl from '../assets/bullet.png';
import { FlyingObject, STATE } from './flying-object';

const image: Promise<any> = FlyingObject.loadImage(bulletUrl);

/**
 * 子弹
 */
export default class Bullet extends FlyingObject {
    // 移动速度
    private speed: number;

    public constructor(x: number, y: number) {
        super(8, 4, x, y);
        this.speed = 3;
    }

    public step(): void {
        this.y -= this.speed;
    }

    public getImage(): Promise<any> | null {
        if (this.isLife()) {
            return image;
        }
        // 状态改为删除
        if (this.isDead()) {
            this.state = STATE.REMOVE;
        }
        return null;
    }

    public outOfBounds(): boolean {
        // 子弹的y <= 负的子弹的高，即为越界了
        return this.y <= -this.height;
    }
}
