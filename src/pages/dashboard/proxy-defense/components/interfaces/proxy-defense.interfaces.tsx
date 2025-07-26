export interface Enemy {
    buffs?: {
        healthBoost?: number // Health multiplier
        speedBoost?: number // Speed multiplier
    }
    disabledUntil?: number // Time until tower is disabled
    hasRevived?: boolean // For phoenix - has it already revived once?
    hasShield?: boolean
    health: number
    id: string
    isOriginal?: boolean // For replicators - only originals can create copies
    isReviving?: boolean // For phoenix - is it currently in the revive process?
    lastAttack: number
    lastServerDamage?: number // Last time enemy took damage from server defenses
    maxHealth: number
    maxShield?: number // Maximum number of shield blocks
    originalSpeed?: number // original speed
    reviveTime?: number // For phoenix - when should it revive?
    reward: number
    shield?: number // Number of remaining shield blocks
    slowEffect?: number // slowdown effect
    speed: number
    type:
        | 'ddos'
        | 'hacker'
        | 'malware'
        | 'phoenix'
        | 'portal_miner'
        | 'replicator'
        | 'shielded'
        | 'spider'
        | 'voltage'
        | 'worm'
    x: number
    y: number
}

export interface Tower {
    chainTargets?: number
    cooldown: number
    cost: number
    damage: number
    disabledUntil?: number
    health: number
    id: string
    lastShot: number
    maxHealth: number
    range: number
    slowdownEffect?: number
    type: 'antivirus' | 'chain' | 'firewall' | 'proxy' | 'slowdown'
    x: number
    y: number
}

export interface Explosion {
    duration: number
    id: string
    startTime: number
    type: 'enemy_death'
    x: number
    y: number
}

export interface Lightning {
    duration: number
    enemyType?: Enemy['type']
    fromX: number
    fromY: number
    id: string
    isEnemyAttack: boolean
    startTime: number
    towerType?: Tower['type']
    toX: number
    toY: number
}

// Global Events System
export type GlobalEventType = 'data_flood' | 'disk_format'

export interface GlobalEventConfig {
    canCoexist: GlobalEventType[] // Which events can run simultaneously
    description: string
    duration: number // How long the event lasts (ms)
    icon: string
    maxWaveInterval: number // Maximum waves between occurrences
    minWaveInterval: number // Minimum waves between occurrences
    name: string
    priority: number // Higher number = higher priority
    type: GlobalEventType
}

export interface ActiveGlobalEvent {
    config: GlobalEventConfig
    duration: number
    startTime: number
    startWave: number
    type: GlobalEventType
}

export interface GlobalEventSchedule {
    config: GlobalEventConfig
    scheduledWave: number
    type: GlobalEventType
}

export interface GlobalEventsState {
    activeEvents: ActiveGlobalEvent[]
    lastEventActivations: Record<GlobalEventType, number> // Track last activation wave for each event type
    lastEventWave: number
    scheduledEvents: GlobalEventSchedule[]
}

// Wave type system - adds variety to enemy composition
export type WaveType = 'elite' | 'standard' | 'swarm' | 'tsunami'

export interface WaveTypeConfig {
    countMultiplier: number
    description: string
    healthMultiplier: number
    name: string
    type: WaveType
}

export type Formation = 'ambush' | 'flanking' | 'group' | 'line' | 'pincer' | 'scattered' | 'waves'

export interface WaveInfo {
    formation: Formation
    formationDescription: string
    formationName: string
    waveType: WaveType
    waveTypeDescription: string
    waveTypeName: string
}

export interface GameState {
    coins: number
    coinsSpent: number
    currentWaveInfo: null | WaveInfo
    enemies: Enemy[]
    // Statistics
    enemiesKilled: number
    enemyBuffs: {
        healthBoost: number
        speedBoost: number
    }
    explosions: Explosion[]
    globalEvents: GlobalEventsState
    health: number
    healthLost: number
    isGameOver: boolean
    isGameStarted: boolean
    isShaking: boolean
    lastBuffWave: number
    // Visual effects
    lastDamageTime: number
    lastHealthRegen: number
    lastInterestPayment: number // Track interest payments
    lastMoneyRegen: number
    lightnings: Lightning[]
    score: number
    selectedTowerType: null | Tower['type']
    serverDefenseDamageDealt: number // Track damage dealt by server defenses
    totalCoinsEarned: number
    totalInterestEarned: number // Track total interest earned
    towers: Tower[]
    towersBuilt: number
    wave: number
}
