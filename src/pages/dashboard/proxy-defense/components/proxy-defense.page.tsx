/* eslint-disable no-nested-ternary */
/* eslint-disable indent */

import {
    IconBuilding,
    IconCoins,
    IconCurrencyDollar,
    IconFlame,
    IconHeart,
    IconHome,
    IconRefresh,
    IconShield,
    IconShieldCheck,
    IconSwords,
    IconTarget,
    IconTrendingUp,
    IconUsers
} from '@tabler/icons-react'
import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Button,
    ButtonGroup,
    Card,
    Container,
    Grid,
    Group,
    Modal,
    Paper,
    Progress,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PiWaveSawtooth } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { HiRefresh } from 'react-icons/hi'

import { MusicPlayer } from '@shared/ui/music-player/music-player.shared'
import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import classes from './ProxyDefense.module.css'

interface Enemy {
    buffs?: {
        healthBoost?: number // Health multiplier
        speedBoost?: number // Speed multiplier
    }
    disabledUntil?: number // Time until tower is disabled
    hasShield?: boolean
    health: number
    id: string
    isOriginal?: boolean // For replicators - only originals can create copies
    lastAttack: number
    maxHealth: number
    maxShield?: number // Maximum number of shield blocks
    originalSpeed?: number // original speed
    reward: number
    shield?: number // Number of remaining shield blocks
    slowEffect?: number // slowdown effect
    speed: number
    type: 'ddos' | 'hacker' | 'malware' | 'replicator' | 'shielded' | 'spider' | 'voltage'
    x: number
    y: number
}

interface Tower {
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

interface Explosion {
    duration: number
    id: string
    startTime: number
    type: 'enemy_death'
    x: number
    y: number
}

interface Lightning {
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
type GlobalEventType = 'data_flood' | 'disk_format'

interface GlobalEventConfig {
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

interface ActiveGlobalEvent {
    config: GlobalEventConfig
    duration: number
    startTime: number
    startWave: number
    type: GlobalEventType
}

interface GlobalEventSchedule {
    config: GlobalEventConfig
    scheduledWave: number
    type: GlobalEventType
}

interface GlobalEventsState {
    activeEvents: ActiveGlobalEvent[]
    lastEventWave: number
    scheduledEvents: GlobalEventSchedule[]
}

const GLOBAL_EVENT_CONFIGS: Record<GlobalEventType, GlobalEventConfig> = {
    disk_format: {
        type: 'disk_format',
        name: 'DISK FORMATTED',
        icon: '💽',
        description: 'All towers destroyed!',
        priority: 100, // Highest priority
        duration: 2000,
        minWaveInterval: 4,
        maxWaveInterval: 7,
        canCoexist: []
    },
    data_flood: {
        type: 'data_flood',
        name: 'DATA FLOOD',
        icon: '🌊',
        description: 'Double enemies, 40% weaker!',
        priority: 80,
        duration: 3000,
        minWaveInterval: 2,
        maxWaveInterval: 5,
        canCoexist: []
    }
}

class GlobalEventManager {
    static activateScheduledEvents(
        currentWave: number,
        eventsState: GlobalEventsState
    ): {
        activatedEvents: GlobalEventConfig[]
        eventsState: GlobalEventsState
    } {
        const newState = { ...eventsState }
        const activatedEvents: GlobalEventConfig[] = []

        // Find events scheduled for this wave
        const eventsToActivate = newState.scheduledEvents.filter(
            (event) => event.scheduledWave === currentWave
        )

        if (eventsToActivate.length === 0) {
            return { eventsState: newState, activatedEvents }
        }

        // Handle conflicts - sort by priority (higher = more important)
        eventsToActivate.sort((a, b) => b.config.priority - a.config.priority)

        for (const eventToActivate of eventsToActivate) {
            const canActivate = this.canEventActivate(eventToActivate.config, newState.activeEvents)

            if (canActivate) {
                // Activate the event
                newState.activeEvents.push({
                    type: eventToActivate.config.type,
                    startWave: currentWave,
                    startTime: Date.now(),
                    duration: eventToActivate.config.duration,
                    config: eventToActivate.config
                })

                activatedEvents.push(eventToActivate.config)
                newState.lastEventWave = currentWave

                // Remove higher priority events that can't coexist
                newState.activeEvents = newState.activeEvents.filter((activeEvent) => {
                    if (activeEvent.type === eventToActivate.config.type) return true
                    return (
                        eventToActivate.config.canCoexist.includes(activeEvent.type) ||
                        activeEvent.config.canCoexist.includes(eventToActivate.config.type)
                    )
                })
            } else {
                // Reschedule for later
                eventToActivate.scheduledWave = currentWave + 2
            }
        }

        // Remove activated events from scheduled
        newState.scheduledEvents = newState.scheduledEvents.filter(
            (event) => !activatedEvents.some((activated) => activated.type === event.type)
        )

        return { eventsState: newState, activatedEvents }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static applyEventEffects(eventType: GlobalEventType, gameState: GameState): Partial<GameState> {
        switch (eventType) {
            case 'data_flood': {
                // Effects applied in spawnWave and enemy logic
                return {}
            }

            case 'disk_format': {
                return { towers: [] }
            }

            default: {
                return {}
            }
        }
    }

    static getActiveEventMultipliers(eventsState: GlobalEventsState): {
        enemyCountMultiplier: number
        enemyHealthMultiplier: number
        enemySpeedMultiplier: number
    } {
        let enemyCountMultiplier = 1
        let enemyHealthMultiplier = 1
        const enemySpeedMultiplier = 1

        if (this.isEventActive('data_flood', eventsState)) {
            enemyCountMultiplier = 2
            enemyHealthMultiplier = 0.6 // 40% weaker
        }

        return {
            enemyCountMultiplier,
            enemyHealthMultiplier,
            enemySpeedMultiplier
        }
    }

    static isEventActive(eventType: GlobalEventType, eventsState: GlobalEventsState): boolean {
        const now = Date.now()
        return eventsState.activeEvents.some(
            (event) => event.type === eventType && now - event.startTime < event.duration
        )
    }

    static scheduleNextEvents(
        currentWave: number,
        eventsState: GlobalEventsState
    ): GlobalEventsState {
        const newState = { ...eventsState }

        // Remove completed events
        const now = Date.now()
        newState.activeEvents = newState.activeEvents.filter(
            (event) => now - event.startTime < event.duration
        )

        // Schedule events individually for each type to guarantee intervals
        Object.values(GLOBAL_EVENT_CONFIGS).forEach((eventConfig) => {
            // Check if this event type is already scheduled
            const hasScheduledEvent = newState.scheduledEvents.some(
                (scheduled) => scheduled.type === eventConfig.type
            )

            // Skip if already scheduled
            if (hasScheduledEvent) return

            // Find the last wave when this specific event type occurred
            const lastWaveForThisEvent = Math.max(
                // Last time this event was active
                ...newState.activeEvents
                    .filter((e) => e.type === eventConfig.type)
                    .map((e) => e.startWave),
                // Last time this event was scheduled
                ...newState.scheduledEvents
                    .filter((e) => e.type === eventConfig.type)
                    .map((e) => e.scheduledWave),
                // Fallback to global last event wave
                eventsState.lastEventWave || 0
            )

            const wavesSinceLastEvent = currentWave - lastWaveForThisEvent

            // Schedule if enough waves have passed for this specific event
            if (wavesSinceLastEvent >= eventConfig.minWaveInterval) {
                const waveOffset =
                    Math.floor(
                        Math.random() *
                            (eventConfig.maxWaveInterval - eventConfig.minWaveInterval + 1)
                    ) + eventConfig.minWaveInterval

                newState.scheduledEvents.push({
                    type: eventConfig.type,
                    scheduledWave: currentWave + waveOffset,
                    config: eventConfig
                })
            }
        })

        // Sort by wave
        newState.scheduledEvents.sort((a, b) => a.scheduledWave - b.scheduledWave)

        return newState
    }

    private static canEventActivate(
        eventConfig: GlobalEventConfig,
        activeEvents: ActiveGlobalEvent[]
    ): boolean {
        if (activeEvents.length === 0) return true

        // Check if any active event conflicts
        return activeEvents.every(
            (activeEvent) =>
                eventConfig.canCoexist.includes(activeEvent.type) ||
                activeEvent.config.canCoexist.includes(eventConfig.type)
        )
    }
}

interface GameState {
    coins: number
    coinsSpent: number
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
    totalCoinsEarned: number
    totalInterestEarned: number // Track total interest earned
    towers: Tower[]
    towersBuilt: number
    wave: number
}

const TOWER_TYPES = {
    firewall: { damage: 20, range: 80, cost: 50, cooldown: 1000, health: 100, color: 'blue' },
    antivirus: { damage: 15, range: 60, cost: 30, cooldown: 800, health: 60, color: 'teal' },
    proxy: { damage: 10, range: 100, cost: 25, cooldown: 600, health: 40, color: 'indigo' },
    slowdown: { damage: 5, range: 120, cost: 35, cooldown: 800, health: 50, color: 'cyan' },
    chain: { damage: 25, range: 90, cost: 60, cooldown: 1200, health: 70, color: 'purple' }
}

const ENEMY_TYPES = {
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
        // Note: Original replicators spawn with isOriginal: true and can create 2 copies on death
        // Copies have isOriginal: false and cannot replicate further
    }
}

const GAME_CONFIG = {
    boardWidth: 800,
    boardHeight: 400,
    startHealth: 100,
    startCoins: 100,
    waveEnemyCount: 5,
    minTowerDistance: 45, // Minimum distance between towers
    // Economy configuration
    economy: {
        basePassiveIncome: 5,
        waveCompletionBonus: 50,
        killBonusMultiplier: 1,
        interestRate: 0.02,
        interestInterval: 10_000, // milliseconds
        maxInterestBase: 1000, // Max coins that earn interest (prevents exponential growth)
        passiveIncomeLimit: 1000 // Passive income stops when player has more than this amount
    }
}

// Pixel art drawing functions
const drawFirewallTower = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    health: number,
    maxHealth: number
) => {
    const centerX = x + 15
    const centerY = y + 15

    // Base foundation
    ctx.fillStyle = '#444444'
    ctx.fillRect(centerX - 12, centerY + 8, 24, 6)

    // Main tower body (brick pattern)
    ctx.fillStyle = '#2E3F8F'
    ctx.fillRect(centerX - 10, centerY - 8, 20, 16)

    // Brick lines
    ctx.fillStyle = '#4A5BAF'
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(centerX - 10, centerY - 8 + i * 6, 20, 1)
        ctx.fillRect(centerX - 5, centerY - 8 + i * 6, 1, 6)
    }

    // Shield emblem
    ctx.fillStyle = '#FFD700'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 6)
    ctx.lineTo(centerX - 6, centerY)
    ctx.lineTo(centerX - 6, centerY + 4)
    ctx.lineTo(centerX, centerY + 8)
    ctx.lineTo(centerX + 6, centerY + 4)
    ctx.lineTo(centerX + 6, centerY)
    ctx.closePath()
    ctx.fill()

    // Shield highlight
    ctx.fillStyle = '#FFF8DC'
    ctx.fillRect(centerX - 4, centerY - 2, 8, 2)

    // Animated energy shield (if healthy)
    if (health > maxHealth * 0.7) {
        const alpha = 0.3 + 0.2 * Math.sin(Date.now() * 0.01)
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(centerX, centerY, 16, 0, Math.PI * 2)
        ctx.fill()
    }
}

const drawAntivirusTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15

    // Base
    ctx.fillStyle = '#2D5A27'
    ctx.fillRect(centerX - 8, centerY + 6, 16, 8)

    // Main body
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(centerX - 6, centerY - 4, 12, 10)

    // Tech details
    ctx.fillStyle = '#81C784'
    ctx.fillRect(centerX - 4, centerY - 2, 8, 1)
    ctx.fillRect(centerX - 4, centerY + 2, 8, 1)

    // Energy core
    ctx.fillStyle = '#00E676'
    ctx.fillRect(centerX - 2, centerY - 6, 4, 4)

    // Lightning bolt
    ctx.fillStyle = '#FFEB3B'
    ctx.beginPath()
    ctx.moveTo(centerX - 1, centerY - 6)
    ctx.lineTo(centerX + 2, centerY - 2)
    ctx.lineTo(centerX, centerY - 2)
    ctx.lineTo(centerX + 1, centerY + 2)
    ctx.lineTo(centerX - 2, centerY - 2)
    ctx.lineTo(centerX, centerY - 2)
    ctx.closePath()
    ctx.fill()

    // Animated energy rings
    const time = Date.now() * 0.005
    for (let i = 0; i < 3; i++) {
        const radius = 12 + i * 4 + Math.sin(time + i) * 2
        const alpha = 0.2 - i * 0.05
        ctx.strokeStyle = `rgba(76, 175, 80, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
    }
}

const drawProxyTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15

    // Base
    ctx.fillStyle = '#4A148C'
    ctx.fillRect(centerX - 8, centerY + 6, 16, 8)

    // Main body
    ctx.fillStyle = '#8E24AA'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Antenna
    ctx.fillStyle = '#E1BEE7'
    ctx.fillRect(centerX - 1, centerY - 8, 2, 6)

    // Antenna rings
    ctx.strokeStyle = '#BA68C8'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(centerX, centerY - 6, 2 + i * 2, 0, Math.PI * 2)
        ctx.stroke()
    }

    // Rotating proxy symbols
    const time = Date.now() * 0.01
    for (let i = 0; i < 4; i++) {
        const angle = time + (i * Math.PI) / 2
        const radius = 10
        const symX = centerX + Math.cos(angle) * radius
        const symY = centerY + Math.sin(angle) * radius

        ctx.fillStyle = '#CE93D8'
        ctx.fillRect(symX - 1, symY - 1, 2, 2)
    }

    // Data streams
    ctx.fillStyle = '#E1BEE7'
    const stream1 = Math.sin(time) * 4
    const stream2 = Math.sin(time + 1) * 4
    ctx.fillRect(centerX - 4, centerY + stream1, 8, 1)
    ctx.fillRect(centerX - 4, centerY + 2 + stream2, 8, 1)
}

const drawHackerEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(centerX - 8, centerY + 10, 16, 4)

    // Body
    ctx.fillStyle = '#424242'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Hood
    ctx.fillStyle = '#212121'
    ctx.fillRect(centerX - 8, centerY - 8, 16, 8)
    ctx.fillRect(centerX - 4, centerY - 10, 8, 4)

    // Face (eyes only)
    ctx.fillStyle = '#FF1744'
    ctx.fillRect(centerX - 4, centerY - 6, 2, 2)
    ctx.fillRect(centerX + 2, centerY - 6, 2, 2)

    // Laptop
    ctx.fillStyle = '#37474F'
    ctx.fillRect(centerX - 3, centerY + 2, 6, 4)

    // Screen glow
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(centerX - 2, centerY + 3, 4, 2)

    // Animated typing effect
    const time = Date.now() * 0.02
    if (Math.floor(time) % 2 === 0) {
        ctx.fillStyle = '#00E676'
        ctx.fillRect(centerX - 1, centerY + 4, 1, 1)
    }
}

const drawDDoSEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15

    // Core
    ctx.fillStyle = '#FF5722'
    ctx.fillRect(centerX - 4, centerY - 4, 8, 8)

    // Inner core
    ctx.fillStyle = '#FF8A65'
    ctx.fillRect(centerX - 2, centerY - 2, 4, 4)

    // Animated attack vectors
    const time = Date.now() * 0.01
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + time
        const length = 8 + Math.sin(time + i) * 4
        const endX = centerX + Math.cos(angle) * length
        const endY = centerY + Math.sin(angle) * length

        ctx.strokeStyle = '#FF5722'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Arrow heads
        ctx.fillStyle = '#FF1744'
        ctx.fillRect(endX - 1, endY - 1, 2, 2)
    }

    // Pulsing effect
    const pulseRadius = 12 + Math.sin(time * 2) * 4
    ctx.strokeStyle = `rgba(255, 87, 34, ${0.3 + Math.sin(time * 2) * 0.2})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.stroke()
}

const drawMalwareEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15

    // Worm body segments
    const time = Date.now() * 0.01
    const segments = 5

    for (let i = 0; i < segments; i++) {
        const segmentX = centerX + Math.sin(time + i * 0.5) * 4
        const segmentY = centerY + i * 2 - 4
        const size = 4 - i * 0.5

        // Segment body
        ctx.fillStyle = `hsl(${300 + i * 10}, 70%, ${60 - i * 5}%)`
        ctx.fillRect(segmentX - size, segmentY - size, size * 2, size * 2)

        // Segment highlight
        ctx.fillStyle = `hsl(${300 + i * 10}, 70%, ${80 - i * 5}%)`
        ctx.fillRect(segmentX - size + 1, segmentY - size + 1, size, 1)
    }

    // Head (first segment)
    ctx.fillStyle = '#E91E63'
    ctx.fillRect(centerX - 4, centerY - 4, 8, 8)

    // Eyes
    ctx.fillStyle = '#FF1744'
    ctx.fillRect(centerX - 3, centerY - 3, 2, 2)
    ctx.fillRect(centerX + 1, centerY - 3, 2, 2)

    // Mouth
    ctx.fillStyle = '#B71C1C'
    ctx.fillRect(centerX - 2, centerY, 4, 2)

    // Corruption effect
    for (let i = 0; i < 3; i++) {
        const corruptX = centerX + (Math.random() - 0.5) * 16
        const corruptY = centerY + (Math.random() - 0.5) * 16
        ctx.fillStyle = `rgba(233, 30, 99, ${0.3 + Math.random() * 0.3})`
        ctx.fillRect(corruptX, corruptY, 1, 1)
    }
}

const drawSpiderEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 25 // Larger center offset for bigger sprite
    const centerY = y + 25

    // Shadow (larger)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(centerX - 16, centerY + 18, 32, 8)

    // Spider body segments
    const time = Date.now() * 0.008

    // Abdomen (back part)
    ctx.fillStyle = '#4A148C'
    ctx.fillRect(centerX - 8, centerY + 2, 16, 12)
    ctx.fillStyle = '#6A1B9A'
    ctx.fillRect(centerX - 6, centerY + 4, 12, 8)

    // Thorax (middle part)
    ctx.fillStyle = '#7B1FA2'
    ctx.fillRect(centerX - 6, centerY - 4, 12, 8)
    ctx.fillStyle = '#8E24AA'
    ctx.fillRect(centerX - 4, centerY - 2, 8, 4)

    // Head (front part)
    ctx.fillStyle = '#9C27B0'
    ctx.fillRect(centerX - 4, centerY - 8, 8, 6)

    // Eyes (multiple, spider-like)
    ctx.fillStyle = '#FF1744'
    ctx.fillRect(centerX - 3, centerY - 7, 2, 2)
    ctx.fillRect(centerX + 1, centerY - 7, 2, 2)
    ctx.fillRect(centerX - 1, centerY - 5, 2, 2)

    // Fangs
    ctx.fillStyle = '#FFF'
    ctx.fillRect(centerX - 2, centerY - 4, 1, 2)
    ctx.fillRect(centerX + 1, centerY - 4, 1, 2)

    // Spider legs (8 legs, 4 on each side)
    const legPositions = [
        { side: -1, offset: -6 },
        { side: -1, offset: -2 },
        { side: -1, offset: 2 },
        { side: -1, offset: 6 },
        { side: 1, offset: -6 },
        { side: 1, offset: -2 },
        { side: 1, offset: 2 },
        { side: 1, offset: 6 }
    ]

    legPositions.forEach((leg, i) => {
        const legTime = time + i * 0.5
        const legSway = Math.sin(legTime) * 3
        const legLength = 12 + Math.sin(legTime * 2) * 2

        // Upper leg segment
        ctx.fillStyle = '#8E24AA'
        ctx.fillRect(
            centerX + leg.side * 8,
            centerY + leg.offset + legSway,
            leg.side * legLength * 0.6,
            2
        )

        // Lower leg segment
        ctx.fillStyle = '#7B1FA2'
        ctx.fillRect(
            centerX + leg.side * (8 + legLength * 0.6),
            centerY + leg.offset + legSway + 2,
            leg.side * legLength * 0.4,
            2
        )
    })

    // Web pattern on abdomen
    ctx.strokeStyle = '#E1BEE7'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(centerX - 6, centerY + 4)
    ctx.lineTo(centerX + 6, centerY + 4)
    ctx.moveTo(centerX - 6, centerY + 8)
    ctx.lineTo(centerX + 6, centerY + 8)
    ctx.moveTo(centerX - 4, centerY + 2)
    ctx.lineTo(centerX - 4, centerY + 10)
    ctx.moveTo(centerX + 4, centerY + 2)
    ctx.lineTo(centerX + 4, centerY + 10)
    ctx.stroke()

    // Pulsing danger aura
    const pulseRadius = 20 + Math.sin(time * 3) * 4
    ctx.strokeStyle = `rgba(156, 39, 176, ${0.4 + Math.sin(time * 3) * 0.3})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Venom drip effect
    if (Math.floor(time * 4) % 3 === 0) {
        ctx.fillStyle = '#76FF03'
        ctx.fillRect(centerX - 1, centerY - 3, 2, 4)
    }
}

const drawSpiderAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.5

    // Spider web attack - creates web strands
    const segments = 6
    const points: { x: number; y: number }[] = []

    points.push({ x: fromX, y: fromY })

    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // Web-like pattern - sticky and curved
        const waveOffset = Math.sin(t * Math.PI * 2) * 8
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
            const normalizedPerpX = perpX / perpLength
            const normalizedPerpY = perpY / perpLength

            points.push({
                x: baseX + normalizedPerpX * waveOffset,
                y: baseY + normalizedPerpY * waveOffset
            })
        }
    }

    points.push({ x: toX, y: toY })

    // Draw main web strand
    ctx.strokeStyle = `rgba(156, 39, 176, ${alpha})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Draw secondary web strands
    for (let strand = 0; strand < 3; strand++) {
        const offset = (strand - 1) * 6
        ctx.strokeStyle = `rgba(156, 39, 176, ${alpha * (0.6 - strand * 0.2)})`
        ctx.lineWidth = 2 - strand * 0.5
        ctx.beginPath()
        ctx.moveTo(fromX + offset, fromY)
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x + offset, points[i].y)
        }
        ctx.stroke()
    }

    // Add venom drops
    for (let i = 0; i < 4; i++) {
        const dropX = fromX + (toX - fromX) * (0.2 + i * 0.2)
        const dropY = fromY + (toY - fromY) * (0.2 + i * 0.2)
        ctx.fillStyle = `rgba(118, 255, 3, ${alpha * 0.8})`
        ctx.fillRect(dropX - 1, dropY - 1, 2, 2)
    }
}

const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) => {
    const explosionCenterX = x
    const explosionCenterY = y

    // Simple explosion for debugging
    const explosionSize = progress * 30
    const alpha = 1 - progress

    // Bright white core
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.fillRect(
        explosionCenterX - explosionSize / 2,
        explosionCenterY - explosionSize / 2,
        explosionSize,
        explosionSize
    )

    // Orange fire ring
    ctx.fillStyle = `rgba(255, 165, 0, ${alpha * 0.8})`
    ctx.fillRect(
        explosionCenterX - explosionSize / 3,
        explosionCenterY - explosionSize / 3,
        explosionSize * 0.66,
        explosionSize * 0.66
    )

    // Red outer ring
    ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.6})`
    ctx.fillRect(
        explosionCenterX - explosionSize * 0.4,
        explosionCenterY - explosionSize * 0.4,
        explosionSize * 0.8,
        explosionSize * 0.8
    )

    // Fire particles in a circle
    const particleCount = 8
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        const distance = explosionSize * 0.8
        const particleX = explosionCenterX + Math.cos(angle) * distance
        const particleY = explosionCenterY + Math.sin(angle) * distance

        const particleSize = (1 - progress) * 4
        ctx.fillStyle = `rgba(255, 100, 0, ${alpha * 0.9})`
        ctx.fillRect(
            particleX - particleSize / 2,
            particleY - particleSize / 2,
            particleSize,
            particleSize
        )
    }
}

const drawLightning = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number,
    towerType: Tower['type']
) => {
    const alpha = 1 - progress * 0.7

    // Calculate lightning path with some randomness
    const segments = 8
    const points: { x: number; y: number }[] = []

    // Start point
    points.push({ x: fromX, y: fromY })

    // Generate intermediate points with some randomness
    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // Add some randomness perpendicular to the line
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)
        const normalizedPerpX = perpX / perpLength
        const normalizedPerpY = perpY / perpLength

        const randomOffset = (Math.random() - 0.5) * 15
        points.push({
            x: baseX + normalizedPerpX * randomOffset,
            y: baseY + normalizedPerpY * randomOffset
        })
    }

    // End point
    points.push({ x: toX, y: toY })

    // Draw lightning based on tower type
    let lightningColor
    switch (towerType) {
        case 'antivirus':
            lightningColor = `rgba(0, 255, 100, ${alpha})`
            break
        case 'firewall':
            lightningColor = `rgba(0, 150, 255, ${alpha})`
            break
        case 'proxy':
            lightningColor = `rgba(200, 100, 255, ${alpha})`
            break
        default:
            lightningColor = `rgba(255, 255, 255, ${alpha})`
    }

    // Draw main lightning bolt
    ctx.strokeStyle = lightningColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Draw inner bright core
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()
}

const drawHackerAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.5

    // Digital corruption effect - more chaotic path
    const segments = 12
    const points: { x: number; y: number }[] = []

    points.push({ x: fromX, y: fromY })

    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // More aggressive randomness for hacker attacks
        const randomOffset = (Math.random() - 0.5) * 25
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
            const normalizedPerpX = perpX / perpLength
            const normalizedPerpY = perpY / perpLength

            points.push({
                x: baseX + normalizedPerpX * randomOffset,
                y: baseY + normalizedPerpY * randomOffset
            })
        }
    }

    points.push({ x: toX, y: toY })

    // Draw red hacker lightning with digital glitches
    ctx.strokeStyle = `rgba(255, 50, 50, ${alpha})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Add digital glitch effects
    for (let i = 0; i < 5; i++) {
        const glitchX = fromX + (toX - fromX) * Math.random()
        const glitchY = fromY + (toY - fromY) * Math.random()
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.6})`
        ctx.fillRect(glitchX - 2, glitchY - 1, 4, 2)
    }
}

const drawDDoSAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.6

    // Multiple lightning bolts for DDoS effect
    const bolts = 3

    for (let bolt = 0; bolt < bolts; bolt++) {
        const offset = (bolt - 1) * 8 // Spread bolts apart
        const segments = 6
        const points: { x: number; y: number }[] = []

        points.push({ x: fromX + offset, y: fromY })

        for (let i = 1; i < segments; i++) {
            const t = i / segments
            const baseX = fromX + offset + (toX - fromX) * t
            const baseY = fromY + (toY - fromY) * t

            const randomOffset = (Math.random() - 0.5) * 12
            const perpX = -(toY - fromY)
            const perpY = toX - fromX
            const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

            if (perpLength > 0) {
                const normalizedPerpX = perpX / perpLength
                const normalizedPerpY = perpY / perpLength

                points.push({
                    x: baseX + normalizedPerpX * randomOffset,
                    y: baseY + normalizedPerpY * randomOffset
                })
            }
        }

        points.push({ x: toX + offset, y: toY })

        // Draw orange DDoS lightning
        ctx.strokeStyle = `rgba(255, 140, 0, ${alpha * (0.8 - bolt * 0.2)})`
        ctx.lineWidth = 2 - bolt * 0.3
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.stroke()
    }
}

const drawMalwareAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.4

    // Organic, virus-like path
    const segments = 10
    const points: { x: number; y: number }[] = []

    points.push({ x: fromX, y: fromY })

    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // Sinusoidal pattern for organic feel
        const waveOffset = Math.sin(t * Math.PI * 3) * 10
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
            const normalizedPerpX = perpX / perpLength
            const normalizedPerpY = perpY / perpLength

            points.push({
                x: baseX + normalizedPerpX * waveOffset,
                y: baseY + normalizedPerpY * waveOffset
            })
        }
    }

    points.push({ x: toX, y: toY })

    // Draw dark purple malware lightning
    ctx.strokeStyle = `rgba(150, 50, 150, ${alpha})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Add corruption particles
    for (let i = 0; i < 3; i++) {
        const corruptX = fromX + (toX - fromX) * (0.3 + i * 0.2)
        const corruptY = fromY + (toY - fromY) * (0.3 + i * 0.2)
        ctx.fillStyle = `rgba(200, 50, 200, ${alpha * 0.7})`
        ctx.fillRect(corruptX - 1, corruptY - 1, 2, 2)
    }
}

// functions for drawing enemies (definitions before use)
const drawShieldedEnemy = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    shield: number,
    maxShield: number
) => {
    const centerX = x + 15
    const centerY = y + 15

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(centerX - 8, centerY + 10, 16, 4)

    // Main body
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Arms/weapons
    ctx.fillStyle = '#2E7D32'
    ctx.fillRect(centerX - 8, centerY, 4, 4)
    ctx.fillRect(centerX + 4, centerY, 4, 4)

    // Head
    ctx.fillStyle = '#66BB6A'
    ctx.fillRect(centerX - 4, centerY - 6, 8, 6)

    // Eyes
    ctx.fillStyle = '#1976D2'
    ctx.fillRect(centerX - 3, centerY - 5, 2, 2)
    ctx.fillRect(centerX + 1, centerY - 5, 2, 2)

    // Shield effect
    if (shield > 0) {
        const shieldAlpha = (shield / maxShield) * 0.8 + 0.2
        const shieldRadius = 18 + Math.sin(Date.now() * 0.005) * 2

        // Shield barrier
        ctx.strokeStyle = `rgba(33, 150, 243, ${shieldAlpha})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(centerX, centerY, shieldRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Shield segments
        for (let i = 0; i < shield; i++) {
            const angle = (i / maxShield) * Math.PI * 2
            const x1 = centerX + Math.cos(angle) * (shieldRadius - 2)
            const y1 = centerY + Math.sin(angle) * (shieldRadius - 2)
            const x2 = centerX + Math.cos(angle) * (shieldRadius + 2)
            const y2 = centerY + Math.sin(angle) * (shieldRadius + 2)

            ctx.strokeStyle = '#2196F3'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }
    }
}

const drawVoltageEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.01

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(centerX - 8, centerY + 10, 16, 4)

    // Main body - electric core
    ctx.fillStyle = '#FFC107'
    ctx.fillRect(centerX - 6, centerY - 4, 12, 8)

    // Inner energy core
    ctx.fillStyle = '#FF9800'
    ctx.fillRect(centerX - 4, centerY - 2, 8, 4)

    // Electric arcs
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + time
        const radius = 12 + Math.sin(time * 3 + i) * 4
        const endX = centerX + Math.cos(angle) * radius
        const endY = centerY + Math.sin(angle) * radius

        ctx.strokeStyle = '#FFEB3B'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Spark effects
        ctx.fillStyle = '#FFF176'
        ctx.fillRect(endX - 1, endY - 1, 2, 2)
    }

    // Pulsing electric field
    const pulseRadius = 16 + Math.sin(time * 4) * 3
    ctx.strokeStyle = `rgba(255, 235, 59, ${0.4 + Math.sin(time * 4) * 0.3})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Central lightning bolt
    ctx.fillStyle = '#FFEB3B'
    ctx.beginPath()
    ctx.moveTo(centerX - 2, centerY - 6)
    ctx.lineTo(centerX + 1, centerY - 2)
    ctx.lineTo(centerX - 1, centerY - 2)
    ctx.lineTo(centerX + 2, centerY + 2)
    ctx.lineTo(centerX - 1, centerY - 2)
    ctx.lineTo(centerX + 1, centerY - 2)
    ctx.closePath()
    ctx.fill()
}

const drawReplicatorEnemy = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isOriginal: boolean = true
) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.008

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(centerX - 8, centerY + 10, 16, 4)

    // Main body - darker for copies
    ctx.fillStyle = isOriginal ? '#E91E63' : '#AD1457'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Replication chambers - darker for copies
    ctx.fillStyle = isOriginal ? '#C2185B' : '#8E0038'
    ctx.fillRect(centerX - 8, centerY - 1, 3, 6)
    ctx.fillRect(centerX + 5, centerY - 1, 3, 6)

    // Head/control unit - darker for copies
    ctx.fillStyle = isOriginal ? '#F06292' : '#C2185B'
    ctx.fillRect(centerX - 4, centerY - 6, 8, 6)

    // Scanning eyes
    ctx.fillStyle = '#FF1744'
    for (let i = 0; i < 3; i++) {
        const eyeX = centerX - 3 + i * 3
        ctx.fillRect(eyeX, centerY - 5, 1, 1)
    }

    // Replication energy fields
    for (let i = 0; i < 4; i++) {
        const angle = time + (i * Math.PI) / 2
        const radius = 10 + Math.sin(time * 2 + i) * 3
        const fieldX = centerX + Math.cos(angle) * radius
        const fieldY = centerY + Math.sin(angle) * radius

        ctx.fillStyle = `rgba(233, 30, 99, ${0.5 + Math.sin(time * 3 + i) * 0.3})`
        ctx.fillRect(fieldX - 2, fieldY - 2, 4, 4)
    }

    // DNA helix effect
    for (let i = 0; i < 8; i++) {
        const helixY = centerY - 4 + i
        const helixX1 = centerX + Math.sin(time + i * 0.5) * 4
        const helixX2 = centerX + Math.sin(time + i * 0.5 + Math.PI) * 4

        ctx.fillStyle = '#FF4081'
        ctx.fillRect(helixX1 - 0.5, helixY, 1, 1)
        ctx.fillRect(helixX2 - 0.5, helixY, 1, 1)
    }
}

// functions for drawing towers (definitions before use)
const drawSlowdownTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.003

    // Base
    ctx.fillStyle = '#006064'
    ctx.fillRect(centerX - 8, centerY + 6, 16, 8)

    // Main body
    ctx.fillStyle = '#00BCD4'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Freeze chamber
    ctx.fillStyle = '#B3E5FC'
    ctx.fillRect(centerX - 4, centerY - 6, 8, 6)

    // Ice crystals
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + time
        const crystalX = centerX + Math.cos(angle) * 8
        const crystalY = centerY + Math.sin(angle) * 8

        ctx.fillStyle = '#E1F5FE'
        ctx.fillRect(crystalX - 1, crystalY - 1, 2, 2)
    }

    // Frost waves
    for (let i = 0; i < 3; i++) {
        const radius = 15 + i * 8 + Math.sin(time + i) * 3
        const alpha = 0.3 - i * 0.1
        ctx.strokeStyle = `rgba(0, 188, 212, ${alpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
    }

    // Central snowflake
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 4)
    ctx.lineTo(centerX, centerY + 4)
    ctx.moveTo(centerX - 4, centerY)
    ctx.lineTo(centerX + 4, centerY)
    ctx.moveTo(centerX - 3, centerY - 3)
    ctx.lineTo(centerX + 3, centerY + 3)
    ctx.moveTo(centerX - 3, centerY + 3)
    ctx.lineTo(centerX + 3, centerY - 3)
    ctx.stroke()
}

const drawChainTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.01

    // Base
    ctx.fillStyle = '#4A148C'
    ctx.fillRect(centerX - 8, centerY + 6, 16, 8)

    // Main body
    ctx.fillStyle = '#9C27B0'
    ctx.fillRect(centerX - 6, centerY - 2, 12, 8)

    // Tesla coil top
    ctx.fillStyle = '#E1BEE7'
    ctx.fillRect(centerX - 1, centerY - 8, 2, 6)

    // Coil rings
    for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = '#BA68C8'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(centerX, centerY - 6 + i, 2 + i, 0, Math.PI * 2)
        ctx.stroke()
    }

    // Chain lightning connections
    for (let i = 0; i < 3; i++) {
        const angle = time + (i * Math.PI * 2) / 3
        const radius = 12
        const endX = centerX + Math.cos(angle) * radius
        const endY = centerY + Math.sin(angle) * radius

        // Lightning bolt
        ctx.strokeStyle = '#E91E63'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)

        // Zigzag pattern
        const segments = 4
        for (let j = 1; j <= segments; j++) {
            const t = j / segments
            const midX = centerX + (endX - centerX) * t
            const midY = centerY + (endY - centerY) * t
            const offset = (j % 2 === 0 ? 1 : -1) * 3
            ctx.lineTo(midX + offset, midY + offset)
        }
        ctx.stroke()

        // Connection point
        ctx.fillStyle = '#FF4081'
        ctx.fillRect(endX - 1, endY - 1, 2, 2)
    }

    // Energy core
    ctx.fillStyle = '#AD7FFF'
    ctx.fillRect(centerX - 2, centerY - 2, 4, 4)

    // Core pulse
    const pulseSize = 2 + Math.sin(time * 4) * 1
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(centerX - pulseSize / 2, centerY - pulseSize / 2, pulseSize, pulseSize)
}

const drawEnemyAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number,
    enemyType: Enemy['type']
) => {
    switch (enemyType) {
        case 'ddos':
            drawDDoSAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'hacker':
            drawHackerAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'malware':
            drawMalwareAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'spider':
            drawSpiderAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        default:
            break
    }
}

// Enemy Sprite for information panel (same as in game)
const EnemyInfoSprite = ({ type }: { type: Enemy['type'] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const spriteSize = type === 'spider' ? 50 : 30 // Same size as in game

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, spriteSize, spriteSize)

        // Create a mock enemy with default stats for rendering
        const mockEnemy = {
            ...ENEMY_TYPES[type],
            id: `mock-${type}`,
            x: spriteSize / 2,
            y: spriteSize / 2,
            lastAttack: 0,
            shield: ENEMY_TYPES[type].shield,
            maxShield: ENEMY_TYPES[type].maxShield,
            hasShield: ENEMY_TYPES[type].hasShield,
            slowEffect: 1,
            originalSpeed: ENEMY_TYPES[type].speed,
            buffs: undefined,
            isOriginal: type === 'replicator' ? true : undefined
        }

        // Draw enemy based on type (same functions as in game)
        switch (type) {
            case 'ddos':
                drawDDoSEnemy(ctx, 0, 0)
                break
            case 'hacker':
                drawHackerEnemy(ctx, 0, 0)
                break
            case 'malware':
                drawMalwareEnemy(ctx, 0, 0)
                break
            case 'replicator':
                drawReplicatorEnemy(ctx, 0, 0, mockEnemy.isOriginal ?? true)
                break
            case 'shielded':
                drawShieldedEnemy(ctx, 0, 0, mockEnemy.shield, mockEnemy.maxShield)
                break
            case 'spider':
                drawSpiderEnemy(ctx, 0, 0)
                break
            case 'voltage':
                drawVoltageEnemy(ctx, 0, 0)
                break
            default:
                break
        }
    }, [type, spriteSize])

    return (
        <canvas
            height={spriteSize}
            ref={canvasRef}
            style={{
                imageRendering: 'pixelated'
            }}
            width={spriteSize}
        />
    )
}

// Tower Sprite for information panel (same as in game)
const TowerInfoSprite = ({ type }: { type: Tower['type'] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const spriteSize = 30 // Same size as in game

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, spriteSize, spriteSize)

        // Create a mock tower with default stats for rendering
        const mockTower = {
            ...TOWER_TYPES[type],
            id: `mock-${type}`,
            x: spriteSize / 2,
            y: spriteSize / 2,
            lastShot: 0,
            type,
            maxHealth: TOWER_TYPES[type].health,
            health: TOWER_TYPES[type].health,
            damage: TOWER_TYPES[type].damage,
            range: TOWER_TYPES[type].range,
            cost: TOWER_TYPES[type].cost,
            cooldown: TOWER_TYPES[type].cooldown,
            disabledUntil: undefined,
            slowdownEffect: type === 'slowdown' ? 0.4 : undefined,
            chainTargets: type === 'chain' ? 2 : undefined
        }

        // Draw tower based on type (same functions as in game)
        switch (type) {
            case 'antivirus':
                drawAntivirusTower(ctx, 0, 0)
                break
            case 'chain':
                drawChainTower(ctx, 0, 0)
                break
            case 'firewall':
                drawFirewallTower(ctx, 0, 0, mockTower.health, mockTower.maxHealth)
                break
            case 'proxy':
                drawProxyTower(ctx, 0, 0)
                break
            case 'slowdown':
                drawSlowdownTower(ctx, 0, 0)
                break
            default:
                break
        }
    }, [type, spriteSize])

    return (
        <canvas
            height={spriteSize}
            ref={canvasRef}
            style={{
                imageRendering: 'pixelated'
            }}
            width={spriteSize}
        />
    )
}

// Canvas components
const TowerSprite = ({ tower }: { tower: Tower }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, 30, 30)

        // Draw tower based on type
        switch (tower.type) {
            case 'antivirus':
                drawAntivirusTower(ctx, 0, 0)
                break
            case 'chain':
                drawChainTower(ctx, 0, 0)
                break
            case 'firewall':
                drawFirewallTower(ctx, 0, 0, tower.health, tower.maxHealth)
                break
            case 'proxy':
                drawProxyTower(ctx, 0, 0)
                break
            case 'slowdown':
                drawSlowdownTower(ctx, 0, 0)
                break
            default:
                break
        }
    }, [tower.type, tower.health, tower.maxHealth])

    return (
        <canvas
            height={30}
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: tower.x - 15,
                top: tower.y - 15,
                opacity: tower.health <= 0 ? 0.3 : 1,
                imageRendering: 'pixelated'
            }}
            width={30}
        />
    )
}

const EnemySprite = ({ enemy }: { enemy: Enemy }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const spriteSize = enemy.type === 'spider' ? 50 : 30 // Larger sprite for spider

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, spriteSize, spriteSize)

        // Draw enemy based on type
        switch (enemy.type) {
            case 'ddos':
                drawDDoSEnemy(ctx, 0, 0)
                break
            case 'hacker':
                drawHackerEnemy(ctx, 0, 0)
                break
            case 'malware':
                drawMalwareEnemy(ctx, 0, 0)
                break
            case 'replicator':
                drawReplicatorEnemy(ctx, 0, 0, enemy.isOriginal ?? true)
                break
            case 'shielded':
                drawShieldedEnemy(ctx, 0, 0, enemy.shield || 0, enemy.maxShield || 0)
                break
            case 'spider':
                drawSpiderEnemy(ctx, 0, 0)
                break
            case 'voltage':
                drawVoltageEnemy(ctx, 0, 0)
                break
            default:
                break
        }
    }, [
        enemy.type,
        enemy.health,
        enemy.maxHealth,
        enemy.shield,
        enemy.maxShield,
        enemy.isOriginal,
        spriteSize
    ])

    return (
        <canvas
            height={spriteSize}
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: enemy.x - spriteSize / 2,
                top: enemy.y - spriteSize / 2,
                imageRendering: 'pixelated'
            }}
            width={spriteSize}
        />
    )
}

const ExplosionSprite = ({ explosion }: { explosion: Explosion }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, 80, 80)

            // Calculate explosion progress (0 to 1)
            const elapsed = Date.now() - explosion.startTime
            const progress = Math.min(elapsed / explosion.duration, 1)

            // Draw explosion
            drawExplosion(ctx, 25, 25, progress)

            // Continue animation if explosion is not finished
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        // Start animation
        animate()

        // Cleanup

        // eslint-disable-next-line consistent-return
        return () => {
            if (animationRef.current !== undefined) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [explosion.startTime, explosion.duration])

    return (
        <canvas
            height={80}
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: explosion.x - 40,
                top: explosion.y - 40,
                imageRendering: 'pixelated',
                pointerEvents: 'none'
            }}
            width={80}
        />
    )
}

const HealthBar = ({
    health,
    maxHealth,
    x,
    y,
    isEnemy = false
}: {
    health: number
    isEnemy?: boolean
    maxHealth: number
    x: number
    y: number
}) => {
    // Make health bar wider for spider
    const barWidth = isEnemy && maxHealth > 100 ? 60 : 40
    const barHeight = isEnemy && maxHealth > 100 ? 6 : 4
    const offsetY = isEnemy ? (maxHealth > 100 ? -28 : -23) : -25

    return (
        <div
            style={{
                position: 'absolute',
                top: y + offsetY,
                left: x - barWidth / 2,
                width: barWidth,
                height: barHeight,
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: 2
            }}
        >
            <div
                style={{
                    height: '100%',
                    backgroundColor: isEnemy
                        ? maxHealth > 100
                            ? 'purple'
                            : 'red' // Purple for spider
                        : health > maxHealth * 0.5
                          ? 'green'
                          : health > maxHealth * 0.25
                            ? 'yellow'
                            : 'red',
                    borderRadius: 2,
                    width: `${Math.max(0, (health / maxHealth) * 100)}%`,
                    transition: 'width 0.3s ease'
                }}
            />
        </div>
    )
}

// Aura component for showing tower range
const TowerAura = ({ tower }: { tower: Tower }) => {
    const { range } = TOWER_TYPES[tower.type]
    const auraColor = TOWER_TYPES[tower.type].color

    return (
        <div
            style={{
                position: 'absolute',
                left: tower.x - range,
                top: tower.y - range,
                width: range * 2,
                height: range * 2,
                borderRadius: '50%',
                border: `2px solid ${auraColor}`,
                backgroundColor:
                    auraColor === 'blue'
                        ? 'rgba(0, 100, 255, 0.1)'
                        : auraColor === 'teal'
                          ? 'rgba(0, 255, 100, 0.1)'
                          : 'rgba(200, 100, 255, 0.1)',
                pointerEvents: 'none',
                opacity: 0.6
            }}
        />
    )
}

// Compact Health Indicator for game area
const HealthIndicator = ({ health, isShaking }: { health: number; isShaking: boolean }) => {
    const healthColor = health > 70 ? '#00b894' : health > 30 ? '#fdcb6e' : '#e84393'
    const isLowHealth = health <= 30

    return (
        <div
            style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                pointerEvents: 'none',
                animation: isShaking ? 'shake 0.5s' : undefined
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `2px solid ${healthColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isLowHealth ? `0 0 15px ${healthColor}` : '0 2px 8px rgba(0,0,0,0.3)'
                }}
            >
                <IconHeart
                    color={healthColor}
                    size={16}
                    style={{
                        filter: isLowHealth ? 'drop-shadow(0 0 4px #e84393)' : undefined,
                        animation: isLowHealth ? 'pulse 1s infinite' : undefined
                    }}
                />
                <Text
                    ff="monospace"
                    fw={700}
                    size="sm"
                    style={{
                        color: healthColor,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                >
                    {Math.floor(health).toString().padStart(3, '0')}
                </Text>
            </div>
        </div>
    )
}

const CoinsIndicator = ({ coins, isShaking }: { coins: number; isShaking: boolean }) => {
    const isPassiveDisabled = coins > GAME_CONFIG.economy.passiveIncomeLimit
    const isLowCoins = coins <= 30

    // Color logic: red if passive disabled, normal colors otherwise
    const coinsColor = isPassiveDisabled
        ? '#e74c3c' // Red when passive income is disabled
        : coins > 70
          ? '#fdcb6e'
          : coins > 30
            ? '#fdcb6e'
            : '#e84393'

    return (
        <div
            style={{
                position: 'absolute',
                top: 10,
                right: 100,
                zIndex: 10,
                pointerEvents: 'none',
                animation: isShaking ? 'shake 0.5s' : undefined
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `2px solid ${coinsColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow:
                        isLowCoins || isPassiveDisabled
                            ? `0 0 15px ${coinsColor}`
                            : '0 2px 8px rgba(0,0,0,0.3)'
                }}
            >
                <IconCoins
                    color={coinsColor}
                    size={16}
                    style={{
                        filter:
                            isLowCoins || isPassiveDisabled
                                ? 'drop-shadow(0 0 4px #e84393)'
                                : undefined,
                        animation: isLowCoins || isPassiveDisabled ? 'pulse 1s infinite' : undefined
                    }}
                />
                <Text
                    ff="monospace"
                    fw={700}
                    size="sm"
                    style={{
                        color: coinsColor,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                >
                    {coins.toString().padStart(4, '0')}
                </Text>
            </div>
        </div>
    )
}

const WaveIndicator = ({ waveNumber }: { waveNumber: number }) => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 10,
                right: 200,
                zIndex: 10,
                pointerEvents: 'none'
            }}
        >
            <div
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `2px solid var(--mantine-color-indigo-6)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: `0 0 15px var(--mantine-color-indigo-9)`
                }}
            >
                <PiWaveSawtooth
                    color="var(--mantine-color-indigo-6)"
                    size={16}
                    style={{
                        filter: 'drop-shadow(0 0 4px #e84393)',
                        animation: 'pulse 1s infinite'
                    }}
                />
                <Text
                    ff="monospace"
                    fw={700}
                    size="sm"
                    style={{
                        color: 'var(--mantine-color-indigo-6)',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                >
                    {waveNumber.toString().padStart(4, '0')}
                </Text>
            </div>
        </div>
    )
}

// Lightning component
const LightningSprite = ({ lightning }: { lightning: Lightning }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const animate = () => {
            // Clear canvas
            ctx.clearRect(0, 0, 800, 400)

            // Calculate lightning progress (0 to 1)
            const elapsed = Date.now() - lightning.startTime
            const progress = Math.min(elapsed / lightning.duration, 1)

            // Draw lightning based on type
            if (lightning.isEnemyAttack && lightning.enemyType) {
                drawEnemyAttack(
                    ctx,
                    lightning.fromX,
                    lightning.fromY,
                    lightning.toX,
                    lightning.toY,
                    progress,
                    lightning.enemyType
                )
            } else if (lightning.towerType) {
                drawLightning(
                    ctx,
                    lightning.fromX,
                    lightning.fromY,
                    lightning.toX,
                    lightning.toY,
                    progress,
                    lightning.towerType
                )
            }

            // Continue animation if lightning is not finished
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        // Start animation
        animate()

        // Cleanup

        // eslint-disable-next-line consistent-return
        return () => {
            if (animationRef.current !== undefined) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [
        lightning.startTime,
        lightning.duration,
        lightning.fromX,
        lightning.fromY,
        lightning.toX,
        lightning.toY,
        lightning.towerType
    ])

    return (
        <canvas
            height={400}
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                imageRendering: 'pixelated',
                pointerEvents: 'none'
            }}
            width={800}
        />
    )
}

const TowerExclusionZone = ({ tower }: { tower: Tower }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: tower.x - GAME_CONFIG.minTowerDistance,
                top: tower.y - GAME_CONFIG.minTowerDistance,
                width: GAME_CONFIG.minTowerDistance * 2,
                height: GAME_CONFIG.minTowerDistance * 2,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                border: '2px solid rgba(255, 0, 0, 0.3)',
                pointerEvents: 'none',
                opacity: 0.7
            }}
        />
    )
}

const BuildingGuide = ({ x, y, isValid }: { isValid: boolean; x: number; y: number }) => {
    return (
        <div
            style={{
                position: 'absolute',
                left: x - 20,
                top: y - 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: isValid ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                border: `2px solid ${isValid ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)'}`,
                pointerEvents: 'none',
                opacity: 0.8
            }}
        />
    )
}

// Events Schedule Display
const EventsScheduleDisplay = ({
    globalEvents,
    currentWave
}: {
    currentWave: number
    globalEvents: GlobalEventsState
}) => {
    const upcomingEvents = globalEvents.scheduledEvents
        .filter((event) => event.scheduledWave > currentWave)
        .slice(0, 3) // Show next 3 events
        .sort((a, b) => a.scheduledWave - b.scheduledWave)

    if (upcomingEvents.length === 0) return null

    return (
        <div
            style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                zIndex: 10,
                pointerEvents: 'none'
            }}
        >
            <div
                style={{
                    backgroundColor: 'transparent',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid var(--mantine-color-orange-6)',
                    maxWidth: '300px'
                }}
            >
                <Text
                    c="orange"
                    fw={600}
                    size="xs"
                    style={{ marginBottom: '4px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    ⚠️ Upcoming Events
                </Text>
                {upcomingEvents.map((event) => (
                    <div key={event.type} style={{ marginBottom: '2px' }}>
                        <Text
                            c="orange"
                            ff="monospace"
                            size="xs"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                        >
                            Wave {event.scheduledWave}: {event.config.icon} {event.config.name}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ProxyDefensePage = () => {
    const navigate = useNavigate()
    const { resetClicks } = useEasterEggStore()
    const [mousePosition, setMousePosition] = useState<null | { x: number; y: number }>(null)

    const [gameState, setGameState] = useState<GameState>({
        health: GAME_CONFIG.startHealth,
        coins: GAME_CONFIG.startCoins,
        score: 0,
        wave: 1,
        enemies: [],
        towers: [],
        isGameStarted: false,
        isGameOver: false,
        selectedTowerType: null,
        explosions: [],
        lightnings: [],
        lastHealthRegen: 0,
        lastInterestPayment: 0,
        lastMoneyRegen: 0,
        // Statistics
        enemiesKilled: 0,
        towersBuilt: 0,
        healthLost: 0,
        coinsSpent: 0,
        totalCoinsEarned: 0,
        totalInterestEarned: 0,
        // Visual effects
        lastDamageTime: 0,
        isShaking: false,
        globalEvents: {
            activeEvents: [],
            scheduledEvents: [],
            lastEventWave: 0
        },
        enemyBuffs: {
            speedBoost: 1,
            healthBoost: 1
        },
        lastBuffWave: 0
    })

    const spawnWave = useCallback(() => {
        const enemies: Enemy[] = []
        const waveMultiplier = Math.floor(gameState.wave / 5) + 1

        // Count current spiders on screen
        const currentSpiders = gameState.enemies.filter((enemy) => enemy.type === 'spider').length

        // Get event multipliers
        const eventMultipliers = GlobalEventManager.getActiveEventMultipliers(
            gameState.globalEvents
        )
        const baseEnemyCount = GAME_CONFIG.waveEnemyCount + gameState.wave
        const enemyCount = Math.floor(baseEnemyCount * eventMultipliers.enemyCountMultiplier)
        const healthMultiplier = eventMultipliers.enemyHealthMultiplier
        const speedMultiplier = eventMultipliers.enemySpeedMultiplier

        for (let i = 0; i < enemyCount; i++) {
            const types = Object.keys(ENEMY_TYPES) as Array<keyof typeof ENEMY_TYPES>
            let randomType: keyof typeof ENEMY_TYPES

            // Spider spawning logic: 15% chance after wave 3, max 1 on screen
            const shouldSpawnSpider =
                gameState.wave >= 3 &&
                Math.random() < 0.15 &&
                currentSpiders < 1 &&
                enemies.filter((e) => e.type === 'spider').length < 1

            if (shouldSpawnSpider) {
                randomType = 'spider'
            } else {
                // Special enemy spawning logic
                const rand = Math.random()

                if (gameState.wave >= 2 && rand < 0.1) {
                    randomType = 'shielded' // 10% chance after wave 2
                } else if (gameState.wave >= 3 && rand < 0.15) {
                    randomType = 'voltage' // 15% chance after wave 3
                } else if (gameState.wave >= 4 && rand < 0.25) {
                    randomType = 'replicator' // 25% chance after wave 4
                } else {
                    // Regular enemy types
                    const regularTypes = types.filter(
                        (type) => !['replicator', 'shielded', 'spider', 'voltage'].includes(type)
                    )
                    randomType = regularTypes[Math.floor(Math.random() * regularTypes.length)]
                }
            }

            const enemyTemplate = ENEMY_TYPES[randomType]

            // Apply enemy buffs every 5 waves (escalating difficulty) + event multipliers
            const buffMultiplier = Math.floor(gameState.wave / 5)
            const healthBoost = 1 + buffMultiplier * 0.2 // +20% health per 5 waves
            const speedBoost = 1 + buffMultiplier * 0.1 // +10% speed per 5 waves

            // Apply event multipliers
            const finalHealthBoost = healthBoost * healthMultiplier
            const finalSpeedBoost = speedBoost * speedMultiplier

            enemies.push({
                id: `enemy-${i}-${Date.now()}`,
                x: -50,
                y: Math.random() * (GAME_CONFIG.boardHeight - 40) + 20,
                health: enemyTemplate.health * waveMultiplier * finalHealthBoost,
                maxHealth: enemyTemplate.health * waveMultiplier * finalHealthBoost,
                speed: enemyTemplate.speed * finalSpeedBoost,
                reward: enemyTemplate.reward,
                type: randomType,
                lastAttack: 0,
                shield: enemyTemplate.shield,
                maxShield: enemyTemplate.maxShield,
                hasShield: enemyTemplate.hasShield,
                slowEffect: enemyTemplate.slowEffect,
                disabledUntil: enemyTemplate.disabledUntil,
                originalSpeed: enemyTemplate.speed * finalSpeedBoost,
                isOriginal: randomType === 'replicator' ? true : undefined, // Only originals can replicate
                buffs: {
                    healthBoost: finalHealthBoost,
                    speedBoost: finalSpeedBoost
                }
            })
        }

        setGameState((prev) => ({
            ...prev,
            enemies: [...prev.enemies, ...enemies]
        }))
    }, [gameState.wave, gameState.enemies])

    const updateGame = useCallback(() => {
        setGameState((prev) => {
            if (prev.isGameOver || !prev.isGameStarted) return prev

            const newState = { ...prev }
            const now = Date.now()

            if (now - newState.lastHealthRegen >= 2000 && newState.towers.length > 0) {
                newState.health = Math.min(newState.health + 0.5, GAME_CONFIG.startHealth)
                newState.lastHealthRegen = now
            }

            // Base passive income (disabled when player has more than limit)
            if (
                now - newState.lastMoneyRegen >= 1000 &&
                newState.coins <= GAME_CONFIG.economy.passiveIncomeLimit
            ) {
                newState.coins += GAME_CONFIG.economy.basePassiveIncome
                newState.totalCoinsEarned += GAME_CONFIG.economy.basePassiveIncome
                newState.lastMoneyRegen = now
            }

            // Interest payment system (2% of coins every 10 seconds, capped at 1000 coins base)
            if (now - newState.lastInterestPayment >= GAME_CONFIG.economy.interestInterval) {
                const interestBase = Math.min(newState.coins, GAME_CONFIG.economy.maxInterestBase)
                const interestEarned = Math.floor(interestBase * GAME_CONFIG.economy.interestRate)

                if (interestEarned > 0) {
                    newState.coins += interestEarned
                    newState.totalCoinsEarned += interestEarned
                    newState.totalInterestEarned += interestEarned
                }

                newState.lastInterestPayment = now
            }

            // Update enemies
            newState.enemies = newState.enemies
                .map((enemy) => {
                    // Check if enemy is in range of any alive slowdown tower
                    const isInSlowdownRange = newState.towers.some((tower) => {
                        if (tower.type !== 'slowdown' || tower.health <= 0) return false
                        const distance = Math.sqrt(
                            (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                        )
                        return distance <= TOWER_TYPES[tower.type].range
                    })

                    // Apply or remove slowdown effect
                    const updatedEnemy = { ...enemy }
                    if (isInSlowdownRange) {
                        // Apply slowdown if not already applied
                        if (!updatedEnemy.slowEffect || updatedEnemy.slowEffect === 1) {
                            updatedEnemy.slowEffect = 0.4 // 60% slower
                            updatedEnemy.speed =
                                (updatedEnemy.originalSpeed || updatedEnemy.speed) *
                                updatedEnemy.slowEffect
                        }
                    } else if (updatedEnemy.slowEffect && updatedEnemy.slowEffect < 1) {
                        // Restore original speed if was slowed
                        updatedEnemy.slowEffect = 1
                        updatedEnemy.speed = updatedEnemy.originalSpeed || updatedEnemy.speed
                    }

                    return {
                        ...updatedEnemy,
                        x: updatedEnemy.x + updatedEnemy.speed
                    }
                })
                .filter((enemy) => {
                    if (enemy.x > GAME_CONFIG.boardWidth) {
                        newState.health -= 10
                        newState.healthLost += 10
                        // Trigger damage effect
                        newState.lastDamageTime = now
                        newState.isShaking = true
                        return false
                    }
                    return enemy.health > 0
                })

            // Enemies attack towers (both melee and ranged)
            newState.enemies.forEach((enemy) => {
                const enemyStats = ENEMY_TYPES[enemy.type]

                // Find nearby tower for melee attack
                const nearbyTower = newState.towers.find((tower) => {
                    const distance = Math.sqrt((enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2)
                    return distance <= 30 // Melee range
                })

                if (nearbyTower) {
                    const damage = enemyStats.towerDamage * 0.1
                    nearbyTower.health -= damage
                    // Don't track melee damage to avoid spam
                }

                // Ranged attacks
                if (now - enemy.lastAttack >= enemyStats.attackCooldown) {
                    const rangedTarget = newState.towers.find((tower) => {
                        const distance = Math.sqrt(
                            (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                        )
                        return distance <= enemyStats.attackRange && distance > 30 // Ranged but not melee
                    })

                    if (rangedTarget) {
                        // Deal damage immediately for ranged attacks
                        rangedTarget.health -= enemyStats.towerDamage
                        // eslint-disable-next-line no-param-reassign
                        enemy.lastAttack = now

                        // Create enemy lightning effect
                        const enemyLightning: Lightning = {
                            id: `enemy-lightning-${Date.now()}-${Math.random()}`,
                            fromX: enemy.x,
                            fromY: enemy.y,
                            toX: rangedTarget.x,
                            toY: rangedTarget.y,
                            startTime: Date.now(),
                            duration: 400,
                            enemyType: enemy.type,
                            isEnemyAttack: true
                        }
                        newState.lightnings.push(enemyLightning)
                    }
                }
            })

            // Remove destroyed towers
            newState.towers = newState.towers.filter((tower) => tower.health > 0)

            // Tower attacks
            newState.towers.forEach((tower) => {
                // Check if tower is disabled
                if (tower.disabledUntil && now < tower.disabledUntil) {
                    return // Tower is disabled, skip attack
                }

                if (now - tower.lastShot >= tower.cooldown) {
                    const towerStats = TOWER_TYPES[tower.type]

                    // Find targets based on tower type
                    let targets: Enemy[] = []

                    if (tower.type === 'chain') {
                        // Chain lightning - find multiple targets
                        const potentialTargets = newState.enemies.filter((enemy) => {
                            const distance = Math.sqrt(
                                (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                            )
                            return distance <= towerStats.range
                        })
                        targets = potentialTargets.slice(0, tower.chainTargets || 3)
                    } else {
                        // Normal targeting - find single target
                        const target = newState.enemies.find((enemy) => {
                            const distance = Math.sqrt(
                                (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                            )
                            return distance <= towerStats.range
                        })
                        if (target) targets = [target]
                    }

                    if (targets.length > 0) {
                        // eslint-disable-next-line no-param-reassign
                        tower.lastShot = now

                        targets.forEach((target) => {
                            // Handle shield system for shielded enemies
                            if (target.type === 'shielded' && target.shield && target.shield > 0) {
                                // eslint-disable-next-line no-param-reassign
                                target.shield -= 1
                                // Create shield block effect
                                const shieldLightning: Lightning = {
                                    id: `shield-block-${Date.now()}-${Math.random()}`,
                                    fromX: tower.x,
                                    fromY: tower.y,
                                    toX: target.x,
                                    toY: target.y,
                                    startTime: Date.now(),
                                    duration: 200,
                                    towerType: tower.type,
                                    isEnemyAttack: false
                                }
                                newState.lightnings.push(shieldLightning)
                                return // Shield blocked the attack
                            }

                            // Normal damage
                            // eslint-disable-next-line no-param-reassign
                            target.health -= tower.damage

                            // Create lightning effect
                            const lightning: Lightning = {
                                id: `lightning-${Date.now()}-${Math.random()}`,
                                fromX: tower.x,
                                fromY: tower.y,
                                toX: target.x,
                                toY: target.y,
                                startTime: Date.now(),
                                duration: 300,
                                towerType: tower.type,
                                isEnemyAttack: false
                            }
                            newState.lightnings.push(lightning)

                            if (target.health <= 0) {
                                // Apply kill bonus multiplier (increased from 1.0 to 1.5)
                                const bonusReward = Math.floor(
                                    target.reward * GAME_CONFIG.economy.killBonusMultiplier
                                )
                                newState.coins += bonusReward
                                newState.score += bonusReward * 2
                                newState.enemiesKilled += 1
                                newState.totalCoinsEarned += bonusReward

                                // Handle special enemy death effects
                                if (target.type === 'replicator' && target.isOriginal) {
                                    // Only original replicators create copies on death
                                    for (let i = 0; i < 2; i++) {
                                        const copy: Enemy = {
                                            id: `replicator-copy-${Date.now()}-${i}`,
                                            x: target.x + (Math.random() - 0.5) * 60,
                                            y: target.y + (Math.random() - 0.5) * 60,
                                            health: Math.floor(target.maxHealth * 0.6), // Copies have 60% health
                                            maxHealth: Math.floor(target.maxHealth * 0.6),
                                            speed: target.speed * 1.2, // Copies are 20% faster
                                            reward: Math.floor(target.reward * 0.4), // Copies give 40% reward
                                            type: 'replicator',
                                            lastAttack: 0,
                                            shield: 0,
                                            maxShield: 0,
                                            hasShield: false,
                                            slowEffect: 1,
                                            originalSpeed: target.speed * 1.2,
                                            isOriginal: false // Copies cannot replicate
                                        }
                                        newState.enemies.push(copy)
                                    }
                                }

                                if (target.type === 'voltage') {
                                    // Voltage enemy disables nearby towers for 3 seconds
                                    const disableRadius = 100
                                    newState.towers.forEach((nearbyTower) => {
                                        const distance = Math.sqrt(
                                            (target.x - nearbyTower.x) ** 2 +
                                                (target.y - nearbyTower.y) ** 2
                                        )
                                        if (distance <= disableRadius) {
                                            // eslint-disable-next-line no-param-reassign
                                            nearbyTower.disabledUntil = now + 3000 // 3 seconds
                                        }
                                    })
                                }

                                // Create explosion effect
                                const explosion: Explosion = {
                                    id: `explosion-${Date.now()}-${Math.random()}`,
                                    x: target.x,
                                    y: target.y,
                                    startTime: Date.now(),
                                    duration: 800,
                                    type: 'enemy_death'
                                }
                                newState.explosions.push(explosion)
                            }
                        })
                    }
                }
            })

            // Update explosions and lightnings - remove completed ones
            newState.explosions = newState.explosions.filter((explosion) => {
                const elapsed = now - explosion.startTime
                return elapsed < explosion.duration
            })
            newState.lightnings = newState.lightnings.filter((lightning) => {
                const elapsed = now - lightning.startTime
                return elapsed < lightning.duration
            })

            // Update global events - remove expired events
            newState.globalEvents.activeEvents = newState.globalEvents.activeEvents.filter(
                (event) => {
                    const elapsed = now - event.startTime
                    return elapsed < event.duration
                }
            )

            // Check game over
            if (newState.health <= 0) {
                newState.isGameOver = true
            }

            // Check if wave is cleared
            if (newState.enemies.length === 0 && prev.enemies.length > 0 && !newState.isGameOver) {
                newState.wave++
                newState.coins += GAME_CONFIG.economy.waveCompletionBonus
                newState.totalCoinsEarned += GAME_CONFIG.economy.waveCompletionBonus

                // Restore 20 HP on wave completion
                newState.health = Math.min(newState.health + 20, GAME_CONFIG.startHealth)

                // Update global events system
                newState.globalEvents = GlobalEventManager.scheduleNextEvents(
                    newState.wave,
                    newState.globalEvents
                )

                // Activate any scheduled events for this wave
                const { eventsState, activatedEvents } = GlobalEventManager.activateScheduledEvents(
                    newState.wave,
                    newState.globalEvents
                )
                newState.globalEvents = eventsState

                // Apply immediate effects of activated events
                activatedEvents.forEach((eventConfig) => {
                    const effects = GlobalEventManager.applyEventEffects(eventConfig.type, newState)
                    Object.assign(newState, effects)
                })

                setTimeout(() => spawnWave(), 2000)
            }

            // Handle visual effects
            if (newState.isShaking && now - newState.lastDamageTime >= 500) {
                newState.isShaking = false
            }

            return newState
        })
    }, [spawnWave])

    const startGame = () => {
        setGameState((prev) => ({
            ...prev,
            isGameStarted: true,
            isGameOver: false,
            globalEvents: GlobalEventManager.scheduleNextEvents(1, prev.globalEvents)
        }))
        spawnWave()
    }

    const resetGame = () => {
        setGameState({
            health: GAME_CONFIG.startHealth,
            coins: GAME_CONFIG.startCoins,
            score: 0,
            wave: 1,
            enemies: [],
            towers: [],
            isGameStarted: false,
            isGameOver: false,
            selectedTowerType: null,
            explosions: [],
            lightnings: [],
            lastHealthRegen: 0,
            lastInterestPayment: 0,
            lastMoneyRegen: 0,
            // Statistics
            enemiesKilled: 0,
            towersBuilt: 0,
            healthLost: 0,
            coinsSpent: 0,
            totalCoinsEarned: 0,
            totalInterestEarned: 0,
            // Visual effects
            lastDamageTime: 0,
            isShaking: false,
            globalEvents: {
                activeEvents: [],
                scheduledEvents: [],
                lastEventWave: 0
            },
            enemyBuffs: {
                speedBoost: 1,
                healthBoost: 1
            },
            lastBuffWave: 0
        })
    }

    const canPlaceTower = (x: number, y: number) => {
        if (!gameState.selectedTowerType) return false

        const towerType = TOWER_TYPES[gameState.selectedTowerType]
        if (gameState.coins < towerType.cost) return false

        const tooClose = gameState.towers.some((tower) => {
            const distance = Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2)
            return distance < GAME_CONFIG.minTowerDistance
        })

        if (tooClose) return false

        const margin = 25
        if (
            x < margin ||
            x > GAME_CONFIG.boardWidth - margin ||
            y < margin ||
            y > GAME_CONFIG.boardHeight - margin
        ) {
            return false
        }

        return true
    }

    const placeTower = (x: number, y: number) => {
        if (!gameState.selectedTowerType) return

        const towerType = TOWER_TYPES[gameState.selectedTowerType]
        if (gameState.coins < towerType.cost) return

        if (!canPlaceTower(x, y)) {
            return
        }

        const newTower: Tower = {
            id: `tower-${Date.now()}`,
            x,
            y,
            type: gameState.selectedTowerType,
            damage: towerType.damage,
            range: towerType.range,
            cost: towerType.cost,
            cooldown: towerType.cooldown,
            health: towerType.health,
            maxHealth: towerType.health,
            lastShot: 0,
            disabledUntil: undefined,
            slowdownEffect: gameState.selectedTowerType === 'slowdown' ? 0.4 : undefined,
            chainTargets: gameState.selectedTowerType === 'chain' ? 2 : undefined
        }

        setGameState((prev) => ({
            ...prev,
            towers: [...prev.towers, newTower],
            coins: prev.coins - towerType.cost,
            selectedTowerType: null,
            towersBuilt: prev.towersBuilt + 1,
            coinsSpent: prev.coinsSpent + towerType.cost
        }))
    }

    const handleBoardClick = (event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        placeTower(x, y)
    }

    const handleMouseMove = (event: React.MouseEvent) => {
        if (!gameState.selectedTowerType) {
            setMousePosition(null)
            return
        }

        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        setMousePosition({ x, y })
    }

    const handleMouseLeave = () => {
        setMousePosition(null)
    }

    useEffect(() => {
        if (gameState.isGameStarted && !gameState.isGameOver) {
            const interval = setInterval(updateGame, 50)
            return () => clearInterval(interval)
        }
        return undefined
    }, [gameState.isGameStarted, gameState.isGameOver, updateGame])

    const goHome = () => {
        navigate(ROUTES.DASHBOARD.HOME)
    }

    const getPerformnaceRating = (
        score: number
    ): {
        color: string
        rating: string
    } => {
        switch (true) {
            case score > 100_000:
                return { rating: '👑 DIVINE PROTECTOR', color: 'violet' }
            case score > 50_000:
                return { rating: '🌟 LEGENDARY DEFENDER', color: 'green' }
            case score > 25_000:
                return { rating: '⚔️ ELITE GUARDIAN', color: 'blue' }
            case score > 10_000:
                return { rating: '🛡️ MASTER SENTINEL', color: 'cyan' }
            case score > 5_000:
                return { rating: '🥇 VETERAN KEEPER', color: 'teal' }
            case score > 2_500:
                return { rating: '🥈 SKILLED PROTECTOR', color: 'yellow' }
            case score > 1_000:
                return { rating: '🥉 SEASONED DEFENDER', color: 'orange' }
            case score > 500:
                return { rating: '🔰 APPRENTICE GUARDIAN', color: 'red' }
            case score > 100:
                return { rating: '🎯 NOVICE SENTINEL', color: 'pink' }
            default:
                return { rating: '🌱 ROOKIE ADMIN', color: 'gray' }
        }
    }

    return (
        <Container py="xl" size="xl">
            <Stack gap="xs">
                <Group align="center" justify="space-between">
                    <Box>
                        <Title c="cyan" order={1}>
                            🛡️ Proxy Defense
                        </Title>
                        <Text c="dimmed" size="lg">
                            Protect your proxy servers from attacks!
                        </Text>
                    </Box>

                    <Group>
                        <Tooltip label="Home">
                            <ActionIcon onClick={goHome} size="xl" variant="outline">
                                <IconHome size={20} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Reset easter egg">
                            <ActionIcon
                                color="red"
                                onClick={resetClicks}
                                size="xl"
                                variant="outline"
                            >
                                <IconRefresh size={20} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>

                <Box>
                    <MusicPlayer />
                </Box>

                {/* Tower Selection Panel */}
                <Paper mb={0} radius="md">
                    <Title c="cyan" mb="md" order={5} ta="center">
                        🏗️ Build Towers
                    </Title>
                    <ButtonGroup>
                        {Object.entries(TOWER_TYPES).map(([type, stats]) => (
                            <Button
                                color={stats.color}
                                disabled={gameState.coins < stats.cost}
                                fullWidth
                                key={type}
                                leftSection={<TowerInfoSprite type={type as Tower['type']} />}
                                onClick={() => {
                                    if (gameState.coins >= stats.cost) {
                                        setGameState((prev) => ({
                                            ...prev,
                                            selectedTowerType: type as Tower['type']
                                        }))
                                    }
                                }}
                                size="lg"
                                style={{
                                    justifyContent: 'flex-start',
                                    padding: '8px 12px'
                                }}
                                styles={{
                                    inner: {
                                        justifyContent: 'center'
                                    },
                                    section: {
                                        marginRight: 8
                                    },
                                    label: {
                                        fontFamily: 'monospace'
                                    }
                                }}
                                variant={gameState.selectedTowerType === type ? 'light' : 'outline'}
                            >
                                <Group justify="space-between" w="100%">
                                    <Text fw={500} size="sm">
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                    <Badge
                                        color="yellow"
                                        size="sm"
                                        style={{ minWidth: 'auto' }}
                                        variant="light"
                                    >
                                        {stats.cost}
                                    </Badge>
                                </Group>
                            </Button>
                        ))}
                    </ButtonGroup>
                </Paper>

                {/* Game Board with Tower Selection */}
                <Group align="center" gap="md" justify="center">
                    <Paper p="md" radius="md">
                        <Box
                            className={classes.gameBoard}
                            onClick={handleBoardClick}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                            style={{
                                width: GAME_CONFIG.boardWidth,
                                height: GAME_CONFIG.boardHeight,
                                position: 'relative',
                                background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
                                border: '2px solid #00d4ff',
                                borderRadius: '8px',
                                cursor: gameState.selectedTowerType ? 'crosshair' : 'default',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Towers */}
                            {gameState.towers.map((tower) => (
                                <div key={tower.id}>
                                    <TowerSprite tower={tower} />
                                    <HealthBar
                                        health={tower.health}
                                        maxHealth={tower.maxHealth}
                                        x={tower.x}
                                        y={tower.y}
                                    />
                                    <TowerAura tower={tower} />
                                    {gameState.selectedTowerType && (
                                        <TowerExclusionZone tower={tower} />
                                    )}
                                </div>
                            ))}

                            {/* Enemies */}
                            {gameState.enemies.map((enemy) => (
                                <div key={enemy.id}>
                                    <EnemySprite enemy={enemy} />
                                    <HealthBar
                                        health={enemy.health}
                                        isEnemy={true}
                                        maxHealth={enemy.maxHealth}
                                        x={enemy.x}
                                        y={enemy.y}
                                    />
                                </div>
                            ))}

                            {/* Explosions */}
                            {gameState.explosions.map((explosion) => (
                                <ExplosionSprite explosion={explosion} key={explosion.id} />
                            ))}

                            {/* Lightnings */}
                            {gameState.lightnings.map((lightning) => (
                                <LightningSprite key={lightning.id} lightning={lightning} />
                            ))}

                            {/* Building Guide - shows if you can build in the current mouse position */}
                            {mousePosition && gameState.selectedTowerType && (
                                <BuildingGuide
                                    isValid={canPlaceTower(mousePosition.x, mousePosition.y)}
                                    x={mousePosition.x}
                                    y={mousePosition.y}
                                />
                            )}

                            {/* Health Indicator */}
                            {gameState.isGameStarted && (
                                <>
                                    <HealthIndicator
                                        health={gameState.health}
                                        isShaking={gameState.isShaking}
                                    />
                                    <CoinsIndicator
                                        coins={gameState.coins}
                                        isShaking={gameState.isShaking}
                                    />
                                    <WaveIndicator waveNumber={gameState.wave} />
                                    <EventsScheduleDisplay
                                        currentWave={gameState.wave}
                                        globalEvents={gameState.globalEvents}
                                    />
                                </>
                            )}

                            {/* Critical Health Border Effect */}
                            {gameState.isGameStarted && gameState.health <= 30 && (
                                <div className={classes.criticalHealthBorder} />
                            )}

                            {/* Global Events Display */}
                            {gameState.globalEvents.activeEvents.map((event) => (
                                <div className={classes.formattedDisplayContainer} key={event.type}>
                                    <div className={classes.formattedDisplay}>
                                        <div>
                                            {event.config.icon} {event.config.name}{' '}
                                            {event.config.icon}
                                        </div>
                                        <div className={classes.formattedDisplayText}>
                                            {event.config.description}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!gameState.isGameStarted && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center',
                                        color: 'white'
                                    }}
                                >
                                    <Card p="xl" radius="lg" shadow="xl" withBorder>
                                        <Stack align="center" gap="md">
                                            <Group align="center" gap="sm">
                                                <IconShield color="cyan" size={32} />
                                                <Text c="cyan" fw={700} size="xl">
                                                    Ready to Defend?
                                                </Text>
                                            </Group>

                                            <Text c="white" size="md" ta="center">
                                                Protect your proxy servers from incoming attacks!
                                            </Text>

                                            <Button
                                                color="cyan"
                                                fullWidth
                                                leftSection={<IconTarget size={20} />}
                                                onClick={startGame}
                                                size="lg"
                                                variant="filled"
                                            >
                                                Start Defense
                                            </Button>
                                        </Stack>
                                    </Card>
                                </div>
                            )}
                        </Box>
                    </Paper>
                </Group>

                {/* Enemy Tracking Panel */}
                <Paper m={0} p="md" radius="md">
                    <Title c="red" mb="md" order={5} ta="center">
                        👾 Enemy Tracker
                    </Title>
                    <Group gap="sm" justify="center">
                        {Object.entries(ENEMY_TYPES).map(([type, stats]) => {
                            const count = gameState.enemies.filter(
                                (enemy) => enemy.type === type
                            ).length
                            return (
                                <div
                                    key={type}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: `2px solid ${count > 0 ? stats.color : 'var(--mantine-color-gray-6)'}`,
                                        opacity: count > 0 ? 1 : 0.5,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: type === 'spider' ? 50 : 30,
                                            height: type === 'spider' ? 50 : 30
                                        }}
                                    >
                                        <EnemyInfoSprite type={type as Enemy['type']} />
                                    </div>

                                    <Badge
                                        color={count > 0 ? stats.color : 'gray'}
                                        ml="xs"
                                        size="lg"
                                        style={{
                                            minWidth: 'auto',
                                            fontFamily: 'monospace',
                                            fontSize: '14px'
                                        }}
                                        variant={count > 0 ? 'light' : 'outline'}
                                    >
                                        {count.toString().padStart(2, '0')}
                                    </Badge>
                                </div>
                            )
                        })}
                    </Group>
                </Paper>

                {/* Game Over Modal */}
                <Modal
                    centered
                    onClose={() => {}}
                    opened={gameState.isGameOver}
                    size="lg"
                    styles={{
                        title: {
                            width: '100%',
                            textAlign: 'center'
                        },
                        header: {
                            justifyContent: 'center'
                        }
                    }}
                    title={
                        <Text c="red.6" fw={700} size="xl">
                            🔥 GAME OVER 🔥
                        </Text>
                    }
                    withCloseButton={false}
                >
                    <Stack gap="md">
                        {/* Performance Rating */}
                        <Card p="md" withBorder>
                            <Group align="center" gap="md" justify="center">
                                <Text c="dimmed" fw={500}>
                                    🎯 Performance Rating
                                </Text>
                                <Badge
                                    color={getPerformnaceRating(gameState.score).color}
                                    size="lg"
                                    variant="light"
                                >
                                    {getPerformnaceRating(gameState.score).rating}
                                </Badge>
                            </Group>
                        </Card>

                        {/* Main Stats */}
                        <Grid>
                            <Grid.Col span={6}>
                                <Card p="md" withBorder>
                                    <Group align="center" justify="space-between">
                                        <div>
                                            <Text c="dimmed" fw={500} size="sm">
                                                🏆 Final Score
                                            </Text>
                                            <Text c="yellow" fw={700} size="xl">
                                                {gameState.score.toLocaleString()}
                                            </Text>
                                        </div>
                                        <Progress
                                            color="yellow"
                                            size="sm"
                                            value={Math.min(gameState.score / 20, 100)}
                                            w={60}
                                        />
                                    </Group>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card p="md" withBorder>
                                    <Group align="center" justify="space-between">
                                        <div>
                                            <Text c="dimmed" fw={500} size="sm">
                                                🌊 Waves Survived
                                            </Text>
                                            <Text c="blue" fw={700} size="xl">
                                                {gameState.wave - 1}
                                            </Text>
                                        </div>
                                        <Progress
                                            color="blue"
                                            size="sm"
                                            value={Math.min((gameState.wave - 1) * 5, 100)}
                                            w={60}
                                        />
                                    </Group>
                                </Card>
                            </Grid.Col>
                        </Grid>

                        {/* Combat Stats */}
                        <Text c="cyan" fw={600} size="lg" ta="center">
                            ⚔️ Combat Statistics
                        </Text>
                        <Grid>
                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            💀 Enemies Killed
                                        </Text>
                                        <Badge color="red" variant="light">
                                            {gameState.enemiesKilled}
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            🏰 Towers Built
                                        </Text>
                                        <Badge color="blue" variant="light">
                                            {gameState.towersBuilt}
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            ❤️ Health Lost
                                        </Text>
                                        <Badge color="pink" variant="light">
                                            {gameState.healthLost}
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            ⚡ Efficiency
                                        </Text>
                                        <Badge color="purple" variant="light">
                                            {gameState.towersBuilt > 0
                                                ? Math.round(
                                                      (gameState.enemiesKilled /
                                                          gameState.towersBuilt) *
                                                          10
                                                  ) / 10
                                                : 0}
                                            /tower
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        </Grid>

                        {/* Economic Stats */}
                        <Text c="green" fw={600} size="lg" ta="center">
                            💰 Economic Statistics
                        </Text>
                        <Grid>
                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            💰 Coins Earned
                                        </Text>
                                        <Badge color="green" variant="light">
                                            {gameState.totalCoinsEarned.toLocaleString()}
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            💸 Coins Spent
                                        </Text>
                                        <Badge color="orange" variant="light">
                                            {gameState.coinsSpent.toLocaleString()}
                                        </Badge>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        </Grid>

                        {/* Action Button */}
                        <Button
                            color="cyan"
                            fullWidth
                            leftSection={<HiRefresh size={20} />}
                            onClick={resetGame}
                            size="md"
                            variant="outline"
                        >
                            Try Again
                        </Button>
                    </Stack>
                </Modal>

                {/* Live Statistics Panel */}
                {gameState.isGameStarted && (
                    <Paper bg="gray.9" p="lg" radius="md" shadow="xs" withBorder>
                        <Group align="center" gap="md" mb="lg">
                            <IconTrendingUp color="cyan" size={24} />
                            <Title c="cyan" order={4}>
                                Live Statistics
                            </Title>
                        </Group>

                        <Grid>
                            {/* Economics Card */}
                            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                                <Card h="100%" p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <IconCurrencyDollar
                                            color={
                                                gameState.coins <=
                                                GAME_CONFIG.economy.passiveIncomeLimit
                                                    ? 'teal'
                                                    : 'red'
                                            }
                                            size={20}
                                        />
                                        <Text
                                            c={
                                                gameState.coins <=
                                                GAME_CONFIG.economy.passiveIncomeLimit
                                                    ? 'teal'
                                                    : 'red'
                                            }
                                            fw={600}
                                            size="sm"
                                        >
                                            Economics{' '}
                                            {gameState.coins >
                                            GAME_CONFIG.economy.passiveIncomeLimit
                                                ? '⚠️'
                                                : ''}
                                        </Text>
                                    </Group>
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Earned
                                            </Text>
                                            <Badge color="teal" size="sm" variant="light">
                                                {gameState.totalCoinsEarned.toLocaleString()}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Interest
                                            </Text>
                                            <Badge color="cyan" size="sm" variant="light">
                                                {gameState.totalInterestEarned.toLocaleString()}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Spent
                                            </Text>
                                            <Badge color="orange" size="sm" variant="light">
                                                {gameState.coinsSpent.toLocaleString()}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Passive Income
                                            </Text>
                                            <Badge
                                                color={
                                                    gameState.coins <=
                                                    GAME_CONFIG.economy.passiveIncomeLimit
                                                        ? 'green'
                                                        : 'red'
                                                }
                                                size="sm"
                                                variant="light"
                                            >
                                                {gameState.coins <=
                                                GAME_CONFIG.economy.passiveIncomeLimit
                                                    ? 'ACTIVE'
                                                    : 'DISABLED'}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500} size="xs">
                                                Net Profit
                                            </Text>
                                            <Badge
                                                color={
                                                    gameState.totalCoinsEarned -
                                                        gameState.coinsSpent >=
                                                    0
                                                        ? 'green'
                                                        : 'red'
                                                }
                                                size="sm"
                                                variant="filled"
                                            >
                                                {(
                                                    gameState.totalCoinsEarned -
                                                    gameState.coinsSpent
                                                ).toLocaleString()}
                                            </Badge>
                                        </Group>
                                        <Progress
                                            color="teal"
                                            size="xs"
                                            value={Math.min(
                                                (gameState.totalCoinsEarned /
                                                    Math.max(gameState.coinsSpent, 1)) *
                                                    50,
                                                100
                                            )}
                                        />
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            {/* Combat Card */}
                            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                                <Card h="100%" p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <IconSwords color="red" size={20} />
                                        <Text c="red" fw={600} size="sm">
                                            Combat
                                        </Text>
                                    </Group>
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Kills
                                            </Text>
                                            <Badge color="red" size="sm" variant="light">
                                                {gameState.enemiesKilled}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Active Enemies
                                            </Text>
                                            <Badge color="orange" size="sm" variant="light">
                                                {gameState.enemies.length}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500} size="xs">
                                                Kill/Death Ratio
                                            </Text>
                                            <Badge
                                                color={
                                                    gameState.healthLost === 0
                                                        ? 'green'
                                                        : gameState.enemiesKilled /
                                                                gameState.healthLost >
                                                            5
                                                          ? 'blue'
                                                          : 'yellow'
                                                }
                                                size="sm"
                                                variant="filled"
                                            >
                                                {gameState.healthLost > 0
                                                    ? (
                                                          (gameState.enemiesKilled /
                                                              gameState.healthLost) *
                                                          10
                                                      ).toFixed(1)
                                                    : '∞'}
                                            </Badge>
                                        </Group>
                                        <Progress
                                            color="red"
                                            size="xs"
                                            value={Math.min(gameState.enemiesKilled * 2, 100)}
                                        />
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            {/* Construction Card */}
                            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                                <Card h="100%" p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <IconBuilding color="blue" size={20} />
                                        <Text c="blue" fw={600} size="sm">
                                            Construction
                                        </Text>
                                    </Group>
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Built
                                            </Text>
                                            <Badge color="blue" size="sm" variant="light">
                                                {gameState.towersBuilt}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Active
                                            </Text>
                                            <Badge color="cyan" size="sm" variant="light">
                                                {gameState.towers.length}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500} size="xs">
                                                Efficiency
                                            </Text>
                                            <Badge
                                                color={
                                                    gameState.towersBuilt > 0 &&
                                                    gameState.enemiesKilled /
                                                        gameState.towersBuilt >
                                                        2
                                                        ? 'green'
                                                        : 'blue'
                                                }
                                                size="sm"
                                                variant="filled"
                                            >
                                                {gameState.towersBuilt > 0
                                                    ? (
                                                          gameState.enemiesKilled /
                                                          gameState.towersBuilt
                                                      ).toFixed(1)
                                                    : '0'}
                                                /tower
                                            </Badge>
                                        </Group>
                                        <Progress
                                            color="blue"
                                            size="xs"
                                            value={
                                                gameState.towers.length > 0
                                                    ? Math.min(
                                                          (gameState.towers.length /
                                                              gameState.towersBuilt) *
                                                              100,
                                                          100
                                                      )
                                                    : 0
                                            }
                                        />
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            {/* Defense Card */}
                            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                                <Card h="100%" p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <IconShieldCheck
                                            color={gameState.towers.length > 0 ? 'teal' : 'red'}
                                            size={20}
                                        />
                                        <Text
                                            c={gameState.towers.length > 0 ? 'teal' : 'red'}
                                            fw={600}
                                            size="sm"
                                        >
                                            Defense
                                        </Text>
                                    </Group>
                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Health Lost
                                            </Text>
                                            <Badge color="pink" size="sm" variant="light">
                                                {gameState.healthLost}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Waves Survived
                                            </Text>
                                            <Badge color="purple" size="sm" variant="light">
                                                {gameState.wave - 1}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text fw={500} size="xs">
                                                Healing Status
                                            </Text>
                                            <Badge
                                                color={gameState.towers.length > 0 ? 'teal' : 'red'}
                                                size="sm"
                                                variant="filled"
                                            >
                                                {gameState.towers.length > 0
                                                    ? 'Active'
                                                    : 'Disabled'}
                                            </Badge>
                                        </Group>
                                        <Progress
                                            color={
                                                gameState.health > 70
                                                    ? 'green'
                                                    : gameState.health > 30
                                                      ? 'yellow'
                                                      : 'red'
                                            }
                                            size="xs"
                                            value={gameState.health}
                                        />
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>

                        {/* Quick Action Stats */}
                        <Group gap="lg" justify="center" mt="lg">
                            <Group align="center" gap="xs">
                                <IconTarget color="cyan" size={16} />
                                <Text c="cyan" fw={500} size="sm">
                                    Accuracy:{' '}
                                    {gameState.enemiesKilled > 0 && gameState.towersBuilt > 0
                                        ? Math.round(
                                              (gameState.enemiesKilled / (gameState.wave * 3)) * 100
                                          )
                                        : 0}
                                    %
                                </Text>
                            </Group>
                            <Group align="center" gap="xs">
                                <IconFlame color="orange" size={16} />
                                <Text c="orange" fw={500} size="sm">
                                    Threat Level:{' '}
                                    {gameState.enemies.length > 5
                                        ? 'High'
                                        : gameState.enemies.length > 2
                                          ? 'Medium'
                                          : 'Low'}
                                </Text>
                            </Group>
                            <Group align="center" gap="xs">
                                <IconUsers color="violet" size={16} />
                                <Text c="violet" fw={500} size="sm">
                                    Next Wave: {GAME_CONFIG.waveEnemyCount + gameState.wave} enemies
                                </Text>
                            </Group>
                            <Group align="center" gap="xs">
                                <IconCoins color="green" size={16} />
                                <Text c="green" fw={500} size="sm">
                                    Next Interest:{' '}
                                    {Math.floor(
                                        Math.min(
                                            gameState.coins,
                                            GAME_CONFIG.economy.maxInterestBase
                                        ) * GAME_CONFIG.economy.interestRate
                                    )}{' '}
                                    coins
                                </Text>
                            </Group>
                            <Group align="center" gap="xs">
                                <IconTrendingUp
                                    color={
                                        gameState.coins <= GAME_CONFIG.economy.passiveIncomeLimit
                                            ? 'green'
                                            : 'red'
                                    }
                                    size={16}
                                />
                                <Text
                                    c={
                                        gameState.coins <= GAME_CONFIG.economy.passiveIncomeLimit
                                            ? 'green'
                                            : 'red'
                                    }
                                    fw={500}
                                    size="sm"
                                >
                                    Passive Income:{' '}
                                    {gameState.coins <= GAME_CONFIG.economy.passiveIncomeLimit
                                        ? 'ACTIVE'
                                        : 'DISABLED'}
                                </Text>
                            </Group>
                        </Group>
                    </Paper>
                )}

                {/* Tower Information Panel */}
                <Paper
                    bg="linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)"
                    p="sm"
                    radius="md"
                    shadow="xs"
                    withBorder
                >
                    <Title c="cyan" mb="sm" order={4}>
                        📊 Tower Information
                    </Title>
                    <Grid>
                        {Object.entries(TOWER_TYPES).map(([type, stats]) => (
                            <Grid.Col key={type} span={{ base: 12, sm: 4 }}>
                                <Card p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 30,
                                                height: 30
                                            }}
                                        >
                                            <TowerInfoSprite type={type as Tower['type']} />
                                        </div>
                                        <Text c={stats.color} fw={600} size="sm">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
                                    </Group>

                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Cost
                                            </Text>
                                            <Badge color="yellow" size="sm" variant="light">
                                                {stats.cost} coins
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Health
                                            </Text>
                                            <Badge color="red" size="sm" variant="light">
                                                {stats.health} HP
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Damage
                                            </Text>
                                            <Badge color="orange" size="sm" variant="light">
                                                {stats.damage}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Range
                                            </Text>
                                            <Badge color="blue" size="sm" variant="light">
                                                {stats.range}px
                                            </Badge>
                                        </Group>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Paper>

                {/* Enemy Information Panel */}
                <Paper
                    bg="linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)"
                    p="sm"
                    radius="md"
                    shadow="xs"
                    withBorder
                >
                    <Title c="red" mb="sm" order={4}>
                        👾 Enemy Information
                    </Title>
                    <Grid>
                        {Object.entries(ENEMY_TYPES).map(([type, stats]) => (
                            <Grid.Col key={type} span={{ base: 12, sm: 6, md: 4 }}>
                                <Card p="md" radius="md" withBorder>
                                    <Group align="center" gap="sm" mb="sm">
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: type === 'spider' ? 50 : 30,
                                                height: type === 'spider' ? 50 : 30
                                            }}
                                        >
                                            <EnemyInfoSprite type={type as Enemy['type']} />
                                        </div>
                                        <div>
                                            <Text c={stats.color} fw={600} size="sm">
                                                {type.toLocaleUpperCase()}
                                            </Text>
                                            {type === 'spider' && (
                                                <Badge color="purple" size="xs" variant="light">
                                                    BOSS
                                                </Badge>
                                            )}
                                        </div>
                                    </Group>

                                    <Stack gap="xs">
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Health
                                            </Text>
                                            <Badge color="red" size="sm" variant="light">
                                                {stats.health} HP
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Speed
                                            </Text>
                                            <Badge color="blue" size="sm" variant="light">
                                                {stats.speed}
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Reward
                                            </Text>
                                            <Badge color="yellow" size="sm" variant="light">
                                                {stats.reward} coins
                                            </Badge>
                                        </Group>
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Damage
                                            </Text>
                                            <Badge color="orange" size="sm" variant="light">
                                                {stats.towerDamage}
                                            </Badge>
                                        </Group>
                                        {stats.hasShield && (
                                            <Group justify="space-between">
                                                <Text c="dimmed" size="xs">
                                                    Shield
                                                </Text>
                                                <Badge color="cyan" size="sm" variant="light">
                                                    {stats.maxShield} blocks
                                                </Badge>
                                            </Group>
                                        )}
                                        {type === 'spider' && (
                                            <Group justify="center">
                                                <Badge color="purple" size="xs" variant="filled">
                                                    15% spawn chance after wave 3
                                                </Badge>
                                            </Group>
                                        )}
                                        {type === 'shielded' && (
                                            <Group justify="center">
                                                <Badge color="green" size="xs" variant="filled">
                                                    10% spawn chance after wave 2
                                                </Badge>
                                            </Group>
                                        )}
                                        {type === 'voltage' && (
                                            <Group justify="center">
                                                <Badge color="yellow" size="xs" variant="filled">
                                                    15% spawn chance after wave 3
                                                </Badge>
                                            </Group>
                                        )}
                                        {type === 'replicator' && (
                                            <>
                                                <Group justify="center">
                                                    <Badge color="pink" size="xs" variant="filled">
                                                        25% spawn chance after wave 4
                                                    </Badge>
                                                </Group>
                                                <Group justify="center">
                                                    <Badge color="gray" size="xs" variant="outline">
                                                        Only originals can replicate
                                                    </Badge>
                                                </Group>
                                            </>
                                        )}
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Paper>

                {/* Detailed Game Mechanics */}
                <Alert color="cyan" icon={<IconShield />} variant="light">
                    <Text size="sm">
                        <strong>🎮 GAME MECHANICS & STRATEGY GUIDE</strong>
                        <br />
                        <br />
                        <strong>🏰 TOWERS:</strong>
                        <br />• <strong>Firewall (🛡️)</strong> - Tank tower with high health (100
                        HP), strong damage (20), medium range (80px), slow cooldown (1s). Best
                        against: All enemies as frontline defense.
                        <br />• <strong>Antivirus (⚡)</strong> - Balanced tower with medium health
                        (60 HP), good damage (15), short range (60px), fast cooldown (0.8s). Best
                        against: Fast enemies like Malware.
                        <br />• <strong>Proxy (🔄)</strong> - Support tower with low health (40 HP),
                        light damage (10), long range (100px), fastest cooldown (0.6s). Best
                        against: Multiple weak enemies.
                        <br />• <strong>Slowdown (❄️)</strong> - Area control tower with medium
                        health (50 HP), low damage (5), long range (120px), applies 60% slowdown
                        effect. Best against: Fast enemies and crowd control.
                        <br />• <strong>Chain Lightning (⚡️)</strong> - Multi-target tower with
                        good health (70 HP), high damage (25), medium range (90px), hits 2-3 enemies
                        per shot. Best against: Groups of enemies.
                        <br />
                        <br />
                        <strong>👾 ENEMIES:</strong>
                        <br />• <strong>Hacker (👨‍💻)</strong> - Medium health (30 HP), fast speed
                        (2.5), melee + ranged attacks (50px range), chaotic red lightning with
                        digital glitches.
                        <br />• <strong>DDoS (⚡)</strong> - High health (60 HP), slow speed (1.5),
                        powerful attacks (25 damage), triple orange lightning bolts simultaneously.
                        <br />• <strong>Malware (🦠)</strong> - Low health (15 HP), very fast speed
                        (4), weak but frequent attacks, purple viral lightning with organic
                        patterns.
                        <br />• <strong>Spider (🕷️)</strong> - Very high health (180 HP), medium
                        speed (1.8), powerful attacks (35 damage), web-based purple lightning with
                        venom drops. <strong>BOSS ENEMY:</strong> Only spawns after wave 3, 15%
                        chance per wave. High reward (75 coins)!
                        <br />• <strong>Shielded Bot (🛡️)</strong> - Medium health (100 HP), slow
                        speed (1.5), blocks first 3 attacks with energy shield. Spawns after wave 2
                        (10% chance).
                        <br />• <strong>Voltage Surge (⚡️)</strong> - High health (120 HP), slow
                        speed (1.2), disables all towers within 100px for 3 seconds when destroyed.
                        Spawns after wave 3 (10% chance).
                        <br />• <strong>Replicator (🧬)</strong> - High health (100 HP), slow speed
                        (1.0), creates 2 weaker copies (60% health, 20% faster) when destroyed.
                        <strong>Note:</strong> Only original replicators can create copies - copies
                        cannot replicate! Spawns after wave 4 (10% chance).
                        <br />
                        <br />
                        <strong>⚔️ COMBAT SYSTEM:</strong>
                        <br />
                        • Towers automatically attack enemies within range with colored lightning
                        <br />
                        • Enemies can attack both in melee (contact) and ranged (lightning)
                        <br />
                        • Each enemy type has unique attack patterns and cooldowns
                        <br />
                        • Destroyed enemies explode with fire effects and drop coins
                        <br />
                        <br />
                        <strong>🔄 PASSIVE REGENERATION:</strong>
                        <br />
                        • +0.5 HP every 2 seconds (only with active towers!)
                        <br />• +{GAME_CONFIG.economy.basePassiveIncome} Coins every second (passive
                        income) -{' '}
                        <strong>
                            DISABLED when you have more than{' '}
                            {GAME_CONFIG.economy.passiveIncomeLimit} coins!
                        </strong>
                        <br />• +{GAME_CONFIG.economy.waveCompletionBonus} Coins bonus when
                        completing each wave
                        <br />
                        • +20 HP bonus when completing each wave
                        <br />
                        <br />
                        <strong>💰 ECONOMIC SYSTEM:</strong>
                        <br />• <strong>Interest System:</strong> Earn{' '}
                        {GAME_CONFIG.economy.interestRate * 100}% interest on coins every{' '}
                        {GAME_CONFIG.economy.interestInterval / 1000} seconds
                        <br />• <strong>Passive Income Cap:</strong> Passive coin generation stops
                        when you have more than {GAME_CONFIG.economy.passiveIncomeLimit} coins
                        <br />• <strong>Strategic Spending:</strong> Keep spending to maintain
                        passive income flow!
                        <br />
                        <br />
                        <strong>🎯 STRATEGY TIPS:</strong>
                        <br />
                        • Use Firewall towers as frontline tanks to absorb damage
                        <br />
                        • Place Antivirus towers behind Firewalls for sustained DPS
                        <br />
                        • Proxy towers are great for covering large areas cheaply
                        <br />• Slowdown towers are perfect for slowing fast enemies like Malware
                        <br />• Chain Lightning towers excel against groups of enemies
                        <br />• <strong>CRITICAL:</strong> Keep at least one tower alive - no towers
                        = no healing!
                        <br />
                        • Watch tower health bars - replace destroyed towers quickly!
                        <br />• <strong>ECONOMIC TIP:</strong> Don't hoard coins! Passive income
                        stops at {GAME_CONFIG.economy.passiveIncomeLimit}+ coins - spend to keep
                        earning!
                        <br /> • <strong>ESCALATION SYSTEM:</strong> Enemy difficulty increases
                        every 5 waves: +20% health, +10% speed
                        <br />• <strong>SPIDER STRATEGY:</strong> Focus fire on spiders immediately
                        - they're worth 75 coins but deal massive damage!
                        <br />• <strong>SHIELDED STRATEGY:</strong> Use rapid-fire towers (Proxy) to
                        break shields quickly
                        <br />• <strong>VOLTAGE STRATEGY:</strong> Keep towers spread out to
                        minimize disable radius
                        <br />• <strong>REPLICATOR STRATEGY:</strong> Use high-damage towers (Chain
                        Lightning) to kill originals quickly. Don't worry about copies - they can't
                        replicate.
                        <br />• <strong>DATA FLOOD STRATEGY:</strong> Focus on Chain Lightning and
                        area-effect towers to handle 2x enemy waves efficiently
                        <br />• Build multiple Firewall towers when facing spiders to absorb their
                        powerful attacks
                        <br />
                        <br />
                        <strong>🏗️ BUILDING RESTRICTIONS:</strong>
                        <br />
                        • Towers cannot be placed too close to each other (minimum 45px distance)
                        <br />
                        • Red zones around existing towers show where you cannot build
                        <br />
                        • Green/Red circle follows your mouse showing valid/invalid placement
                        <br />
                        • Towers cannot be placed too close to board edges (25px margin)
                        <br />
                        • Plan your tower placement strategically - spacing matters!
                        <br />
                        <br />
                        <strong>🌍 GLOBAL EVENTS SYSTEM:</strong>
                        <br />
                        • Random events occur throughout the game with unique effects
                        <br />
                        • Some events can occur simultaneously, others conflict
                        <br />
                        <br />
                        <strong>💽 DISK FORMAT EVENT:</strong>
                        <br />• <strong>Priority:</strong> 100 (Highest) |{' '}
                        <strong>Duration:</strong> 2 seconds
                        <br />• <strong>Interval:</strong> Every 4-7 waves |{' '}
                        <strong>Conflicts:</strong> All events
                        <br />• <strong>WARNING:</strong> All towers are instantly destroyed!
                        <br />
                        • Save coins for quick rebuilding after format events
                        <br />
                        • Most devastating event - cannot occur with others
                        <br />
                        <br />
                        <strong>🌊 DATA FLOOD EVENT:</strong>
                        <br />• <strong>Priority:</strong> 80 | <strong>Duration:</strong> 3 seconds
                        <br />• <strong>Interval:</strong> Every 8-12 waves |{' '}
                        <strong>Can coexist with:</strong> EMP Surge
                        <br />• <strong>EFFECT:</strong> Wave spawns 2x enemies, but they have 40%
                        less health
                        <br />
                        • Tests your ability to handle multiple targets simultaneously
                        <br />• Chain Lightning and area-effect towers are most effective during
                        floods
                        <br />• Use this opportunity to farm coins with weakened enemies!
                    </Text>
                </Alert>
            </Stack>
        </Container>
    )
}
