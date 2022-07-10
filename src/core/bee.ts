import bee0 from '../assets/bee0.png';
import bee1 from '../assets/bee1.png';
import bee2 from '../assets/bee2.png';
import bee3 from '../assets/bee3.png';
import bee4 from '../assets/bee4.png';
import { FlyingObject, STATE } from './flying-object';
import consts from './consts';
import { Award } from './award';

const images = [
    FlyingObject.loadImage(bee0),
    FlyingObject.loadImage(bee1),
    FlyingObject.loadImage(bee2),
    FlyingObject.loadImage(bee3),
    FlyingObject.loadImage(bee4),
];

/**
 * 小蜜蜂
 */
export default class Bee extends FlyingObject implements Award {

    /**
     * x坐标移动速度
     */
    private xSpeed: number;

    /**
     * y坐标移动速度
     */
    private ySpeed: number;

    /**
     * 轮换图片的起始下标
     */
    private index: number;

    /**
     * 奖励类型(0或1)
     */
    private awardType: number;

    public constructor() {
        super(60, 50);
        this.xSpeed = 1;
        this.ySpeed = 2;
        this.index = 1;
        this.awardType = Math.floor(Math.random() * 2);
    }

    public step(): void {
        // x+(向左或向右)
        this.x += this.xSpeed;
        // y+(向下)
        this.y += this.ySpeed;
        // x<=0或x>=(窗口宽-蜜蜂宽)时，表示已经到两边了，则往回弹
        if (this.x <= 0 || this.x >= consts.WIDTH - this.width) {
            // 修改xSpeed的正负值
            this.xSpeed *= -1
        }
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
        // 小蜜蜂的y >= 窗口的高，即为越界了
        return this.y >= consts.HEIGHT;
    }

    public getType(): number {
        return this.awardType;
    }

}