import consts from './consts';

export enum STATE {
    // 活着的
    LIFE = 0,
    // 死了的（未删）
    DEAD = 1,
    // 删除的
    REMOVE = 2,
}

/**
 * 飞行物
 */
export abstract class FlyingObject {
    protected width: number;
    protected height: number;
    protected x: number;
    protected y: number;
    protected state: STATE;

    public constructor(
        width: number,
        height: number,
        x: number | undefined = undefined,
        y: number | undefined = undefined,
    ) {
        this.width = width;
        this.height = height;

        if (x !== undefined && y !== undefined) {
            this.x = x;
            this.y = y;
        } else {
            // x:0到(窗口宽-小敌机宽)之间的随机数
            this.x = Math.random() * (consts.WIDTH - this.width);
            this.y = -this.height;
        }

        this.state = STATE.LIFE;
    }

    public static loadImage(imgUrl: string): Promise<any> {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imgUrl;
            img.addEventListener('load', function () {
                resolve(this);
            });
        });
    }

    /**
     * 判断是否活着的
     */
    public isLife(): boolean {
        return this.state === STATE.LIFE;
    }

    /**
     * 判断是否死了的
     */
    public isDead(): boolean {
        return this.state === STATE.DEAD;
    }

    /**
     * 判断是否删除的
     */
    public isRemove(): boolean {
        return this.state === STATE.REMOVE;
    }

    /**
     * 飞行物移动
     */
    public abstract step(): void;

    /**
     * 获取图片
     */
    public abstract getImage(): any;

    public drawObject(drawImage: any): void {
        drawImage(this.getImage(), this.x, this.y);
    }

    /**
     * 检查飞行物是否越界
     */
    public abstract outOfBounds(): boolean;

    /**
     * 检测敌人与子弹/英雄机的碰撞
     * @param other 子弹/英雄机
     */
    public hit(other: FlyingObject): boolean {
        const x1 = this.x - other.width;
        const x2 = this.x + this.width;
        const y1 = this.y - other.height;
        const y2 = this.y + this.height;
        const x = other.x;
        const y = other.y;

        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
    }

    /**
     * 飞行物死亡
     */
    public goDead(): void {
        this.state = STATE.DEAD;
    }

}
