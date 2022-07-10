import background from '../assets/background.png';
import consts from './consts';
import { FlyingObject } from './flying-object';

const image: Promise<any> = FlyingObject.loadImage(background);

/**
 * 天空
 */
export default class Sky extends FlyingObject {
    // 第二张图片的y坐标
    private y1: number;
    // 移动速度
    private speed: number;

    public constructor() {
        super(consts.WIDTH, consts.HEIGHT, 0, 0);
        this.y1 = -this.height;
        this.speed = 1;
    }

    public step(): void {
        this.y += this.speed;
        this.y1 += this.speed;
        if (this.y >= consts.HEIGHT) {
            this.y = -consts.HEIGHT;
        }
        if (this.y1 >= consts.HEIGHT) {
            this.y1 = -consts.HEIGHT;
        }
    }

    // eslint-disable-next-line class-methods-use-this
    public getImage(): Promise<any> {
        return image;
    }

    public drawObject(drawImage: any): void {
        drawImage(this.getImage(), this.x, this.y);
        drawImage(this.getImage(), this.x, this.y1);
    }

    public outOfBounds(): boolean {
        // 永不越界
        return false;
    }

}
