import { Formation, WaveType, WaveTypeConfig } from './interfaces'

export const TOWER_TYPES = {
    firewall: { damage: 25, range: 80, cost: 50, cooldown: 1000, health: 100, color: 'blue' },
    antivirus: { damage: 15, range: 60, cost: 30, cooldown: 800, health: 100, color: 'teal' },
    proxy: { damage: 10, range: 100, cost: 25, cooldown: 600, health: 50, color: 'indigo' },
    slowdown: { damage: 5, range: 120, cost: 35, cooldown: 800, health: 60, color: 'cyan' },
    chain: { damage: 25, range: 90, cost: 60, cooldown: 1200, health: 70, color: 'purple' }
}

export const ENEMY_TYPES = {
    hacker: {
        health: 30,
        speed: 2.5,
        reward: 15,
        color: 'red',
        towerDamage: 15,
        attackRange: 50,
        attackCooldown: 1500,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    ddos: {
        health: 60,
        speed: 1.5,
        reward: 30,
        color: 'orange',
        towerDamage: 25,
        attackRange: 60,
        attackCooldown: 800,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    malware: {
        health: 15,
        speed: 4,
        reward: 10,
        color: 'pink',
        towerDamage: 8,
        attackRange: 40,
        attackCooldown: 1200,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    spider: {
        health: 180,
        speed: 1.8,
        reward: 75,
        color: 'purple',
        towerDamage: 35,
        attackRange: 70,
        attackCooldown: 600,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    shielded: {
        health: 100,
        speed: 1.5,
        reward: 50,
        color: 'green',
        towerDamage: 20,
        attackRange: 50,
        attackCooldown: 1000,
        shield: 3,
        maxShield: 3,
        hasShield: true,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    voltage: {
        health: 120,
        speed: 1.2,
        reward: 60,
        color: 'yellow',
        towerDamage: 25,
        attackRange: 60,
        attackCooldown: 800,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    worm: {
        health: 20,
        speed: 3.5,
        reward: 8,
        color: 'lime',
        towerDamage: 10,
        attackRange: 35,
        attackCooldown: 1500,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    replicator: {
        health: 100,
        speed: 1.0,
        reward: 80,
        color: 'pink',
        towerDamage: 30,
        attackRange: 70,
        attackCooldown: 1200,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    phoenix: {
        health: 140,
        speed: 2.0,
        reward: 100,
        color: 'gold',
        towerDamage: 25,
        attackRange: 65,
        attackCooldown: 1000,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    },
    portal_miner: {
        health: 80,
        speed: 2.0,
        reward: 50,
        color: 'violet',
        towerDamage: 18,
        attackRange: 55,
        attackCooldown: 1100,
        shield: 0,
        maxShield: 0,
        hasShield: false,
        slowEffect: 1,
        disabledUntil: 0,
        buffs: undefined
    }
}

export const GAME_CONFIG = {
    boardWidth: 950,
    boardHeight: 400,
    startHealth: 100,
    startCoins: 100,
    waveEnemyCount: 10,
    minTowerDistance: 45, // Minimum distance between towers
    spawnZoneWidth: 80, // Width of the safe spawn zone for enemies
    serverZoneWidth: 100, // Width of the protected server zone on the right
    serverDefenseDamage: 1.5, // Damage per second from server zone defensive systems
    serverDefenseInterval: 1000, // How often server defense attacks (milliseconds)

    // NEW: Advanced difficulty scaling configuration
    difficulty: {
        healthScalingBase: 0.15, // Base health scaling factor per wave
        speedScalingBase: 0.08, // Base speed scaling factor per wave
        rewardScalingBase: 0.05, // Base reward scaling factor per wave
        countScalingBase: 0.12, // Base enemy count scaling factor per wave
        fluctuationIntensity: 0.12, // Random variation intensity (±12%)
        scalingCap: 4.0, // Maximum scaling multiplier (prevents infinite growth)
        logarithmicBase: 25, // Base for logarithmic scaling (higher = slower progression)
        cyclePeriod: 8, // Waves between difficulty cycles
        plateauReduction: 0.7 // Scaling reduction during plateau periods
    },

    // Economy configuration
    economy: {
        basePassiveIncome: 5,
        waveCompletionBonus: 50,
        killBonusMultiplier: 1.3,
        interestRate: 0.02,
        interestInterval: 10_000, // milliseconds
        maxInterestBase: 1000, // Max coins that earn interest (prevents exponential growth)
        passiveIncomeLimit: 1000 // Passive income stops when player has more than this amount
    }
}

// Formation system
export const FORMATION_INFO: Record<Formation, { description: string; name: string }> = {
    ambush: {
        description: 'Enemies emerge from coordinated ambush points at different times',
        name: 'Ambush Strike'
    },
    flanking: {
        description: 'Enemies attack from top and bottom simultaneously',
        name: 'Pincer Attack'
    },
    group: {
        description: 'Enemies move in compact groups - vulnerable to area damage',
        name: 'Tight Formation'
    },
    line: {
        description: 'Enemies march in a straight line - predictable but concentrated damage',
        name: 'Single File'
    },
    pincer: {
        description: 'Enemies surround your defenses from multiple angles',
        name: 'Encirclement'
    },
    scattered: {
        description: 'Enemies spread across the battlefield - harder to defend against',
        name: 'Guerrilla Tactics'
    },
    waves: {
        description: 'Multiple waves with delays - sustained pressure',
        name: 'Wave Assault'
    }
}

// Formation count modifiers - how formations affect enemy spawn numbers
export const FORMATION_COUNT_MODIFIERS: Record<Formation, number> = {
    ambush: 1.3, // +30% enemies but delayed and strategic positioning
    line: 1.0, // Standard amount - predictable single file
    group: 1.2, // +20% enemies in tight groups (more vulnerable to chain lightning)
    scattered: 1.4, // +40% spread enemies (harder to defend against)
    flanking: 0.8, // -20% but coordinated top/bottom attack
    waves: 1.6, // +60% total but in separate waves with delays
    pincer: 0.9 // -10% but multi-angle strategic attack
}

export const WAVE_TYPES: Record<WaveType, WaveTypeConfig> = {
    standard: {
        type: 'standard',
        name: 'Standard Wave',
        description: 'Balanced enemy composition',
        countMultiplier: 1.0,
        healthMultiplier: 1.0
    },
    swarm: {
        type: 'swarm',
        name: 'Swarm Attack',
        description: 'Many weaker enemies - quantity over quality',
        countMultiplier: 1.8,
        healthMultiplier: 0.7
    },
    elite: {
        type: 'elite',
        name: 'Elite Squad',
        description: 'Fewer but stronger enemies - quality over quantity',
        countMultiplier: 0.8,
        healthMultiplier: 1.2
    },
    tsunami: {
        type: 'tsunami',
        name: 'Tsunami Attack',
        description: 'Massive enemy wave - requires wide coverage defense',
        countMultiplier: 3.0,
        healthMultiplier: 0.5
    }
}
