/* eslint-disable no-nested-ternary */
/* eslint-disable indent */

import {
    IconBolt,
    IconBuilding,
    IconCoins,
    IconCurrencyDollar,
    IconFlame,
    IconHeart,
    IconHome,
    IconRefresh,
    IconServer,
    IconShield,
    IconShieldCheck,
    IconSwords,
    IconTarget,
    IconTrendingUp,
    IconTrophy,
    IconUsers
} from '@tabler/icons-react'
import {
    ActionIcon,
    Alert,
    Badge,
    Box,
    Button,
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
import { useNavigate } from 'react-router-dom'
import { HiRefresh } from 'react-icons/hi'

import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

import classes from './ProxyDefense.module.css'

interface Enemy {
    health: number
    id: string
    lastAttack: number
    maxHealth: number
    reward: number
    speed: number
    type: 'ddos' | 'hacker' | 'malware' | 'spider'
    x: number
    y: number
}

interface Tower {
    cooldown: number
    cost: number
    damage: number
    health: number
    id: string
    lastShot: number
    maxHealth: number
    range: number
    type: 'antivirus' | 'firewall' | 'proxy'
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

interface GameState {
    coins: number
    coinsSpent: number
    enemies: Enemy[]
    // Statistics
    enemiesKilled: number
    explosions: Explosion[]
    formatStartTime: number
    health: number
    healthLost: number
    isFormatting: boolean
    isGameOver: boolean
    isGameStarted: boolean
    isShaking: boolean
    // Visual effects
    lastDamageTime: number
    lastHealthRegen: number
    lastMoneyRegen: number
    lightnings: Lightning[]
    // Disk format event
    nextFormatWave: number
    score: number
    selectedTowerType: null | Tower['type']
    totalCoinsEarned: number
    towers: Tower[]
    towersBuilt: number
    wave: number
}

const TOWER_TYPES = {
    firewall: { damage: 20, range: 80, cost: 50, cooldown: 1000, health: 100, color: 'blue' },
    antivirus: { damage: 15, range: 60, cost: 30, cooldown: 800, health: 60, color: 'teal' },
    proxy: { damage: 10, range: 100, cost: 25, cooldown: 600, health: 40, color: 'indigo' }
}

const ENEMY_TYPES = {
    hacker: {
        health: 30,
        speed: 2.5,
        reward: 15,
        color: 'red',
        towerDamage: 15,
        attackRange: 50,
        attackCooldown: 1500
    },
    ddos: {
        health: 60,
        speed: 1.5,
        reward: 30,
        color: 'orange',
        towerDamage: 25,
        attackRange: 60,
        attackCooldown: 800
    },
    malware: {
        health: 15,
        speed: 4,
        reward: 10,
        color: 'pink',
        towerDamage: 8,
        attackRange: 40,
        attackCooldown: 1200
    },
    spider: {
        health: 180,
        speed: 1.8,
        reward: 75,
        color: 'purple',
        towerDamage: 35,
        attackRange: 70,
        attackCooldown: 600
    }
}

const GAME_CONFIG = {
    boardWidth: 800,
    boardHeight: 400,
    startHealth: 100,
    startCoins: 100,
    waveEnemyCount: 5
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
            case 'firewall':
                drawFirewallTower(ctx, 0, 0, tower.health, tower.maxHealth)
                break
            case 'proxy':
                drawProxyTower(ctx, 0, 0)
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
            case 'spider':
                drawSpiderEnemy(ctx, 0, 0)
                break
            default:
                break
        }
    }, [enemy.type, enemy.health, enemy.maxHealth, spriteSize])

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
                    fw={700}
                    size="sm"
                    style={{
                        color: healthColor,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}
                >
                    {health}
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

export const ProxyDefensePage = () => {
    const navigate = useNavigate()
    const { resetClicks } = useEasterEggStore()

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
        lastMoneyRegen: 0,
        // Statistics
        enemiesKilled: 0,
        towersBuilt: 0,
        healthLost: 0,
        coinsSpent: 0,
        totalCoinsEarned: 0,
        // Visual effects
        lastDamageTime: 0,
        isShaking: false,
        // Disk format event
        nextFormatWave: 4 + Math.floor(Math.random() * 4), // Random between 4-7
        isFormatting: false,
        formatStartTime: 0
    })

    const spawnWave = useCallback(() => {
        const enemies: Enemy[] = []
        const waveMultiplier = Math.floor(gameState.wave / 5) + 1

        // Count current spiders on screen
        const currentSpiders = gameState.enemies.filter((enemy) => enemy.type === 'spider').length

        for (let i = 0; i < GAME_CONFIG.waveEnemyCount + gameState.wave; i++) {
            const types = Object.keys(ENEMY_TYPES) as Array<keyof typeof ENEMY_TYPES>
            let randomType: keyof typeof ENEMY_TYPES

            // Spider spawning logic: 15% chance after wave 3, max 2 on screen
            const shouldSpawnSpider =
                gameState.wave >= 3 &&
                Math.random() < 0.15 &&
                currentSpiders < 2 &&
                enemies.filter((e) => e.type === 'spider').length < 2

            if (shouldSpawnSpider) {
                randomType = 'spider'
            } else {
                // Filter out spider from regular spawning
                const regularTypes = types.filter((type) => type !== 'spider')
                randomType = regularTypes[Math.floor(Math.random() * regularTypes.length)]
            }

            const enemyTemplate = ENEMY_TYPES[randomType]

            enemies.push({
                id: `enemy-${i}-${Date.now()}`,
                x: -50,
                y: Math.random() * (GAME_CONFIG.boardHeight - 40) + 20,
                health: enemyTemplate.health * waveMultiplier,
                maxHealth: enemyTemplate.health * waveMultiplier,
                speed: enemyTemplate.speed,
                reward: enemyTemplate.reward,
                type: randomType,
                lastAttack: 0
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

            // Passive regeneration (0.5 HP per second only with towers, 5 coins per second)
            if (now - newState.lastHealthRegen >= 2000 && newState.towers.length > 0) {
                newState.health = Math.min(newState.health + 0.5, GAME_CONFIG.startHealth)
                newState.lastHealthRegen = now
            }

            if (now - newState.lastMoneyRegen >= 1000) {
                newState.coins += 5
                newState.totalCoinsEarned += 5
                newState.lastMoneyRegen = now
            }

            // Update enemies
            newState.enemies = newState.enemies
                .map((enemy) => ({
                    ...enemy,
                    x: enemy.x + enemy.speed
                }))
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
                if (now - tower.lastShot >= tower.cooldown) {
                    const towerStats = TOWER_TYPES[tower.type]
                    const target = newState.enemies.find((enemy) => {
                        const distance = Math.sqrt(
                            (enemy.x - tower.x) ** 2 + (enemy.y - tower.y) ** 2
                        )
                        return distance <= towerStats.range
                    })

                    if (target) {
                        target.health -= tower.damage
                        // eslint-disable-next-line no-param-reassign
                        tower.lastShot = now

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
                            newState.coins += target.reward
                            newState.score += target.reward * 2
                            newState.enemiesKilled += 1
                            newState.totalCoinsEarned += target.reward

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

            // Check if wave is cleared
            if (newState.enemies.length === 0 && prev.enemies.length > 0) {
                newState.wave++
                newState.coins += 50
                newState.totalCoinsEarned += 50
                // Restore 20 HP on wave completion
                newState.health = Math.min(newState.health + 20, GAME_CONFIG.startHealth)

                // Check for disk format event
                if (newState.wave === newState.nextFormatWave && !newState.isFormatting) {
                    newState.isFormatting = true
                    newState.formatStartTime = Date.now()
                    // Schedule tower destruction after 2 seconds
                    setTimeout(() => {
                        setGameState((current) => ({
                            ...current,
                            towers: [],
                            isFormatting: false,
                            nextFormatWave: current.wave + 4 + Math.floor(Math.random() * 4) // Next format in 4-7 waves
                        }))
                    }, 2000)
                }

                setTimeout(() => spawnWave(), 2000)
            }

            // Handle visual effects
            if (newState.isShaking && now - newState.lastDamageTime >= 500) {
                newState.isShaking = false
            }

            // Check game over
            if (newState.health <= 0) {
                newState.isGameOver = true
            }

            return newState
        })
    }, [spawnWave])

    const startGame = () => {
        setGameState((prev) => ({
            ...prev,
            isGameStarted: true,
            isGameOver: false
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
            lastMoneyRegen: 0,
            // Statistics
            enemiesKilled: 0,
            towersBuilt: 0,
            healthLost: 0,
            coinsSpent: 0,
            totalCoinsEarned: 0,
            // Visual effects
            lastDamageTime: 0,
            isShaking: false,
            // Disk format event
            nextFormatWave: 4 + Math.floor(Math.random() * 4), // Random between 4-7
            isFormatting: false,
            formatStartTime: 0
        })
    }

    const placeTower = (x: number, y: number) => {
        if (!gameState.selectedTowerType) return

        const towerType = TOWER_TYPES[gameState.selectedTowerType]
        if (gameState.coins < towerType.cost) return

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
            lastShot: 0
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

    return (
        <Container py="xl" size="xl">
            <Stack gap="xl">
                <Group align="center" justify="space-between">
                    <div>
                        <Title c="cyan" order={1}>
                            🛡️ Proxy Defense
                        </Title>
                        <Text c="dimmed" size="lg">
                            Protect your proxy servers from attacks!
                        </Text>
                    </div>

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

                {/* Game Stats */}
                <Group gap="xl" justify="center">
                    <Tooltip
                        label={
                            gameState.towers.length > 0
                                ? 'Health regenerating: +0.5 HP every 2 seconds'
                                : 'No healing! Build towers to restore health'
                        }
                        withArrow
                    >
                        <Badge
                            color="red"
                            leftSection={<IconHeart size={16} />}
                            size="lg"
                            variant="light"
                        >
                            HP: {gameState.health} {gameState.towers.length > 0 ? '💊' : '⚠️'}
                        </Badge>
                    </Tooltip>
                    <Badge
                        color="yellow"
                        leftSection={<IconCoins size={16} />}
                        size="lg"
                        variant="light"
                    >
                        Coins: {gameState.coins}
                    </Badge>
                    <Badge
                        color="blue"
                        leftSection={<IconTrophy size={16} />}
                        size="lg"
                        variant="light"
                    >
                        Score: {gameState.score}
                    </Badge>
                    <Badge color="purple" size="lg" variant="light">
                        Wave: {gameState.wave}
                    </Badge>
                    <Badge color="gray" size="lg" variant="light">
                        Towers: {gameState.towers.length}
                    </Badge>
                    <Badge color="green" size="lg" variant="light">
                        Kills: {gameState.enemiesKilled}
                    </Badge>
                    <Badge color="orange" size="lg" variant="light">
                        Built: {gameState.towersBuilt}
                    </Badge>
                </Group>

                {/* Tower Selection */}
                <Paper bg="gray.9" p="sm" radius="md" shadow="xs" withBorder>
                    <Grid>
                        {Object.entries(TOWER_TYPES).map(([type, stats]) => (
                            <Grid.Col key={type} span={{ base: 12, sm: 4 }}>
                                <Card
                                    onClick={() => {
                                        if (gameState.coins >= stats.cost) {
                                            setGameState((prev) => ({
                                                ...prev,
                                                selectedTowerType: type as Tower['type']
                                            }))
                                        }
                                    }}
                                    p="md"
                                    radius="md"
                                    style={{
                                        cursor:
                                            gameState.coins >= stats.cost
                                                ? 'pointer'
                                                : 'not-allowed',
                                        opacity: gameState.coins < stats.cost ? 0.6 : 1,
                                        border:
                                            gameState.selectedTowerType === type
                                                ? `2px solid var(--mantine-color-${stats.color}-5)`
                                                : `2px solid var(--mantine-color-gray-7)`
                                    }}
                                >
                                    <Group align="center" gap="sm" mb="sm">
                                        {type === 'firewall' ? (
                                            <IconShield color={stats.color} size={20} />
                                        ) : type === 'antivirus' ? (
                                            <IconBolt color={stats.color} size={20} />
                                        ) : (
                                            <IconServer color={stats.color} size={20} />
                                        )}
                                        <Text c={stats.color} fw={600} size="sm">
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
                                        {gameState.selectedTowerType === type && (
                                            <Badge color={stats.color} size="sm" variant="filled">
                                                Selected
                                            </Badge>
                                        )}
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

                {/* Game Board */}
                <Paper p="md" radius="md" withBorder>
                    <Box
                        className={classes.gameBoard}
                        onClick={handleBoardClick}
                        style={{
                            width: GAME_CONFIG.boardWidth,
                            height: GAME_CONFIG.boardHeight,
                            position: 'relative',
                            background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
                            border: '2px solid #00d4ff',
                            borderRadius: '8px',
                            cursor: gameState.selectedTowerType ? 'crosshair' : 'default',
                            margin: '0 auto',
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

                        {/* Health Indicator */}
                        {gameState.isGameStarted && (
                            <HealthIndicator
                                health={gameState.health}
                                isShaking={gameState.isShaking}
                            />
                        )}

                        {/* Critical Health Border Effect */}
                        {gameState.isGameStarted && gameState.health <= 30 && (
                            <div className={classes.criticalHealthBorder} />
                        )}

                        {/* Disk Format Event */}
                        {gameState.isFormatting && (
                            <div className={classes.formattedDisplayContainer}>
                                <div className={classes.formattedDisplay}>
                                    <div>💽 DISK FORMATTED 💽</div>
                                    <div className={classes.formattedDisplayText}>
                                        All towers destroyed!
                                    </div>
                                </div>
                            </div>
                        )}

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

                {/* Game Over Modal */}
                <Modal
                    centered
                    onClose={() => {}}
                    opened={gameState.isGameOver}
                    size="lg"
                    title={
                        <Text c="red" fw={700} size="xl">
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
                                    color={
                                        gameState.score > 1000
                                            ? 'green'
                                            : gameState.score > 500
                                              ? 'yellow'
                                              : gameState.score > 200
                                                ? 'orange'
                                                : 'red'
                                    }
                                    size="lg"
                                    variant="light"
                                >
                                    {gameState.score > 1000
                                        ? '🥇 LEGENDARY DEFENDER'
                                        : gameState.score > 500
                                          ? '🥈 SKILLED PROTECTOR'
                                          : gameState.score > 200
                                            ? '🥉 DECENT GUARDIAN'
                                            : '🔰 ROOKIE ADMIN'}
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
                        <Text c="cyan" fw={600} size="lg">
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
                        <Text c="green" fw={600} size="lg">
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

                        {/* Net Profit */}
                        <Card p="md" withBorder>
                            <Group align="center" justify="center">
                                <Text c="dimmed" fw={500}>
                                    💎 Net Profit
                                </Text>
                                <Text
                                    c={
                                        gameState.totalCoinsEarned - gameState.coinsSpent >= 0
                                            ? 'green'
                                            : 'red'
                                    }
                                    fw={700}
                                    size="lg"
                                >
                                    {(
                                        gameState.totalCoinsEarned - gameState.coinsSpent
                                    ).toLocaleString()}{' '}
                                    coins
                                </Text>
                            </Group>
                        </Card>

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
                                        <IconCurrencyDollar color="teal" size={20} />
                                        <Text c="teal" fw={600} size="sm">
                                            Economics
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
                                                Spent
                                            </Text>
                                            <Badge color="orange" size="sm" variant="light">
                                                {gameState.coinsSpent.toLocaleString()}
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
                        </Group>
                    </Paper>
                )}

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
                        <br />
                        • +5 Coins every second (passive income)
                        <br />
                        • +20 HP bonus when completing each wave
                        <br />
                        <br />
                        <strong>🎯 STRATEGY TIPS:</strong>
                        <br />
                        • Use Firewall towers as frontline tanks to absorb damage
                        <br />
                        • Place Antivirus towers behind Firewalls for sustained DPS
                        <br />
                        • Proxy towers are great for covering large areas cheaply
                        <br />• <strong>CRITICAL:</strong> Keep at least one tower alive - no towers
                        = no healing!
                        <br />
                        • Watch tower health bars - replace destroyed towers quickly!
                        <br />• Enemy difficulty increases every 5 waves with health multipliers
                        <br />• <strong>SPIDER STRATEGY:</strong> Focus fire on spiders immediately
                        - they're worth 75 coins but deal massive damage!
                        <br />• Build multiple Firewall towers when facing spiders to absorb their
                        powerful attacks
                        <br />
                        <br />
                        <strong>💽 DISK FORMAT EVENT:</strong>
                        <br />
                        • Every 4-7 waves (random), a "DISK FORMATTED" event occurs
                        <br />• <strong>WARNING:</strong> All towers are destroyed during this
                        event!
                        <br />
                        • Save coins for quick rebuilding after format events
                        <br />• This adds strategic depth - don't over-invest in one area!
                    </Text>
                </Alert>
            </Stack>
        </Container>
    )
}
