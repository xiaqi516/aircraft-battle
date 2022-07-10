import airplane0 from '../assets/airplane0.png';
import airplane1 from '../assets/airplane1.png';
import airplane2 from '../assets/airplane2.png';
import airplane3 from '../assets/airplane3.png';
import consts from './consts';
import Enemy from './enemy';
import { FlyingObject, STATE } from './flying-object';

const images = [
    FlyingObject.loadImage(airplane0),
    FlyingObject.loadImage(airplane1),
    FlyingObject.loadImage(airplane2),
    FlyingObject.loadImage(airplane3),
];

/**
 * 小敌机
 */
export default class Airplane extends FlyingObject implements Enemy {
    /**
     * 移动速度
     */
    private speed: number;

    /**
     * 轮换图片的起始下标
     */
    private index: number;

    public constructor() {
        super(49, 36);
        this.speed = 2;
        this.index = 1;
    }

    public step(): void {
        // y+（向下）
        this.y += this.speed;
    }

    public getImage(): any {
        if (this.isLife()) {
            return images[0];
        }
        if (this.isDead()) {
            const img = images[this.index++];
            if (this.index === images.length) {
                this.state = STATE.REMOVE;
            }
            return img;
        }
        return null;
    }

    public outOfBounds(): boolean {
        // 小敌机的y >= 窗口的高，即为越界了
        return this.y >= consts.HEIGHT;
    }

    // eslint-disable-next-line class-methods-use-this
    public getScore(): number {
        return 1;
    }
}
