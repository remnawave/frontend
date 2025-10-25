/* eslint-disable no-nested-ternary */

/* eslint-disable no-param-reassign */

/* eslint-disable @stylistic/indent */

import {
    IconBuilding,
    IconCoins,
    IconCurrencyDollar,
    IconHeart,
    IconHome,
    IconRefresh,
    IconShield,
    IconShieldCheck,
    IconSwords,
    IconTarget,
    IconTrendingUp
} from '@tabler/icons-react'
import {
    ActionIcon,
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
import { consola } from 'consola/browser'

import { MusicPlayer } from '@shared/ui/music-player/music-player.shared'
import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import {
    drawAntivirusTower,
    drawChainTower,
    drawDDoSEnemy,
    drawEnemyAttack,
    drawExplosion,
    drawFirewallTower,
    drawHackerEnemy,
    drawLightning,
    drawMalwareEnemy,
    drawPhoenixEnemy,
    drawPortalMinerEnemy,
    drawProxyTower,
    drawReplicatorEnemy,
    drawShieldedEnemy,
    drawSlowdownTower,
    drawSpiderEnemy,
    drawVoltageEnemy,
    drawWormEnemy
} from './proxy-defense.drawers'
import {
    Enemy,
    Explosion,
    Formation,
    GameState,
    GlobalEventsState,
    Lightning,
    Tower,
    WaveInfo,
    WaveType
} from './interfaces'
import {
    ENEMY_TYPES,
    FORMATION_COUNT_MODIFIERS,
    FORMATION_INFO,
    GAME_CONFIG,
    TOWER_TYPES,
    WAVE_TYPES
} from './proxy-defense.contants'
import { GlobalEventManager } from './global-event-manager'
import classes from './ProxyDefense.module.css'

const animationStyles = `
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
    }
    
    @keyframes dataFlow {
        0% { transform: scaleX(0); }
        50% { transform: scaleX(1); }
        100% { transform: scaleX(0); }
    }
    
    @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.6; }
        100% { opacity: 0.3; }
    }
    
    @keyframes dataTransfer {
        0% { transform: translateX(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style')
    styleSheet.textContent = animationStyles
    document.head.appendChild(styleSheet)
}

const selectFormation = (waveNumber: number): Formation => {
    // Early waves use simpler formations
    if (waveNumber <= 3) {
        return Math.random() < 0.7 ? 'line' : 'group'
    }

    // Mid game introduces more complex formations
    if (waveNumber <= 10) {
        const formations: Formation[] = ['line', 'group', 'scattered', 'flanking', 'ambush']
        return formations[Math.floor(Math.random() * formations.length)]
    }

    // Late game can use any formation
    const allFormations: Formation[] = [
        'ambush',
        'line',
        'group',
        'scattered',
        'flanking',
        'waves',
        'pincer'
    ]

    // Boss waves (every 3rd wave) prefer more challenging formations
    if (waveNumber % 3 === 0) {
        const challengingFormations: Formation[] = [
            'ambush',
            'flanking',
            'waves',
            'pincer',
            'scattered'
        ]
        return challengingFormations[Math.floor(Math.random() * challengingFormations.length)]
    }

    return allFormations[Math.floor(Math.random() * allFormations.length)]
}

const selectWaveType = (waveNumber: number): WaveType => {
    // Early waves are mostly standard
    if (waveNumber <= 5) {
        return Math.random() < 0.8 ? 'standard' : 'swarm'
    }

    // Boss waves (every 5th wave) prefer elite composition
    if (waveNumber % 5 === 0) {
        return Math.random() < 0.6 ? 'elite' : 'standard'
    }

    // Every 8th wave prefers tsunami
    if (waveNumber % 8 === 0) {
        return Math.random() < 0.7 ? 'tsunami' : 'swarm'
    }

    // Mid-late game can have any type
    const rand = Math.random()
    if (rand < 0.5) return 'standard'
    if (rand < 0.8) return 'swarm'
    if (rand < 0.9) return 'tsunami'
    return 'elite'
}

const applyFormation = (enemies: Enemy[], formation: Formation) => {
    const { boardHeight } = GAME_CONFIG
    const boardCenter = boardHeight / 2

    switch (formation) {
        case 'ambush':
            // Enemies emerge from coordinated ambush points at different times
            enemies.forEach((enemy, index) => {
                const ambushPoint = index % 4 // 4 different ambush points
                const groupInAmbush = Math.floor(index / 4)

                switch (ambushPoint) {
                    case 0: // Top-left ambush
                        enemy.x = -50 - groupInAmbush * 40
                        enemy.y = 40 + Math.random() * 60
                        break
                    case 1: // Bottom-left ambush
                        enemy.x = -50 - groupInAmbush * 40
                        enemy.y = boardHeight - 100 + Math.random() * 60
                        break
                    case 2: // Mid-left delayed
                        enemy.x = -50 - (groupInAmbush + 2) * 60 // Extra delay
                        enemy.y = boardCenter + (Math.random() - 0.5) * 100
                        break
                    case 3: // Staggered attack
                        enemy.x = -50 - groupInAmbush * 30
                        enemy.y = 80 + (index % 3) * 80 + Math.random() * 40
                        break
                    default:
                        enemy.x = -50 - groupInAmbush * 50
                        enemy.y = boardCenter
                        break
                }
            })
            break

        case 'flanking':
            // Enemies attack from top and bottom simultaneously
            enemies.forEach((enemy, index) => {
                enemy.x = -50 - Math.floor(index / 2) * 50 // Pairs spawn together
                enemy.y = index % 2 === 0 ? 60 : boardHeight - 60 // Top or bottom
            })
            break

        case 'group':
            // Enemies move in compact groups of 3
            enemies.forEach((enemy, index) => {
                const groupIndex = Math.floor(index / 3)
                const positionInGroup = index % 3
                const groupSpacing = 80
                const memberSpacing = 35

                enemy.x = -50 - groupIndex * groupSpacing
                enemy.y = boardCenter + (positionInGroup - 1) * memberSpacing
            })
            break

        case 'line':
            // Enemies march in a straight line with equal intervals
            enemies.forEach((enemy, index) => {
                enemy.x = -50 - Math.min(index * 60, 200) // Increased spacing
                enemy.y = boardCenter + (Math.random() - 0.5) * 40 // Small random variation
            })
            break

        case 'pincer':
            // Enemies attack from multiple angles - top, center, bottom
            enemies.forEach((enemy, index) => {
                const lane = index % 3
                const groupInLane = Math.floor(index / 3)

                enemy.x = -50 - groupInLane * 70

                switch (lane) {
                    case 0: // Top lane
                        enemy.y = 50
                        break
                    case 1: // Center lane
                        enemy.y = boardCenter
                        break
                    case 2: // Bottom lane
                        enemy.y = boardHeight - 50
                        break
                    default:
                        enemy.y = boardCenter
                        break
                }
            })
            break

        case 'scattered':
            // Enemies spread across the entire battlefield height
            enemies.forEach((enemy) => {
                enemy.x = -50 - Math.min(Math.random() * 120, 200) // More spread in timing
                enemy.y = 30 + Math.random() * (boardHeight - 60) // Full height coverage
            })
            break

        case 'waves':
            // Enemies come in distinct waves with significant delays
            enemies.forEach((enemy, index) => {
                const waveIndex = Math.floor(index / 8)
                const positionInWave = index % 4

                enemy.x = -50 - Math.min(waveIndex * 60, 200)
                enemy.y = boardCenter + (positionInWave - 1.5) * 30
            })
            break

        default:
            // Fallback to line formation
            enemies.forEach((enemy, enemyIndex) => {
                enemy.x = -50 - Math.min(enemyIndex * 60, 200)
                enemy.y = boardCenter
            })
            break
    }

    // Ensure enemies don't spawn outside board boundaries
    enemies.forEach((enemy) => {
        enemy.y = Math.max(20, Math.min(enemy.y, boardHeight - 20))
    })
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
            case 'phoenix':
                drawPhoenixEnemy(ctx, 0, 0, false)
                break
            case 'portal_miner':
                drawPortalMinerEnemy(ctx, 0, 0)
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
            case 'worm':
                drawWormEnemy(ctx, 0, 0)
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
            case 'phoenix':
                drawPhoenixEnemy(ctx, 0, 0, enemy.isReviving ?? false)
                break
            case 'portal_miner':
                drawPortalMinerEnemy(ctx, 0, 0)
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
            case 'worm':
                drawWormEnemy(ctx, 0, 0)
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
                right: 120,
                zIndex: 10,
                pointerEvents: 'none',
                animation: isShaking ? 'shake 0.5s' : undefined,
                background: 'transparent'
            }}
        >
            <div
                style={{
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
                right: 200,
                zIndex: 10,
                pointerEvents: 'none',
                animation: isShaking ? 'shake 0.5s' : undefined,
                background: 'transparent'
            }}
        >
            <div
                style={{
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
                right: 290,
                zIndex: 10,
                pointerEvents: 'none',
                background: 'transparent'
            }}
        >
            <div
                style={{
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
            // Clear canvas (use game config dimensions)
            ctx.clearRect(0, 0, GAME_CONFIG.boardWidth, GAME_CONFIG.boardHeight)

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
            height={GAME_CONFIG.boardHeight}
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                imageRendering: 'pixelated',
                pointerEvents: 'none'
            }}
            width={GAME_CONFIG.boardWidth}
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

const SpawnZone = () => {
    return (
        <div
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: GAME_CONFIG.spawnZoneWidth,
                height: GAME_CONFIG.boardHeight,
                background:
                    'linear-gradient(90deg, rgba(255, 0, 0, 0.15) 0%, rgba(255, 100, 0, 0.1) 70%, rgba(255, 100, 0, 0.05) 100%)',
                borderRight: '3px solid rgba(255, 0, 0, 0.6)',
                pointerEvents: 'none',
                zIndex: 1
            }}
        >
            {/* Warning stripes pattern */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(
                        -45deg,
                        transparent,
                        transparent 8px,
                        rgba(255, 0, 0, 0.1) 8px,
                        rgba(255, 0, 0, 0.1) 16px
                    )`,
                    pointerEvents: 'none'
                }}
            />

            {/* Animated border */}
            <div
                style={{
                    position: 'absolute',
                    right: -2,
                    top: 0,
                    width: 4,
                    height: '100%',
                    background: 'linear-gradient(0deg, #ff0000, #ff6600, #ff0000)',
                    animation: 'pulse 2s infinite',
                    pointerEvents: 'none'
                }}
            />

            {/* Gradient fade effect at the edge */}
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: 30,
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.2) 100%)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    )
}

// Server Zone Component - Protected area on the right
const ServerZone = ({ gameHealth }: { gameHealth: number }) => {
    const healthStatus = gameHealth > 70 ? 'healthy' : gameHealth > 30 ? 'warning' : 'critical'

    // Create server racks positions
    const serverRacks = [
        { x: 20, y: 30, type: 'main' },
        { x: 60, y: 50, type: 'proxy' },
        { x: 20, y: 150, type: 'database' },
        { x: 60, y: 180, type: 'backup' },
        { x: 20, y: 280, type: 'firewall' },
        { x: 60, y: 320, type: 'monitoring' }
    ]

    return (
        <div
            style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: GAME_CONFIG.serverZoneWidth,
                height: GAME_CONFIG.boardHeight,
                background:
                    'linear-gradient(270deg, rgba(0, 100, 255, 0.1) 0%, rgba(0, 150, 255, 0.05) 70%, rgba(0, 200, 255, 0.02) 100%)',
                borderLeft: `3px solid ${healthStatus === 'healthy' ? 'rgba(0, 255, 100, 0.8)' : healthStatus === 'warning' ? 'rgba(255, 200, 0, 0.8)' : 'rgba(255, 50, 50, 0.8)'}`,
                pointerEvents: 'none',
                zIndex: 1
            }}
        >
            {/* Circuit board pattern background */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 20px,
                        rgba(0, 255, 150, 0.05) 20px,
                        rgba(0, 255, 150, 0.05) 22px
                    ), repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 30px,
                        rgba(0, 200, 255, 0.03) 30px,
                        rgba(0, 200, 255, 0.03) 32px
                    )`,
                    pointerEvents: 'none'
                }}
            />

            {/* Animated data flow border */}
            <div
                style={{
                    position: 'absolute',
                    left: -2,
                    top: 0,
                    width: 4,
                    height: '100%',
                    background:
                        healthStatus === 'healthy'
                            ? 'linear-gradient(0deg, #00ff64, #00d4ff, #00ff64)'
                            : healthStatus === 'warning'
                              ? 'linear-gradient(0deg, #ffb000, #ff6600, #ffb000)'
                              : 'linear-gradient(0deg, #ff3232, #ff0000, #ff3232)',
                    animation: 'pulse 1.5s infinite',
                    pointerEvents: 'none'
                }}
            />

            {/* Server Racks  */}
            {serverRacks.map((rack, index) => (
                <div
                    key={`rack-${index}`}
                    style={{
                        position: 'absolute',
                        left: rack.x,
                        top: rack.y,
                        width: 32,
                        height: 40,
                        pointerEvents: 'none'
                    }}
                >
                    {/* Server rack base */}
                    <div
                        style={{
                            position: 'absolute',
                            width: 32,
                            height: 40,
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #444',
                            borderRadius: '2px'
                        }}
                    />

                    {/* Server units inside rack */}
                    {[0, 1, 2, 3].map((unit) => (
                        <div
                            key={`unit-${unit}`}
                            style={{
                                position: 'absolute',
                                left: 2,
                                top: 4 + unit * 8,
                                width: 28,
                                height: 6,
                                backgroundColor:
                                    healthStatus === 'critical' ? '#ff4444' : '#1a1a1a',
                                border: '1px solid #555',
                                borderRadius: '1px'
                            }}
                        >
                            {/* Status LEDs */}
                            <div
                                style={{
                                    position: 'absolute',
                                    right: 2,
                                    top: 1,
                                    width: 3,
                                    height: 3,
                                    backgroundColor:
                                        healthStatus === 'healthy'
                                            ? '#00ff00'
                                            : healthStatus === 'warning'
                                              ? '#ffaa00'
                                              : '#ff0000',
                                    borderRadius: '50%',
                                    animation: 'blink 2s infinite',
                                    animationDelay: `${index * 0.2 + unit * 0.1}s`
                                }}
                            />

                            {/* Activity indicators */}
                            {healthStatus !== 'critical' && (
                                <>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 2,
                                            top: 2,
                                            width: 8,
                                            height: 1,
                                            backgroundColor: '#00aaff',
                                            animation: 'dataFlow 1s infinite',
                                            animationDelay: `${index * 0.3}s`
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 12,
                                            top: 2,
                                            width: 6,
                                            height: 1,
                                            backgroundColor: '#00ff88',
                                            animation: 'dataFlow 0.8s infinite',
                                            animationDelay: `${index * 0.4}s`
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    ))}

                    {/* Rack ventilation grilles */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 4,
                            bottom: 2,
                            width: 24,
                            height: 2,
                            background:
                                'repeating-linear-gradient(90deg, #333 0px, #333 2px, transparent 2px, transparent 4px)'
                        }}
                    />
                </div>
            ))}

            {/* Cable management */}
            <div
                style={{
                    position: 'absolute',
                    left: 10,
                    top: 0,
                    width: 2,
                    height: '100%',
                    background: 'linear-gradient(0deg, #333, #666, #333)',
                    pointerEvents: 'none'
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    left: 80,
                    top: 0,
                    width: 2,
                    height: '100%',
                    background: 'linear-gradient(0deg, #444, #777, #444)',
                    pointerEvents: 'none'
                }}
            />

            {/* Status display */}
            <div
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color:
                        healthStatus === 'healthy'
                            ? 'rgba(0, 255, 100, 0.9)'
                            : healthStatus === 'warning'
                              ? 'rgba(255, 200, 0, 0.9)'
                              : 'rgba(255, 50, 50, 0.9)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                    fontFamily: 'monospace'
                }}
            >
                🖥️ SERVERS
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: 25,
                    right: 10,
                    color:
                        healthStatus === 'healthy'
                            ? 'rgba(0, 255, 100, 0.8)'
                            : healthStatus === 'warning'
                              ? 'rgba(255, 200, 0, 0.8)'
                              : 'rgba(255, 50, 50, 0.8)',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    pointerEvents: 'none',
                    fontFamily: 'monospace'
                }}
            >
                {healthStatus === 'healthy'
                    ? 'ONLINE'
                    : healthStatus === 'warning'
                      ? 'DEGRADED'
                      : 'CRITICAL'}
            </div>

            {/* Protection field effect */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 20,
                    height: '100%',
                    background: `linear-gradient(270deg, ${
                        healthStatus === 'healthy'
                            ? 'rgba(0, 255, 100, 0.1)'
                            : healthStatus === 'warning'
                              ? 'rgba(255, 200, 0, 0.1)'
                              : 'rgba(255, 50, 50, 0.1)'
                    } 0%, transparent 100%)`,
                    animation: 'shimmer 3s infinite',
                    pointerEvents: 'none'
                }}
            />

            {/* Data transmission visualization */}
            {healthStatus !== 'critical' && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        right: 10,
                        height: 20,
                        border: '1px solid rgba(0, 200, 255, 0.3)',
                        borderRadius: '2px',
                        background: 'rgba(0, 100, 200, 0.05)',
                        pointerEvents: 'none'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: 2,
                            top: 2,
                            width: '100%',
                            height: 4,
                            background: 'linear-gradient(90deg, transparent, #00aaff, transparent)',
                            animation: 'dataTransfer 2s infinite'
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            left: 2,
                            bottom: 2,
                            width: '100%',
                            height: 4,
                            background:
                                'linear-gradient(270deg, transparent, #00ff88, transparent)',
                            animation: 'dataTransfer 1.5s infinite'
                        }}
                    />
                </div>
            )}
        </div>
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
                right: 120,
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

interface DifficultyScaling {
    countMultiplier: number
    description: string
    healthMultiplier: number
    intensityLevel: 'extreme' | 'high' | 'low' | 'medium'
    rewardMultiplier: number
    speedMultiplier: number
}

const calculateAdvancedDifficulty = (wave: number): DifficultyScaling => {
    const config = GAME_CONFIG.difficulty

    // Logarithmic base progression (smoother than linear)
    const baseProgress = Math.log(wave + 1) / Math.log(config.logarithmicBase)

    // Cyclical variations - creates peaks and valleys in difficulty
    const cyclicalOffset = Math.sin((wave * Math.PI * 2) / config.cyclePeriod) * 0.15

    // Plateau periods - every N waves have reduced scaling for breather
    const plateauFactor = wave % 12 < 4 ? config.plateauReduction : 1.0

    // Random fluctuations for unpredictability
    const randomSeed = Math.sin(wave * 123.456) // Deterministic "random" based on wave
    const fluctuation = randomSeed * config.fluctuationIntensity

    // Calculate raw multipliers
    const healthBase =
        1 + (baseProgress * config.healthScalingBase + cyclicalOffset + fluctuation) * plateauFactor
    const speedBase =
        1 +
        (baseProgress * config.speedScalingBase + cyclicalOffset * 0.5 + fluctuation * 0.5) *
            plateauFactor
    const countBase =
        1 +
        (baseProgress * config.countScalingBase + cyclicalOffset * 0.3 + fluctuation * 0.4) *
            plateauFactor
    const rewardBase =
        1 + (baseProgress * config.rewardScalingBase + fluctuation * 0.3) * plateauFactor

    // Apply caps to prevent runaway scaling
    const healthMultiplier = Math.min(healthBase, config.scalingCap)
    const speedMultiplier = Math.max(Math.min(speedBase, config.scalingCap * 0.6), 1.0) // Speed caps lower, but never goes below 1.0 (only acceleration, no deceleration)
    const countMultiplier = Math.min(countBase, config.scalingCap * 0.8) // Count caps at 80% of main cap
    const rewardMultiplier = Math.max(rewardBase, 1.0) // Rewards never decrease

    // Determine intensity level and description
    let intensityLevel: DifficultyScaling['intensityLevel'] = 'low'
    let description = 'Standard difficulty'

    const averageMultiplier = (healthMultiplier + speedMultiplier) / 2

    if (averageMultiplier >= 2.5) {
        intensityLevel = 'extreme'
        description = 'Extreme threat level - maximum enemy enhancement!'
    } else if (averageMultiplier >= 2.0) {
        intensityLevel = 'high'
        description = 'High threat level - significantly enhanced enemies'
    } else if (averageMultiplier >= 1.5) {
        intensityLevel = 'medium'
        description = 'Medium threat level - moderately enhanced enemies'
    } else {
        intensityLevel = 'low'
        description = 'Low threat level - slightly enhanced enemies'
    }

    // Special descriptions for plateau periods
    if (plateauFactor < 1.0) {
        description += ' (Breather period - reduced scaling)'
    }

    // Special descriptions for peak periods
    if (cyclicalOffset > 0.1) {
        description += ' (Peak intensity!)'
    }

    return {
        healthMultiplier,
        speedMultiplier,
        countMultiplier,
        rewardMultiplier,
        description,
        intensityLevel
    }
}

// Advanced enemy spawning system with weighted probabilities
const getEnemySpawnWeights = (wave: number): Record<Enemy['type'], number> => {
    const weights: Record<Enemy['type'], number> = {
        // Basic enemies - always available
        malware: 100,
        hacker: 80,
        ddos: 60,
        worm: 90,

        // Special enemies - unlock based on wave with increasing weights
        shielded: wave >= 2 ? Math.min(20 + (wave - 2) * 2, 40) : 0,
        voltage: wave >= 3 ? Math.min(15 + (wave - 3) * 2, 35) : 0,
        replicator: wave >= 4 ? Math.min(10 + (wave - 4) * 2, 30) : 0,
        phoenix: wave >= 5 ? Math.min(5 + (wave - 5) * 1, 20) : 0,
        portal_miner: wave >= 7 ? Math.min(8 + (wave - 7) * 1, 25) : 0,

        // Boss enemy - special rules
        spider: 0 // Handled separately with strict limits
    }

    return weights
}

const selectEnemyType = (wave: number, currentSpiders: number): Enemy['type'] => {
    // Spider special logic - max 1 on screen, 15% chance after wave 3
    if (wave >= 3 && currentSpiders === 0 && Math.random() < 0.15) {
        return 'spider'
    }

    // Weighted selection for other enemies
    const weights = getEnemySpawnWeights(wave)
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)

    if (totalWeight === 0) {
        // Fallback to basic enemies
        const basicEnemies: Enemy['type'][] = ['malware', 'hacker', 'ddos', 'worm']
        return basicEnemies[Math.floor(Math.random() * basicEnemies.length)]
    }

    const random = Math.random() * totalWeight
    let currentWeight = 0

    for (const [enemyType, weight] of Object.entries(weights)) {
        currentWeight += weight
        if (random <= currentWeight) {
            return enemyType as Enemy['type']
        }
    }

    // Fallback (should never reach here)
    return 'malware'
}

// Enemy spawn limits per wave to prevent spam
const getEnemySpawnLimits = (wave: number): Partial<Record<Enemy['type'], number>> => {
    return {
        spider: 2, // Only 2 spiders max
        phoenix: Math.min(Math.floor(wave / 5), 2), // Max 2 phoenixes, unlock every 5 waves
        replicator: Math.min(Math.floor(wave / 4), 3), // Max 3 replicators
        portal_miner: Math.min(Math.floor(wave / 3), 2), // Max 2 portal miners
        voltage: Math.min(Math.floor(wave / 2), 4) // Max 4 voltage enemies
    }
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
        currentWaveInfo: null,
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
        serverDefenseDamageDealt: 0,
        totalCoinsEarned: 0,
        totalInterestEarned: 0,
        // Visual effects
        lastDamageTime: 0,
        isShaking: false,
        globalEvents: {
            activeEvents: [],
            scheduledEvents: [],
            lastEventWave: 0,
            lastEventActivations: {
                disk_format: 0,
                data_flood: 0
            }
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

        // Count current enemies for spawn limits
        const currentSpiders = gameState.enemies.filter((enemy) => enemy.type === 'spider').length
        const currentEnemyCounts: Partial<Record<Enemy['type'], number>> = {}
        gameState.enemies.forEach((enemy) => {
            currentEnemyCounts[enemy.type] = (currentEnemyCounts[enemy.type] || 0) + 1
        })

        // Get event multipliers
        const eventMultipliers = GlobalEventManager.getActiveEventMultipliers(
            gameState.globalEvents
        )

        // Advanced enemy count calculation
        const difficultyScaling = calculateAdvancedDifficulty(gameState.wave)
        const formation = selectFormation(gameState.wave)
        const waveType = selectWaveType(gameState.wave)
        const waveTypeConfig = WAVE_TYPES[waveType]

        // Calculate final enemy count with all modifiers
        const baseEnemyCount = GAME_CONFIG.waveEnemyCount + Math.floor(gameState.wave * 0.3)
        const enemyCount = Math.floor(
            baseEnemyCount *
                difficultyScaling.countMultiplier *
                FORMATION_COUNT_MODIFIERS[formation] *
                waveTypeConfig.countMultiplier *
                eventMultipliers.enemyCountMultiplier
        )

        // Get spawn limits for this wave
        const spawnLimits = getEnemySpawnLimits(gameState.wave)
        const waveEnemyCounts: Partial<Record<Enemy['type'], number>> = {}

        for (let i = 0; i < enemyCount; i++) {
            // Use improved enemy selection system
            const selectedType = selectEnemyType(
                gameState.wave,
                currentSpiders + (waveEnemyCounts.spider || 0)
            )

            // Check spawn limits
            const currentCount =
                (currentEnemyCounts[selectedType] || 0) + (waveEnemyCounts[selectedType] || 0)
            const limit = spawnLimits[selectedType]

            let randomType: Enemy['type']
            if (limit !== undefined && currentCount >= limit) {
                // If we hit the limit, fall back to basic enemies
                const basicEnemies: Enemy['type'][] = ['malware', 'hacker', 'ddos', 'worm']
                randomType = basicEnemies[Math.floor(Math.random() * basicEnemies.length)]
            } else {
                randomType = selectedType
            }

            // Track wave spawns for limits
            waveEnemyCounts[randomType] = (waveEnemyCounts[randomType] || 0) + 1

            const enemyTemplate = ENEMY_TYPES[randomType]

            // Apply advanced difficulty scaling + event multipliers + wave type modifiers
            const healthBoost = difficultyScaling.healthMultiplier * waveTypeConfig.healthMultiplier
            const speedBoost = difficultyScaling.speedMultiplier
            const rewardBoost = difficultyScaling.rewardMultiplier

            consola.log(
                `Wave ${gameState.wave}: ${difficultyScaling.description} | ${waveTypeConfig.name} (Count: ${enemyCount}, Health: ${healthBoost.toFixed(2)}x, Speed: ${speedBoost.toFixed(2)}x)`
            )

            // Log spawn system statistics
            const weights = getEnemySpawnWeights(gameState.wave)
            const limits = getEnemySpawnLimits(gameState.wave)
            consola.log(`🎲 Spawn Weights (Wave ${gameState.wave}):`, weights)
            consola.log(`📊 Spawn Limits (Wave ${gameState.wave}):`, limits)
            consola.log(`👾 Wave Enemy Distribution:`, waveEnemyCounts)

            enemies.push({
                id: `enemy-${i}-${Date.now()}`,
                x: -50,
                y: Math.random() * (GAME_CONFIG.boardHeight - 40) + 20,
                health: enemyTemplate.health * waveMultiplier * healthBoost,
                maxHealth: enemyTemplate.health * waveMultiplier * healthBoost,
                speed: enemyTemplate.speed * speedBoost,
                reward: Math.floor(enemyTemplate.reward * rewardBoost), // Variable rewards
                type: randomType,
                lastAttack: 0,
                shield: enemyTemplate.shield,
                maxShield: enemyTemplate.maxShield,
                hasShield: enemyTemplate.hasShield,
                slowEffect: enemyTemplate.slowEffect,
                disabledUntil: enemyTemplate.disabledUntil,
                originalSpeed: enemyTemplate.speed * speedBoost,
                isOriginal: randomType === 'replicator' ? true : undefined,
                buffs: {
                    healthBoost,
                    speedBoost
                }
            })
        }

        // Apply formation to enemies (formation was selected earlier)
        const formationInfo = FORMATION_INFO[formation]
        applyFormation(enemies, formation)

        // Create wave info with both formation and wave type
        const waveInfo: WaveInfo = {
            formation,
            formationName: formationInfo.name,
            formationDescription: formationInfo.description,
            waveType,
            waveTypeName: waveTypeConfig.name,
            waveTypeDescription: waveTypeConfig.description
        }

        setGameState((prev) => ({
            ...prev,
            enemies: [...prev.enemies, ...enemies],
            currentWaveInfo: waveInfo
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
                    // Handle Phoenix resurrection
                    if (
                        enemy.type === 'phoenix' &&
                        enemy.isReviving &&
                        enemy.reviveTime &&
                        now >= enemy.reviveTime
                    ) {
                        // Phoenix revives with 50% health
                        enemy.health = Math.floor(enemy.maxHealth * 0.5)
                        enemy.speed = enemy.originalSpeed || ENEMY_TYPES.phoenix.speed
                        enemy.isReviving = false
                        enemy.reviveTime = undefined

                        // Create revival effect
                        const revival: Explosion = {
                            id: `phoenix-revival-${Date.now()}-${Math.random()}`,
                            x: enemy.x,
                            y: enemy.y,
                            startTime: Date.now(),
                            duration: 1500,
                            type: 'enemy_death'
                        }
                        newState.explosions.push(revival)
                    }

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

                    // Check if enemy is in server zone (defensive systems)
                    const serverZoneLeft = GAME_CONFIG.boardWidth - GAME_CONFIG.serverZoneWidth
                    const isInServerZone = updatedEnemy.x >= serverZoneLeft

                    if (isInServerZone) {
                        // Apply server defense damage with cooldown
                        if (
                            !updatedEnemy.lastServerDamage ||
                            now - updatedEnemy.lastServerDamage >= GAME_CONFIG.serverDefenseInterval
                        ) {
                            updatedEnemy.health -= GAME_CONFIG.serverDefenseDamage
                            updatedEnemy.lastServerDamage = now

                            // Track server defense damage
                            newState.serverDefenseDamageDealt += GAME_CONFIG.serverDefenseDamage

                            // Create server defense lightning effect
                            if (updatedEnemy.health > 0) {
                                // Choose random server rack position for lightning origin
                                const serverRackPositions = [
                                    { x: serverZoneLeft + 20, y: 30 },
                                    { x: serverZoneLeft + 60, y: 50 },
                                    { x: serverZoneLeft + 20, y: 150 },
                                    { x: serverZoneLeft + 60, y: 180 },
                                    { x: serverZoneLeft + 20, y: 280 },
                                    { x: serverZoneLeft + 60, y: 320 }
                                ]
                                const randomRack =
                                    serverRackPositions[
                                        Math.floor(Math.random() * serverRackPositions.length)
                                    ]

                                const serverLightning: Lightning = {
                                    id: `server-defense-${Date.now()}-${Math.random()}`,
                                    fromX: randomRack.x + 16, // Center of server rack
                                    fromY: randomRack.y + 20, // Middle of server rack
                                    toX: updatedEnemy.x,
                                    toY: updatedEnemy.y,
                                    startTime: Date.now(),
                                    duration: 500, // Increased duration for better visibility
                                    isEnemyAttack: false,
                                    towerType: 'antivirus' // Use green lightning for server defense
                                }
                                newState.lightnings.push(serverLightning)

                                // Create small explosion effect at server rack for visual feedback
                                const serverFlash: Explosion = {
                                    id: `server-flash-${Date.now()}-${Math.random()}`,
                                    x: randomRack.x + 16,
                                    y: randomRack.y + 20,
                                    startTime: Date.now(),
                                    duration: 300,
                                    type: 'enemy_death'
                                }
                                newState.explosions.push(serverFlash)
                            }
                        }
                    }

                    return {
                        ...updatedEnemy,
                        x: updatedEnemy.x + updatedEnemy.speed
                    }
                })
                .filter((enemy) => {
                    if (enemy.x > GAME_CONFIG.boardWidth) {
                        // Damage to player health based on enemy strength
                        const enemyStats = ENEMY_TYPES[enemy.type]
                        const playerDamage = Math.floor(enemyStats.towerDamage * 1.0) // 100% of tower damage
                        newState.health -= playerDamage
                        newState.healthLost += playerDamage
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
                        // Chain lightning - find multiple targets (excluding spawn zone and reviving phoenixes)
                        const potentialTargets = newState.enemies.filter((enemy) => {
                            const distance = Math.sqrt(
                                (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                            )
                            return (
                                distance <= towerStats.range &&
                                enemy.x >= GAME_CONFIG.spawnZoneWidth &&
                                !(enemy.type === 'phoenix' && enemy.isReviving) // Phoenix is invulnerable while reviving
                            )
                        })
                        targets = potentialTargets.slice(0, tower.chainTargets || 3)
                    } else {
                        // Normal targeting - find single target (excluding spawn zone and reviving phoenixes)
                        const target = newState.enemies.find((enemy) => {
                            const distance = Math.sqrt(
                                (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                            )
                            return (
                                distance <= towerStats.range &&
                                enemy.x >= GAME_CONFIG.spawnZoneWidth &&
                                !(enemy.type === 'phoenix' && enemy.isReviving) // Phoenix is invulnerable while reviving
                            )
                        })
                        if (target) targets = [target]
                    }

                    if (targets.length > 0) {
                        tower.lastShot = now

                        targets.forEach((target) => {
                            // Handle shield system for shielded enemies
                            if (target.type === 'shielded' && target.shield && target.shield > 0) {
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
                                // Handle Phoenix resurrection before death
                                if (target.type === 'phoenix' && !target.hasRevived) {
                                    // Phoenix dies but will revive
                                    target.hasRevived = true
                                    target.isReviving = true
                                    target.reviveTime = now + 5000 // Revive after 5 seconds
                                    target.health = 1 // Keep alive with 1 HP until revive
                                    target.speed = 0 // Stop moving while reviving

                                    // Create phoenix death effect
                                    const phoenixDeath: Explosion = {
                                        id: `phoenix-death-${Date.now()}-${Math.random()}`,
                                        x: target.x,
                                        y: target.y,
                                        startTime: Date.now(),
                                        duration: 1200,
                                        type: 'enemy_death'
                                    }
                                    newState.explosions.push(phoenixDeath)

                                    return // Don't process normal death
                                }

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
                                            id: `replicator-copy-${target.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
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
                                            nearbyTower.disabledUntil = now + 3000 // 3 seconds
                                        }
                                    })
                                }

                                if (target.type === 'portal_miner') {
                                    // Portal Miner creates a portal that spawns 3 random enemies
                                    const portalExplosion: Explosion = {
                                        id: `portal-${Date.now()}-${Math.random()}`,
                                        x: target.x,
                                        y: target.y,
                                        startTime: Date.now(),
                                        duration: 2000, // Longer duration for portal effect
                                        type: 'enemy_death'
                                    }
                                    newState.explosions.push(portalExplosion)

                                    // Spawn 3 random enemies from the portal after a delay
                                    setTimeout(() => {
                                        const enemyTypes = [
                                            'ddos',
                                            'hacker',
                                            'malware',
                                            'worm'
                                        ] as const

                                        for (let i = 0; i < 3; i++) {
                                            const randomEnemyType =
                                                enemyTypes[
                                                    Math.floor(Math.random() * enemyTypes.length)
                                                ]
                                            const enemyStats = ENEMY_TYPES[randomEnemyType]

                                            // Create portal-spawned enemy with reduced health
                                            const portalEnemy: Enemy = {
                                                id: `portal-spawn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
                                                x: target.x + (Math.random() - 0.5) * 80, // Spawn near portal
                                                y: target.y + (Math.random() - 0.5) * 80,
                                                health: Math.floor(enemyStats.health * 0.7), // 70% health
                                                maxHealth: Math.floor(enemyStats.health * 0.7),
                                                speed: enemyStats.speed * 1.1, // 10% faster
                                                reward: Math.floor(enemyStats.reward * 0.8), // 80% reward
                                                type: randomEnemyType,
                                                lastAttack: 0,
                                                shield: 0,
                                                maxShield: 0,
                                                hasShield: false,
                                                slowEffect: 1,
                                                originalSpeed: enemyStats.speed * 1.1
                                            }

                                            // Add portal spawn effect
                                            const spawnEffect: Explosion = {
                                                id: `portal-spawn-effect-${Date.now()}-${Math.random()}-${i}`,
                                                x: portalEnemy.x,
                                                y: portalEnemy.y,
                                                startTime: Date.now(),
                                                duration: 800,
                                                type: 'enemy_death'
                                            }

                                            // Update game state asynchronously
                                            setGameState((prevState) => ({
                                                ...prevState,
                                                enemies: [...prevState.enemies, portalEnemy],
                                                explosions: [...prevState.explosions, spawnEffect]
                                            }))
                                        }
                                    }, 1500) // 1.5 second delay for portal opening
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
            currentWaveInfo: null,
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
            serverDefenseDamageDealt: 0,
            totalCoinsEarned: 0,
            totalInterestEarned: 0,
            // Visual effects
            lastDamageTime: 0,
            isShaking: false,
            globalEvents: {
                activeEvents: [],
                scheduledEvents: [],
                lastEventWave: 0,
                lastEventActivations: {
                    disk_format: 0,
                    data_flood: 0
                }
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

        // Check if trying to place in spawn zone
        if (x < GAME_CONFIG.spawnZoneWidth + 50) {
            return false
        }

        // Check if trying to place in server zone (protected area)
        if (x > GAME_CONFIG.boardWidth - GAME_CONFIG.serverZoneWidth) {
            return false
        }

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
                <Paper mb={0}>
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
                    <Paper p="md">
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
                            {/* Spawn Zone */}
                            <SpawnZone />

                            {/* Server Zone */}
                            <ServerZone gameHealth={gameState.health} />

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

                                    {/* Wave Info Display */}
                                    {gameState.currentWaveInfo && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 10,
                                                zIndex: 10,
                                                pointerEvents: 'none',
                                                background: 'transparent'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '2px solid var(--mantine-color-purple-6)',
                                                    maxWidth: '280px'
                                                }}
                                            >
                                                <Text
                                                    c="white"
                                                    fw={600}
                                                    size="xs"
                                                    style={{
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                                                        marginBottom: '2px'
                                                    }}
                                                >
                                                    ⚔️ {gameState.currentWaveInfo.formationName}
                                                </Text>
                                                <Text
                                                    c="cyan"
                                                    fw={500}
                                                    size="xs"
                                                    style={{
                                                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                                    }}
                                                >
                                                    🎯 {gameState.currentWaveInfo.waveTypeName}
                                                </Text>
                                            </div>
                                        </div>
                                    )}
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
                                    <Card p="xl" shadow="xl" withBorder>
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
                <Paper m={0} p="md">
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

                            <Grid.Col span={6}>
                                <Card p="sm" withBorder>
                                    <Group align="center" justify="space-between">
                                        <Text fw={500} size="sm">
                                            🖥️ Server Defense
                                        </Text>
                                        <Badge color="blue" variant="light">
                                            {Math.floor(gameState.serverDefenseDamageDealt)} damage
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
                    <Paper bg="gray.9" p="lg" shadow="xs" withBorder>
                        <Group align="center" gap="md" mb="lg">
                            <IconTrendingUp color="cyan" size={24} />
                            <Title c="cyan" order={4}>
                                Live Statistics
                            </Title>
                        </Group>

                        <Grid>
                            {/* Economics Card */}
                            <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                                <Card h="100%" p="md" withBorder>
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
                                <Card h="100%" p="md" withBorder>
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
                                <Card h="100%" p="md" withBorder>
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
                                <Card h="100%" p="md" withBorder>
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
                                        <Group justify="space-between">
                                            <Text c="dimmed" size="xs">
                                                Server Defense
                                            </Text>
                                            <Badge color="blue" size="sm" variant="light">
                                                {Math.floor(gameState.serverDefenseDamageDealt)}
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

                            {gameState.currentWaveInfo && (
                                <>
                                    <Group align="center" gap="xs">
                                        <IconSwords color="purple" size={16} />
                                        <Text c="purple" fw={500} size="sm">
                                            Formation: {gameState.currentWaveInfo.formationName}
                                        </Text>
                                    </Group>
                                    <Group align="center" gap="xs">
                                        <IconTarget color="cyan" size={16} />
                                        <Text c="cyan" fw={500} size="sm">
                                            Wave Type: {gameState.currentWaveInfo.waveTypeName}
                                        </Text>
                                    </Group>
                                </>
                            )}
                        </Group>
                    </Paper>
                )}

                {/* Tower Information Panel */}
                <Paper
                    bg="linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)"
                    p="sm"
                    shadow="xs"
                    withBorder
                >
                    <Title c="cyan" mb="sm" order={4}>
                        📊 Tower Information
                    </Title>
                    <Grid>
                        {Object.entries(TOWER_TYPES).map(([type, stats]) => (
                            <Grid.Col key={type} span={{ base: 12, sm: 4 }}>
                                <Card p="md" withBorder>
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
                    shadow="xs"
                    withBorder
                >
                    <Title c="red" mb="sm" order={4}>
                        👾 Enemy Information
                    </Title>
                    <Grid>
                        {Object.entries(ENEMY_TYPES).map(([type, stats]) => (
                            <Grid.Col key={type} span={{ base: 12, sm: 6, md: 4 }}>
                                <Card p="md" withBorder>
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
                                            {type === 'phoenix' && (
                                                <Badge color="gold" size="xs" variant="light">
                                                    LEGENDARY
                                                </Badge>
                                            )}
                                            {type === 'portal_miner' && (
                                                <Badge color="violet" size="xs" variant="light">
                                                    SPECIAL
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
                                        {type === 'phoenix' && (
                                            <>
                                                <Group justify="center">
                                                    <Badge color="gold" size="xs" variant="outline">
                                                        5% spawn chance after wave 5
                                                    </Badge>
                                                </Group>
                                                <Group justify="center">
                                                    <Badge
                                                        color="orange"
                                                        size="xs"
                                                        variant="outline"
                                                    >
                                                        Invulnerable during resurrection
                                                    </Badge>
                                                </Group>
                                            </>
                                        )}
                                        {type === 'portal_miner' && (
                                            <>
                                                <Group justify="center">
                                                    <Badge
                                                        color="violet"
                                                        size="xs"
                                                        variant="outline"
                                                    >
                                                        8% spawn chance after wave 7
                                                    </Badge>
                                                </Group>
                                                <Group justify="center">
                                                    <Badge
                                                        color="purple"
                                                        size="xs"
                                                        variant="outline"
                                                    >
                                                        Spawns 3 random enemies on death
                                                    </Badge>
                                                </Group>
                                                <Group justify="center">
                                                    <Badge color="gray" size="xs" variant="outline">
                                                        Portal enemies: 70% HP, 10% faster
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
                <Stack gap="md">
                    {/* Tower Defense Guide */}
                    <Paper p="lg" withBorder>
                        <Title c="cyan" mb="md" order={3}>
                            🏰 Defense Arsenal
                        </Title>

                        <Grid>
                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="blue" mb="sm" order={5}>
                                        🛡️ Tank Towers
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="sm">
                                            <strong>Firewall</strong> - Frontline defense
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 100 HP • 25 DMG • 80 Range • 1.0s Cooldown
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Best against: All enemies as main tank
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="teal" mb="sm" order={5}>
                                        ⚡ DPS Towers
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="sm">
                                            <strong>Antivirus</strong> - Balanced damage
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 100 HP • 15 DMG • 60 Range • 0.8s Cooldown
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Best against: Fast enemies (Malware, Worm)
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="indigo" mb="sm" order={5}>
                                        🔄 Support Towers
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="sm">
                                            <strong>Proxy</strong> - Wide coverage
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 50 HP • 10 DMG • 100 Range • 0.6s Cooldown
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Best against: Multiple weak enemies
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="cyan" mb="sm" order={5}>
                                        ❄️ Control Towers
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="sm">
                                            <strong>Slowdown</strong> - Crowd control
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 60 HP • 5 DMG • 120 Range • 0.8s Cooldown
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Special: 60% slowdown effect
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Card p="md" withBorder>
                                    <Title c="purple" mb="sm" order={5}>
                                        ⚡️ Special Towers
                                    </Title>
                                    <Text size="sm">
                                        <strong>Chain Lightning</strong> - Multi-target powerhouse
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        • 70 HP • 25 DMG • 90 Range • 1.2s Cooldown • Hits 2-3
                                        enemies
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        • Best against: Groups of enemies, swarm waves
                                    </Text>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Enemy Threats */}
                    <Paper p="lg" withBorder>
                        <Title c="red" mb="md" order={3}>
                            👾 Enemy Threats
                        </Title>

                        <Grid>
                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="pink" mb="sm" order={5}>
                                        🏃 Basic Enemies
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Malware</strong> - 15 HP, 4.0 spd, 8 dmg
                                        </Text>
                                        <Text size="xs">
                                            <strong>Worm</strong> - 20 HP, 3.5 spd, 10 dmg
                                        </Text>
                                        <Text size="xs">
                                            <strong>Hacker</strong> - 30 HP, 2.5 spd, 15 dmg
                                        </Text>
                                        <Text size="xs">
                                            <strong>DDoS</strong> - 60 HP, 1.5 spd, 25 dmg
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="green" mb="sm" order={5}>
                                        🛡️ Special Enemies
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Shielded</strong> - 100 HP, 3-hit shield
                                        </Text>
                                        <Text size="xs">
                                            <strong>Voltage</strong> - 120 HP, disables towers
                                        </Text>
                                        <Text size="xs">
                                            <strong>Replicator</strong> - 100 HP, creates copies
                                        </Text>
                                        <Text size="xs">
                                            <strong>Portal Miner</strong> - 80 HP, spawns 3 enemies
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="purple" mb="sm" order={5}>
                                        🕷️ Boss Enemies
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Spider</strong> - 180 HP, 35 dmg, 75 coins
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 15% spawn chance after wave 3
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Max 2 on screen simultaneously
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="gold" mb="sm" order={5}>
                                        🔥 Legendary Enemies
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Phoenix</strong> - 140 HP, resurrects once
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • 5% spawn chance after wave 5
                                        </Text>
                                        <Text c="dimmed" size="xs">
                                            • Invulnerable during revival (5s)
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Wave System */}
                    <Paper p="lg" withBorder>
                        <Title c="indigo" mb="md" order={3}>
                            🌊 Wave System
                        </Title>

                        <Grid>
                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="blue" mb="sm" order={5}>
                                        📊 Wave Types
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Standard</strong> - Balanced (1.0x count, 1.0x
                                            HP)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Swarm</strong> - Many weak (1.8x count, 0.7x HP)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Elite</strong> - Few strong (0.8x count, 1.2x
                                            HP)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Tsunami</strong> - Massive wave (3.0x count,
                                            0.5x HP)
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Tsunami appears every 8th wave (70% chance)
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="purple" mb="sm" order={5}>
                                        ⚔️ Formations
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            <strong>Single File</strong> - Predictable line
                                        </Text>
                                        <Text size="xs">
                                            <strong>Tight Formation</strong> - Compact groups (+20%)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Guerrilla</strong> - Scattered (+40%)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Ambush</strong> - Coordinated strikes (+30%)
                                        </Text>
                                        <Text size="xs">
                                            <strong>Pincer/Wave/Encirclement</strong> - Advanced
                                            tactics
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Advanced Systems */}
                    <Paper p="lg" withBorder>
                        <Title c="cyan" mb="md" order={3}>
                            🎯 Advanced Systems
                        </Title>

                        <Grid>
                            <Grid.Col span={4}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="green" mb="sm" order={5}>
                                        💰 Economy
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • Passive: +{GAME_CONFIG.economy.basePassiveIncome}{' '}
                                            coins/sec
                                        </Text>
                                        <Text size="xs">
                                            • Interest: {GAME_CONFIG.economy.interestRate * 100}%
                                            every {GAME_CONFIG.economy.interestInterval / 1000}s
                                        </Text>
                                        <Text size="xs">
                                            • Wave bonus: +{GAME_CONFIG.economy.waveCompletionBonus}{' '}
                                            coins
                                        </Text>
                                        <Text size="xs">
                                            • Kill bonus: {GAME_CONFIG.economy.killBonusMultiplier}x
                                            multiplier
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Passive disabled at{' '}
                                            {GAME_CONFIG.economy.passiveIncomeLimit}+ coins
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={4}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="teal" mb="sm" order={5}>
                                        🔄 Regeneration
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">• Health: +0.5 HP/2s</Text>
                                        <Text size="xs">• Wave complete: +20 HP</Text>
                                        <Text size="xs">
                                            • Server defense: {GAME_CONFIG.serverDefenseDamage} DPS
                                        </Text>
                                        <Text c="red" size="xs">
                                            • Requires at least 1 tower
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={4}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="orange" mb="sm" order={5}>
                                        🎲 Spawn Limits
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">• Spider: 2 max</Text>
                                        <Text size="xs">• Phoenix: wave/5 (max 2)</Text>
                                        <Text size="xs">• Replicator: wave/4 (max 3)</Text>
                                        <Text size="xs">• Portal Miner: wave/3 (max 2)</Text>
                                        <Text size="xs">• Voltage: wave/2 (max 4)</Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Strategy Guide */}
                    <Paper p="lg" withBorder>
                        <Title c="yellow" mb="md" order={3}>
                            🎯 Master Strategy Guide
                        </Title>

                        <Grid>
                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="blue" mb="sm" order={5}>
                                        🏗️ Build Strategy
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • <strong>Firewall</strong> frontline tanks
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Antivirus</strong> behind tanks for DPS
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Proxy</strong> for wide area coverage
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Slowdown</strong> for crowd control
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Chain Lightning</strong> for groups
                                        </Text>
                                        <Text c="red" size="xs">
                                            • Keep minimum {GAME_CONFIG.minTowerDistance}px distance
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="red" mb="sm" order={5}>
                                        ⚡ Priority Targeting
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            1. <strong>Portal Miner</strong> - spawns 3 enemies
                                        </Text>
                                        <Text size="xs">
                                            2. <strong>Spider</strong> - 35 damage, high reward
                                        </Text>
                                        <Text size="xs">
                                            3. <strong>Phoenix</strong> - resurrects once
                                        </Text>
                                        <Text size="xs">
                                            4. <strong>Replicator</strong> - creates copies
                                        </Text>
                                        <Text size="xs">
                                            5. <strong>Voltage</strong> - disables towers
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Focus fire on threats first!
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="purple" mb="sm" order={5}>
                                        🌊 Wave-Specific Tips
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • <strong>Tsunami</strong>: Chain Lightning + wide
                                            coverage
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Swarm</strong>: Area damage towers
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Elite</strong>: High-damage focus fire
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Ambush</strong>: Overlapping coverage
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Guerrilla</strong>: Proxy towers
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Adapt to formation types!
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="green" mb="sm" order={5}>
                                        💰 Economic Tips
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • Don't hoard coins (passive stops at{' '}
                                            {GAME_CONFIG.economy.passiveIncomeLimit}+)
                                        </Text>
                                        <Text size="xs">• Spend regularly to maintain income</Text>
                                        <Text size="xs">• Save coins for emergency rebuilds</Text>
                                        <Text size="xs">
                                            • Interest maxes at{' '}
                                            {GAME_CONFIG.economy.maxInterestBase} coin base
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Balance spending vs saving
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Global Events */}
                    <Paper p="lg" withBorder>
                        <Title c="orange" mb="md" order={3}>
                            🌍 Global Events
                        </Title>

                        <Grid>
                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="red" mb="sm" order={5}>
                                        💽 Disk Format
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • <strong>Effect:</strong> All towers destroyed
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Duration:</strong> 2 seconds
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Frequency:</strong> Every 4-7 waves
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Priority:</strong> 100 (Highest)
                                        </Text>
                                        <Text c="orange" size="xs">
                                            • Save coins for emergency rebuild!
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="blue" mb="sm" order={5}>
                                        🌊 Data Flood
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • <strong>Effect:</strong> 2x enemies, 40% weaker
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Duration:</strong> 3 seconds
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Frequency:</strong> Every 8-12 waves
                                        </Text>
                                        <Text size="xs">
                                            • <strong>Priority:</strong> 80
                                        </Text>
                                        <Text c="green" size="xs">
                                            • Great for farming coins!
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>

                    {/* Quick Reference */}
                    <Paper p="lg" withBorder>
                        <Title c="violet" mb="md" order={3}>
                            ⚡ Quick Reference
                        </Title>

                        <Grid>
                            <Grid.Col span={3}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="red" mb="sm" order={6}>
                                        🚨 Critical Rules
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">• Keep 1+ towers alive</Text>
                                        <Text size="xs">
                                            • Don't hoard {GAME_CONFIG.economy.passiveIncomeLimit}+
                                            coins
                                        </Text>
                                        <Text size="xs">• Target special enemies first</Text>
                                        <Text size="xs">• Watch for global events</Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={3}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="blue" mb="sm" order={6}>
                                        🎯 Zones
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">• Red spawn zone (left)</Text>
                                        <Text size="xs">• Blue server zone (right)</Text>
                                        <Text size="xs">• Build in middle area</Text>
                                        <Text size="xs">
                                            • {GAME_CONFIG.minTowerDistance}px minimum distance
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={3}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="green" mb="sm" order={6}>
                                        💰 Economy
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">
                                            • +{GAME_CONFIG.economy.basePassiveIncome} coins/sec
                                            passive
                                        </Text>
                                        <Text size="xs">
                                            • +{GAME_CONFIG.economy.waveCompletionBonus} coins/wave
                                        </Text>
                                        <Text size="xs">
                                            • {GAME_CONFIG.economy.interestRate * 100}% interest/
                                            {GAME_CONFIG.economy.interestInterval / 1000}s
                                        </Text>
                                        <Text size="xs">
                                            • {GAME_CONFIG.economy.killBonusMultiplier}x kill bonus
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>

                            <Grid.Col span={3}>
                                <Card h="100%" p="md" withBorder>
                                    <Title c="orange" mb="sm" order={6}>
                                        🏥 Health
                                    </Title>
                                    <Stack gap="xs">
                                        <Text size="xs">• +0.5 HP/2s regen</Text>
                                        <Text size="xs">• +20 HP/wave</Text>
                                        <Text size="xs">
                                            • Server defense: {GAME_CONFIG.serverDefenseDamage} DPS
                                        </Text>
                                        <Text size="xs">• Requires active towers</Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        </Grid>
                    </Paper>
                </Stack>
            </Stack>
        </Container>
    )
}
