import hero0 from '../assets/hero0.png';
import hero1 from '../assets/hero1.png';
import Bullet from './bullet';
import { FlyingObject } from './flying-object';

const images = [
    FlyingObject.loadImage(hero0),
    FlyingObject.loadImage(hero1),
];

/**
 * 英雄机
 */
export default class Hero extends FlyingObject {
    // 命
    private life: number;
    // 火力值
    private doubleFire;
    // 活着的图片切换的起始下标
    private index: number;

    public constructor() {
        super(97, 124, 140, 400);
        this.life = 3;
        // 默认为0（单倍火力）
        this.doubleFire = 0;
        this.index = 0;
    }

    /**
     * 英雄机随鼠标移动
     * @param x 鼠标的x
     * @param y 鼠标的y
     */
    public moveTo(x: number, y: number): void {
        // 英雄机的x = 鼠标的x - 1/2英雄机的宽
        this.x = x - this.width / 2;
        // 英雄机的y = 鼠标的y - 1/2英雄机的高
        this.y = y - this.height / 2;
    }

    public step(): void {
        console.log(this.doubleFire);
    }

    public getImage(): any {
        if (this.isLife()) {
            const { length } = images;
            return images[this.index++ % length];
        }
        return null;
    }

    /**
     * 英雄机发射子弹（生成子弹对象）
     */
    public shoot(): Bullet[] {
        // xStep: 1/4英雄机的宽
        const xStep = this.width / 4;
        // yStep: 固定的20
        const yStep = 20;
        if(this.doubleFire > 0) {
            // 双倍火力
            const bs = [
                new Bullet(this.x + 1 * xStep, this.y - yStep),
                new Bullet(this.x + 3 * xStep, this.y - yStep),
            ];
            //发射一次双倍火力，则火力值减2
            this.doubleFire -= 2;
            return bs;
        } else{
            // 单倍火力
            const bs = [
                new Bullet(this.x + 2 * xStep, this.y - yStep),
            ];
            return bs;
        }
    }

    public outOfBounds(): boolean {
        //永不越界
        return false;
    }

    /**
     * 增命
     */
    public addLife(): void {
        this.life++;
    }

    /**
     * 获取命数
     */
    public getLife(): number {
        return this.life;
    }

    /**
     * 减命
     */
    public subtractLife(): void{
        this.life--;
    }

    /**
     * 增加火力值
     */
    public addDoubleFire(): void {
        // 火力值增40
        this.doubleFire += 40;
    }

    /**
     * 清空火力值
     */
    public clearDoubleFire(): void {
        // 火力值归零
        this.doubleFire = 0;
    }

}
