import startUrl from '../assets/start.png';
import pauseUrl from '../assets/pause.png';
import gameoverUrl from '../assets/gameover.png';

import consts from './consts';
import { FlyingObject } from './flying-object';
import Sky from './sky';
import Hero from './hero';
import Bullet from './bullet';
import Airplane from './airplane';
import BigAirplane from './big-airplane';
import Bee from './bee';
import Enemy from './enemy';
import { Award, AwardType } from './award';

const start: Promise<any> = FlyingObject.loadImage(startUrl);
const pause: Promise<any> = FlyingObject.loadImage(pauseUrl);
const gameover: Promise<any> = FlyingObject.loadImage(gameoverUrl);

/**
 * 游戏状态
 */
enum State {
    // 启动状态
    START = 0,
    // 运行状态
    RUNNING = 1,
    // 暂停状态
    PAUSE = 2,
    // 游戏结束状态
    GAME_OVER = 3,
}

export default class World {
    private canvas: any;
    private ctx: any;
    private state: State;
    // 天空
    private sky: Sky;
    // 英雄机
    private hero: Hero;
    // 敌人(小敌机、大敌机、小蜜蜂)
    private enemies: FlyingObject[];
    // 子弹
    private bullets: Bullet[];
    // 子弹入场计数
    private shootIndex: number;
    // 敌人入场计数
    private enterIndex: number;
    // 得分
    private score: number;

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.canvas.setAttribute('width', consts.WIDTH);
        this.canvas.setAttribute('height', consts.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = 'normal 18pt "Microsoft YaHei"';

        this.state = State.START;

        this.sky = new Sky();
        this.hero = new Hero();
        this.enemies = [];
        this.bullets = [];
        this.shootIndex = 0;
        this.enterIndex = 0;

        this.score = 0;

        const { left, top } = this.canvas.getBoundingClientRect();
        this.canvas.addEventListener('mousemove', (event: any) => {
            if (this.state === State.RUNNING) {
                const { x, y } = event;
                this.hero.moveTo(x - left, y - top);
            }
        });

        this.canvas.addEventListener('click', () => {
            switch (this.state) {
                case State.START:
                    this.state = State.RUNNING;
                    break;
                // 游戏结束
                case State.GAME_OVER:
                    // 重置
                    this.score = 0;
                    this.sky = new Sky();
                    this.hero = new Hero();
                    this.enemies = [];
                    this.bullets = [];
                    this.state = State.START;
                    break;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.state === State.RUNNING) {
                // 暂停游戏
                this.state = State.PAUSE;
            }
        });

        this.canvas.addEventListener('mouseenter', () => {
            if (this.state === State.PAUSE) {
                // 继续游戏
                this.state = State.RUNNING;
            }
        });
    }

    private drawImage(img: Promise<any>, x: number, y: number): void {
        if (img) {
            img.then((data) => {
                this.ctx.drawImage(data, x, y);

                // 显示分数
                this.ctx.strokeText(`SCORE:${this.score}`, 10, 25);
                // 显示命
                this.ctx.strokeText(`LIFE:${this.hero.getLife()}`, 10, 45);
            });
        }
    }

    // 生成敌人（小敌机、大敌机、小蜜蜂）对象
    // eslint-disable-next-line class-methods-use-this
    private nextOne(): FlyingObject {
        const type = Math.random() * 20;
        if (type < 12) {
            return new Airplane();
        }
        if (type < 19) {
            return new BigAirplane();
        }
        return new Bee();
    }

    /**
     * 敌人(小敌机、大敌机、小蜜蜂)入场
     */
    public enterAction(): void {
        this.enterIndex++;
        if (this.enterIndex % 40 === 0) {
            const obj: FlyingObject = this.nextOne();
            this.enemies.push(obj);
        }
    }

    /**
     * 子弹入场
     */
    private shootAction(): void {
        this.shootIndex++;
        if (this.shootIndex % 30 === 0) {
            const bs = this.hero.shoot();
            this.bullets.push(...bs);
        }
    }

    /**
     * 删除越界的飞行物
     */
    private outOfBoundsAction(): void {
        const enemyLives: FlyingObject[] = []
        for (const enemy of this.enemies) {
            // 不越界并且非删除状态的
            if (!enemy.outOfBounds() && !enemy.isRemove()) {
                enemyLives.push(enemy);
            }
        }
        this.enemies = enemyLives;

        const bulletLives: Bullet[] = [];
        for (const bullet of this.bullets) {
            // 不越界并且非删除状态的
            if (!bullet.outOfBounds() && !bullet.isRemove()) {
                bulletLives.push(bullet);
            }
        }
        this.bullets = bulletLives;
    }

    /**
     * 子弹与敌人碰撞
     */
    public bulletBangAction(): void {
        for (const bullet of this.bullets) {
            for (const enemy of this.enemies) {
                // 撞上了
                if (bullet.isLife() && enemy.isLife() && enemy.hit(bullet)) {
                    // 子弹死亡
                    bullet.goDead();
                    // 敌人死亡
                    enemy.goDead();

                    // TODO find a better way to implement it
                    const isEnemy = (props: any): props is Enemy => props.getScore !== undefined;
                    if (isEnemy(enemy)) {
                        // 玩家得分
                        this.score += enemy.getScore();
                    }

                    const isAward = (props: any): props is Award => props.getType !== undefined;
                    if (isAward(enemy)) {
                        const type = enemy.getType();
                        switch (type) {
                            case AwardType.DOUBLE_FIRE:
                                // 增加火力值
                                this.hero.addDoubleFire();
                                break;
                            case AwardType.LIFE:
                                // 增加命
                                this.hero.addLife();
                                break;
                        }
                    }
                }
            }
        }
    }

    /**
     * 英雄机与敌人的碰撞
     */
    public heroBangAction(): void {
        for (const enemy of this.enemies) {
            if (this.hero.isLife() && enemy.isLife() && enemy.hit(this.hero)) {
                // 敌人死亡
                enemy.goDead();
                // 英雄机减命
                this.hero.subtractLife();
                // 英雄机清空火力值
                this.hero.clearDoubleFire();
            }
        }
    }

    /**
     * 检测游戏结束
     */
    public checkGameOverAction(): void {
        if (this.hero.getLife() < 0) {
            this.state = State.GAME_OVER;
        }
    }

    /**
     * 飞行物移动
     */
    private stepAction(): void {
        // 天空移动
        this.sky.step();
        for (const enemy of this.enemies) {
            // 敌人移动
            enemy.step();
        }
        for (const bullet of this.bullets) {
            // 子弹移动
            bullet.step();
        }
    }

    private draw(): void {
        this.sky.drawObject(this.drawImage.bind(this));
        this.hero.drawObject(this.drawImage.bind(this));

        for (const enemy of this.enemies) {
            enemy.drawObject(this.drawImage.bind(this));
        }
        for (const bullet of this.bullets) {
            bullet.drawObject(this.drawImage.bind(this));
        }


        switch (this.state) {
            case State.START:
                this.drawImage(start, 0, 0);
                break;
            case State.PAUSE:
                this.drawImage(pause, 0, 0);
                break;
            case State.GAME_OVER:
                this.drawImage(gameover, 0, 0);
                break;
        }
    }

    public render(): void {
        if (this.state === State.RUNNING) {
            this.enterAction();
            this.shootAction();
            this.stepAction();
            this.outOfBoundsAction();
            this.bulletBangAction();
            this.heroBangAction();
            this.checkGameOverAction();
        }

        this.draw();
    }
}
