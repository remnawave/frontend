import { Enemy, Tower } from './interfaces'

// Pixel art drawing functions
export const drawFirewallTower = (
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

export const drawAntivirusTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawProxyTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawHackerEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawDDoSEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawMalwareEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawSpiderEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawSpiderAttack = (
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

export const drawExplosion = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    progress: number
) => {
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

export const drawLightning = (
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

export const drawHackerAttack = (
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

export const drawDDoSAttack = (
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

export const drawMalwareAttack = (
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

export const drawPhoenixAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.3

    // Fire stream with multiple flame bolts
    const segments = 8
    const points: { x: number; y: number }[] = []

    points.push({ x: fromX, y: fromY })

    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // Flickering flame pattern
        const flameOffset = Math.sin(t * Math.PI * 4 + Date.now() * 0.02) * 8
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
            const normalizedPerpX = perpX / perpLength
            const normalizedPerpY = perpY / perpLength

            points.push({
                x: baseX + normalizedPerpX * flameOffset,
                y: baseY + normalizedPerpY * flameOffset
            })
        }
    }

    points.push({ x: toX, y: toY })

    // Draw main fire stream
    ctx.strokeStyle = `rgba(255, 140, 0, ${alpha})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Inner fire core
    ctx.strokeStyle = `rgba(255, 69, 0, ${alpha * 0.9})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Fire particles along the path
    for (let i = 0; i < 6; i++) {
        const t = i / 6
        const particleX = fromX + (toX - fromX) * t + (Math.random() - 0.5) * 12
        const particleY = fromY + (toY - fromY) * t + (Math.random() - 0.5) * 12

        const particleAlpha = alpha * (0.7 + Math.random() * 0.3)
        const particleColor = Math.random() < 0.5 ? 'rgba(255, 140, 0,' : 'rgba(255, 69, 0,'

        ctx.fillStyle = `${particleColor} ${particleAlpha})`
        ctx.fillRect(particleX - 2, particleY - 2, 4, 4)
    }

    // Impact explosion at target
    if (progress > 0.7) {
        const explosionProgress = (progress - 0.7) / 0.3
        const explosionRadius = explosionProgress * 15

        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * (1 - explosionProgress)})`
        ctx.beginPath()
        ctx.arc(toX, toY, explosionRadius, 0, Math.PI * 2)
        ctx.fill()

        // Fire sparks from explosion
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4
            const sparkX = toX + Math.cos(angle) * explosionRadius * 1.5
            const sparkY = toY + Math.sin(angle) * explosionRadius * 1.5

            ctx.fillStyle = `rgba(255, 100, 0, ${alpha * (1 - explosionProgress)})`
            ctx.fillRect(sparkX - 1, sparkY - 1, 2, 2)
        }
    }
}

export const drawWormAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.5

    // Data packet stream - worm sends rapid network packets
    const packets = 5

    for (let packet = 0; packet < packets; packet++) {
        const packetProgress = Math.max(0, progress - packet * 0.1)
        if (packetProgress <= 0) return

        const packetX = fromX + (toX - fromX) * packetProgress
        const packetY = fromY + (toY - fromY) * packetProgress

        // Packet wiggle (network instability)
        const wiggle = Math.sin(packetProgress * Math.PI * 8) * 3
        const packetAlpha = alpha * (1 - packet * 0.15)

        // Main packet
        ctx.fillStyle = `rgba(50, 255, 50, ${packetAlpha})`
        ctx.fillRect(packetX - 3 + wiggle, packetY - 2, 6, 4)

        // Packet highlight
        ctx.fillStyle = `rgba(100, 255, 100, ${packetAlpha * 0.8})`
        ctx.fillRect(packetX - 2 + wiggle, packetY - 1, 4, 1)

        // Data trail
        for (let i = 1; i <= 3; i++) {
            const trailX = packetX - i * 8 + wiggle
            const trailY = packetY + (Math.random() - 0.5) * 4
            const trailAlpha = packetAlpha * (0.6 - i * 0.15)

            ctx.fillStyle = `rgba(50, 255, 50, ${trailAlpha})`
            ctx.fillRect(trailX - 1, trailY - 1, 2, 2)
        }
    }

    // Network corruption beam
    ctx.strokeStyle = `rgba(50, 255, 50, ${alpha * 0.6})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)

    // Jagged network connection line
    const segments = 6
    for (let i = 1; i <= segments; i++) {
        const t = i / segments
        const segmentX = fromX + (toX - fromX) * t
        const segmentY = fromY + (toY - fromY) * t
        const jitter = (Math.random() - 0.5) * 8

        ctx.lineTo(segmentX + jitter, segmentY + jitter)
    }
    ctx.stroke()

    // Digital interference at impact
    if (progress > 0.6) {
        const interferenceProgress = (progress - 0.6) / 0.4

        for (let i = 0; i < 8; i++) {
            const interferenceX = toX + (Math.random() - 0.5) * 20 * interferenceProgress
            const interferenceY = toY + (Math.random() - 0.5) * 20 * interferenceProgress
            const interferenceAlpha = alpha * (1 - interferenceProgress) * 0.7

            ctx.fillStyle = `rgba(50, 255, 50, ${interferenceAlpha})`
            ctx.fillRect(interferenceX - 2, interferenceY - 1, 4, 2)
        }

        // Central corruption burst
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha * (1 - interferenceProgress)})`
        ctx.beginPath()
        ctx.arc(toX, toY, interferenceProgress * 12, 0, Math.PI * 2)
        ctx.fill()
    }

    // Speed enhancement visual - worm attacks are fast
    for (let i = 0; i < 4; i++) {
        const speedLineX = fromX + (toX - fromX) * (0.2 + i * 0.2)
        const speedLineY = fromY + (toY - fromY) * (0.2 + i * 0.2)
        const speedAlpha = alpha * (0.4 - i * 0.08)

        ctx.fillStyle = `rgba(50, 255, 50, ${speedAlpha})`
        ctx.fillRect(speedLineX - 4, speedLineY, 8, 1)
    }
}

export const drawPortalMinerAttack = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    progress: number
) => {
    const alpha = 1 - progress * 0.4

    // Dimensional rift beam
    const segments = 6
    const points: { x: number; y: number }[] = []

    points.push({ x: fromX, y: fromY })

    for (let i = 1; i < segments; i++) {
        const t = i / segments
        const baseX = fromX + (toX - fromX) * t
        const baseY = fromY + (toY - fromY) * t

        // Spacetime distortion effect
        const distortion = Math.sin(t * Math.PI * 3 + Date.now() * 0.02) * 12
        const perpX = -(toY - fromY)
        const perpY = toX - fromX
        const perpLength = Math.sqrt(perpX * perpX + perpY * perpY)

        if (perpLength > 0) {
            const normalizedPerpX = perpX / perpLength
            const normalizedPerpY = perpY / perpLength

            points.push({
                x: baseX + normalizedPerpX * distortion,
                y: baseY + normalizedPerpY * distortion
            })
        }
    }

    points.push({ x: toX, y: toY })

    // Main portal beam
    ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Inner void core
    ctx.strokeStyle = `rgba(75, 0, 130, ${alpha * 0.8})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Portal particles along the beam
    for (let i = 0; i < 8; i++) {
        const t = i / 8
        const particleX = fromX + (toX - fromX) * t + (Math.random() - 0.5) * 15
        const particleY = fromY + (toY - fromY) * t + (Math.random() - 0.5) * 15

        const particleAlpha = alpha * (0.6 + Math.random() * 0.4)
        ctx.fillStyle = `rgba(148, 0, 211, ${particleAlpha})`
        ctx.fillRect(particleX - 2, particleY - 2, 4, 4)

        // Particle trails
        ctx.fillStyle = `rgba(138, 43, 226, ${particleAlpha * 0.5})`
        ctx.fillRect(particleX - 1, particleY - 1, 2, 2)
    }

    // Dimensional tears (side effects)
    for (let i = 0; i < 5; i++) {
        const tearX = fromX + (toX - fromX) * (0.2 + i * 0.15) + (Math.random() - 0.5) * 20
        const tearY = fromY + (toY - fromY) * (0.2 + i * 0.15) + (Math.random() - 0.5) * 20
        const tearAlpha = alpha * (0.3 + Math.random() * 0.3)

        // Small rifts in space
        ctx.strokeStyle = `rgba(75, 0, 130, ${tearAlpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(tearX - 3, tearY)
        ctx.lineTo(tearX + 3, tearY)
        ctx.moveTo(tearX, tearY - 3)
        ctx.lineTo(tearX, tearY + 3)
        ctx.stroke()
    }

    // Impact portal at target
    if (progress > 0.7) {
        const portalProgress = (progress - 0.7) / 0.3
        const portalRadius = portalProgress * 18

        // Portal opening effect
        ctx.strokeStyle = `rgba(138, 43, 226, ${alpha * (1 - portalProgress)})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(toX, toY, portalRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Inner void
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * (1 - portalProgress) * 0.8})`
        ctx.beginPath()
        ctx.arc(toX, toY, portalRadius * 0.6, 0, Math.PI * 2)
        ctx.fill()

        // Portal energy spirals
        for (let i = 0; i < 6; i++) {
            const spiralAngle = (i * Math.PI) / 3 + portalProgress * Math.PI * 4
            const spiralRadius = portalRadius * 0.8
            const spiralX = toX + Math.cos(spiralAngle) * spiralRadius
            const spiralY = toY + Math.sin(spiralAngle) * spiralRadius

            ctx.fillStyle = `rgba(148, 0, 211, ${alpha * (1 - portalProgress)})`
            ctx.fillRect(spiralX - 1, spiralY - 1, 2, 2)
        }
    }

    // Energy discharge waves
    for (let i = 0; i < 3; i++) {
        const waveX = fromX + (toX - fromX) * (0.3 + i * 0.2)
        const waveY = fromY + (toY - fromY) * (0.3 + i * 0.2)
        const waveRadius = progress * 8 + i * 4
        const waveAlpha = alpha * (0.4 - i * 0.1)

        ctx.strokeStyle = `rgba(138, 43, 226, ${waveAlpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(waveX, waveY, waveRadius, 0, Math.PI * 2)
        ctx.stroke()
    }
}

export const drawShieldedEnemy = (
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

export const drawVoltageEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawReplicatorEnemy = (
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

export const drawPhoenixEnemy = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isReviving: boolean = false
) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.01

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(centerX - 10, centerY + 12, 20, 6)

    // Phoenix body - glowing effect
    const bodyAlpha = isReviving ? 0.5 + Math.sin(time * 5) * 0.3 : 1.0
    ctx.fillStyle = `rgba(255, 140, 0, ${bodyAlpha})`
    ctx.fillRect(centerX - 6, centerY - 2, 12, 10)

    // Inner fire core
    ctx.fillStyle = `rgba(255, 69, 0, ${bodyAlpha})`
    ctx.fillRect(centerX - 4, centerY, 8, 6)

    // Phoenix head
    ctx.fillStyle = `rgba(255, 215, 0, ${bodyAlpha})`
    ctx.fillRect(centerX - 3, centerY - 6, 6, 6)

    // Eyes - bright when reviving
    ctx.fillStyle = isReviving ? '#FFF' : '#FF4500'
    ctx.fillRect(centerX - 2, centerY - 5, 1, 2)
    ctx.fillRect(centerX + 1, centerY - 5, 1, 2)

    // Beak
    ctx.fillStyle = `rgba(255, 140, 0, ${bodyAlpha})`
    ctx.fillRect(centerX - 1, centerY - 3, 2, 1)

    // Phoenix wings - animated
    for (let wing = 0; wing < 2; wing++) {
        const wingSide = wing === 0 ? -1 : 1
        const wingFlap = Math.sin(time * 4) * 2

        // Wing base
        ctx.fillStyle = `rgba(255, 69, 0, ${bodyAlpha * 0.8})`
        ctx.fillRect(centerX + wingSide * 8, centerY - 4 + wingFlap, wingSide * 6, 8)

        // Wing tip
        ctx.fillStyle = `rgba(255, 140, 0, ${bodyAlpha * 0.7})`
        ctx.fillRect(centerX + wingSide * 12, centerY - 2 + wingFlap, wingSide * 4, 4)
    }

    // Fire particles around phoenix
    for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + time
        const radius = 12 + Math.sin(time * 2 + i) * 4
        const particleX = centerX + Math.cos(angle) * radius
        const particleY = centerY + Math.sin(angle) * radius

        const particleAlpha = (0.6 + Math.sin(time * 3 + i) * 0.4) * bodyAlpha
        ctx.fillStyle = `rgba(255, ${100 + Math.sin(time + i) * 50}, 0, ${particleAlpha})`
        ctx.fillRect(particleX - 1, particleY - 1, 2, 2)
    }

    // Reviving effect
    if (isReviving) {
        // Resurrection aura
        const auraRadius = 20 + Math.sin(time * 6) * 8
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.8 + Math.sin(time * 8) * 0.2})`
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2)
        ctx.stroke()

        // Rising flames
        for (let i = 0; i < 6; i++) {
            const flameHeight = (time * 30 + i * 20) % 60
            const flameX = centerX + (Math.random() - 0.5) * 20
            const flameY = centerY + 10 - flameHeight

            if (flameHeight < 50) {
                ctx.fillStyle = `rgba(255, ${69 + flameHeight}, 0, ${1 - flameHeight / 50})`
                ctx.fillRect(flameX - 1, flameY, 2, 4)
            }
        }
    }

    // Health-based fire intensity
    const fireIntensity = isReviving ? 1.0 : 0.6 + Math.sin(time * 2) * 0.4
    ctx.fillStyle = `rgba(255, 0, 0, ${fireIntensity * bodyAlpha * 0.3})`
    ctx.beginPath()
    ctx.arc(centerX, centerY, 16, 0, Math.PI * 2)
    ctx.fill()
}

export const drawWormEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.015

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
    ctx.fillRect(centerX - 10, centerY + 8, 20, 3)

    // Worm body segments (smaller and more segments)
    const segments = 7
    for (let i = 0; i < segments; i++) {
        // Wave motion for organic movement
        const segmentOffset = Math.sin(time + i * 0.8) * 3
        const segmentX = centerX - 8 + i * 2.5 + segmentOffset
        const segmentY = centerY + Math.sin(time * 2 + i * 0.5) * 2

        // Segment size decreases towards tail
        const segmentSize = 3 - i * 0.3

        // Color gradient from bright lime to darker green
        const intensity = 1 - i * 0.1
        ctx.fillStyle = `rgba(50, ${200 * intensity}, 50, 0.9)`

        // Draw segment
        ctx.fillRect(
            segmentX - segmentSize,
            segmentY - segmentSize,
            segmentSize * 2,
            segmentSize * 2
        )

        // Segment highlight
        ctx.fillStyle = `rgba(100, ${255 * intensity}, 100, 0.7)`
        ctx.fillRect(segmentX - segmentSize + 1, segmentY - segmentSize + 1, segmentSize, 1)
    }

    // Head (first segment) - more detailed
    ctx.fillStyle = '#32CD32'
    ctx.fillRect(centerX - 4, centerY - 3, 6, 6)

    // Head highlight
    ctx.fillStyle = '#7FFF00'
    ctx.fillRect(centerX - 3, centerY - 2, 4, 2)

    // Eyes - small red dots
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(centerX - 2, centerY - 2, 1, 1)
    ctx.fillRect(centerX + 1, centerY - 2, 1, 1)

    // Data trail effect (worm leaves digital trace)
    for (let i = 0; i < 4; i++) {
        const trailX = centerX + 8 + i * 8 + Math.sin(time + i) * 2
        const trailY = centerY + Math.sin(time * 1.5 + i) * 4
        const trailAlpha = 0.6 - i * 0.15

        ctx.fillStyle = `rgba(50, 255, 50, ${trailAlpha})`
        ctx.fillRect(trailX - 1, trailY - 1, 2, 2)
    }

    // Speed lines (movement effect)
    for (let i = 0; i < 3; i++) {
        const lineX = centerX + 12 + i * 6
        const lineY = centerY + (Math.random() - 0.5) * 8
        const lineAlpha = 0.5 - i * 0.1

        ctx.fillStyle = `rgba(50, 255, 50, ${lineAlpha})`
        ctx.fillRect(lineX, lineY, 4, 1)
    }

    // Network infection aura
    const pulseRadius = 12 + Math.sin(time * 4) * 2
    ctx.strokeStyle = `rgba(50, 255, 50, ${0.3 + Math.sin(time * 3) * 0.2})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
    ctx.stroke()
}

export const drawPortalMinerEnemy = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const centerX = x + 15
    const centerY = y + 15
    const time = Date.now() * 0.01

    // Shadow - darker for mystical effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(centerX - 10, centerY + 10, 20, 4)

    // Portal energy rings (background)
    for (let i = 0; i < 3; i++) {
        const radius = 8 + i * 6 + Math.sin(time * 2 + i) * 3
        const alpha = 0.3 - i * 0.08
        ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
    }

    // Main body - crystalline structure
    ctx.fillStyle = '#4B0082'
    ctx.fillRect(centerX - 5, centerY - 3, 10, 8)

    // Crystal facets
    ctx.fillStyle = '#6A0DAD'
    ctx.fillRect(centerX - 4, centerY - 2, 8, 2)
    ctx.fillStyle = '#8A2BE2'
    ctx.fillRect(centerX - 3, centerY, 6, 2)

    // Portal core - central void
    ctx.fillStyle = '#000000'
    ctx.fillRect(centerX - 2, centerY - 1, 4, 4)

    // Inner portal swirl
    const swirl = Math.sin(time * 4) * 0.5 + 0.5
    ctx.fillStyle = `rgba(138, 43, 226, ${swirl})`
    ctx.fillRect(centerX - 1, centerY, 2, 2)

    // Dimensional anchors (corners)
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + time * 0.5
        const anchorX = centerX + Math.cos(angle) * 12
        const anchorY = centerY + Math.sin(angle) * 8

        ctx.fillStyle = '#9932CC'
        ctx.fillRect(anchorX - 2, anchorY - 1, 4, 2)

        // Energy beams to anchors
        ctx.strokeStyle = `rgba(153, 50, 204, 0.6)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(anchorX, anchorY)
        ctx.stroke()
    }

    // Floating void particles
    for (let i = 0; i < 6; i++) {
        const particleAngle = time + i * 1.2
        const particleRadius = 8 + Math.sin(time * 3 + i) * 4
        const particleX = centerX + Math.cos(particleAngle) * particleRadius
        const particleY = centerY + Math.sin(particleAngle) * particleRadius

        const particleAlpha = 0.4 + Math.sin(time * 2 + i) * 0.3
        ctx.fillStyle = `rgba(75, 0, 130, ${particleAlpha})`
        ctx.fillRect(particleX - 1, particleY - 1, 2, 2)
    }

    // Spacetime distortion effect
    const distortionIntensity = 0.3 + Math.sin(time * 3) * 0.2
    for (let i = 0; i < 4; i++) {
        const distortX = centerX + (Math.random() - 0.5) * 20
        const distortY = centerY + (Math.random() - 0.5) * 20

        ctx.fillStyle = `rgba(138, 43, 226, ${distortionIntensity * 0.4})`
        ctx.fillRect(distortX - 0.5, distortY - 0.5, 1, 1)
    }

    // Portal event horizon
    const horizonRadius = 14 + Math.sin(time * 4) * 2
    ctx.strokeStyle = `rgba(148, 0, 211, ${0.6 + Math.sin(time * 5) * 0.4})`
    ctx.lineWidth = 1
    ctx.setLineDash([3, 2])
    ctx.beginPath()
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([]) // Reset line dash

    // Mining appendages
    for (let i = 0; i < 2; i++) {
        const side = i === 0 ? -1 : 1
        const appendageX = centerX + side * 8
        const appendageY = centerY + Math.sin(time * 2 + i * Math.PI) * 3

        ctx.fillStyle = '#8B008B'
        ctx.fillRect(appendageX - 1, appendageY - 2, 2, 4)

        // Mining beam
        ctx.strokeStyle = `rgba(186, 85, 211, 0.5)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(appendageX, appendageY)
        ctx.lineTo(appendageX + side * 6, appendageY + 8)
        ctx.stroke()
    }
}

export const drawSlowdownTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawChainTower = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
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

export const drawEnemyAttack = (
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
        case 'phoenix':
            drawPhoenixAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'portal_miner':
            drawPortalMinerAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'spider':
            drawSpiderAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        case 'worm':
            drawWormAttack(ctx, fromX, fromY, toX, toY, progress)
            break
        default:
            break
    }
}
