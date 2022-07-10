/**
 * 奖励接口
 */
export interface Award {

    /**
     * 获取奖励类型(0或1)
     */
    getType(): number;

}

/**
 * 奖励类型
 */
export enum AwardType {
    // 火力值
    DOUBLE_FIRE = 0,
    // 命
    LIFE = 1,
}
