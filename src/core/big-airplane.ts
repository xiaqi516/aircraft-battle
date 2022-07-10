import bigplane0 from '../assets/bigplane0.png';
import bigplane1 from '../assets/bigplane1.png';
import bigplane2 from '../assets/bigplane2.png';
import bigplane3 from '../assets/bigplane3.png';
import bigplane4 from '../assets/bigplane4.png';
import { FlyingObject, STATE } from './flying-object';
import Enemy from './enemy';
import consts from './consts';

const images = [
    FlyingObject.loadImage(bigplane0),
    FlyingObject.loadImage(bigplane1),
    FlyingObject.loadImage(bigplane2),
    FlyingObject.loadImage(bigplane3),
    FlyingObject.loadImage(bigplane4),
];

/**
 * 大敌机
 */
export default class BigAriPlane extends FlyingObject implements Enemy {
    /**
     * 移动速度
     */
    private speed: number;

    /**
     * 轮换图片的起始下标
     */
    private index: number;

    public constructor() {
        super(69, 99);
        this.speed = 2;
        this.index = 1;
    }

    public step(): void {
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
        // 大敌机的y >= 窗口的高，即为越界了
        return this.y >= consts.HEIGHT;
    }

    // eslint-disable-next-line class-methods-use-this
    public getScore(): number {
        return 3;
    }
}
