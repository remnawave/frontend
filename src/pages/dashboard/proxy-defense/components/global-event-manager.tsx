import consola from 'consola/browser'

import {
    ActiveGlobalEvent,
    GameState,
    GlobalEventConfig,
    GlobalEventsState,
    GlobalEventType
} from './interfaces'

export const GLOBAL_EVENT_CONFIGS: Record<GlobalEventType, GlobalEventConfig> = {
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
        minWaveInterval: 5,
        maxWaveInterval: 8,
        canCoexist: []
    }
}

export class GlobalEventManager {
    static activateScheduledEvents(
        currentWave: number,
        eventsState: GlobalEventsState
    ): {
        activatedEvents: GlobalEventConfig[]
        eventsState: GlobalEventsState
    } {
        const newState = { ...eventsState }
        const activatedEvents: GlobalEventConfig[] = []

        const eventsToActivate = newState.scheduledEvents.filter(
            (event) => event.scheduledWave === currentWave
        )

        if (eventsToActivate.length === 0) {
            return { eventsState: newState, activatedEvents }
        }

        eventsToActivate.sort((a, b) => b.config.priority - a.config.priority)

        for (const eventToActivate of eventsToActivate) {
            const canActivate = this.canEventActivate(eventToActivate.config, newState.activeEvents)

            if (canActivate) {
                newState.activeEvents.push({
                    type: eventToActivate.config.type,
                    startWave: currentWave,
                    startTime: Date.now(),
                    duration: eventToActivate.config.duration,
                    config: eventToActivate.config
                })

                activatedEvents.push(eventToActivate.config)
                newState.lastEventWave = currentWave
                // Track last activation for this specific event type
                newState.lastEventActivations[eventToActivate.config.type] = currentWave

                // Remove conflicting events (only lower priority ones)
                newState.activeEvents = newState.activeEvents.filter((activeEvent) => {
                    if (activeEvent.type === eventToActivate.config.type) return true

                    // If events can coexist, keep both
                    if (
                        eventToActivate.config.canCoexist.includes(activeEvent.type) ||
                        activeEvent.config.canCoexist.includes(eventToActivate.config.type)
                    ) {
                        return true
                    }

                    // Remove only lower priority events
                    return activeEvent.config.priority >= eventToActivate.config.priority
                })

                consola.log(
                    `🎉 Activated: ${eventToActivate.config.name} on wave ${currentWave} (last was: wave ${newState.lastEventActivations[eventToActivate.config.type] || 'never'})`
                )
            } else {
                const nextAttempt = currentWave + 1
                eventToActivate.scheduledWave = nextAttempt

                consola.log(
                    `⏰ Rescheduled: ${eventToActivate.config.name} to wave ${nextAttempt} (conflict)`
                )
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

        const now = Date.now()
        newState.activeEvents = newState.activeEvents.filter(
            (event) => now - event.startTime < event.duration
        )

        // NEW: More aggressive scheduling system
        Object.values(GLOBAL_EVENT_CONFIGS).forEach((eventConfig) => {
            // Check if this event type is already scheduled
            const hasScheduledEvent = newState.scheduledEvents.some(
                (scheduled) => scheduled.type === eventConfig.type
            )

            // Skip if already scheduled
            if (hasScheduledEvent) return

            // Use tracked last activation for this specific event type
            const lastActivationWave = newState.lastEventActivations[eventConfig.type] || 0
            const wavesSinceLastActivation = currentWave - lastActivationWave

            // More aggressive scheduling: plan if enough waves passed OR if no event is scheduled
            const shouldSchedule =
                wavesSinceLastActivation >= eventConfig.minWaveInterval ||
                (lastActivationWave === 0 && currentWave >= eventConfig.minWaveInterval)

            // FORCE scheduling if event hasn't happened for too long (1.5x max interval)
            const isOverdue = wavesSinceLastActivation >= eventConfig.maxWaveInterval * 1.5

            if (shouldSchedule || isOverdue) {
                let scheduledWave: number

                if (isOverdue) {
                    // Force immediate scheduling for overdue events
                    scheduledWave = currentWave + 1
                    consola.log(
                        `🚨 FORCING ${eventConfig.name} - overdue by ${wavesSinceLastActivation} waves!`
                    )
                } else {
                    // Calculate next occurrence within the specified interval
                    const minWait = Math.max(
                        1, // Always wait at least 1 wave
                        eventConfig.minWaveInterval - wavesSinceLastActivation
                    )
                    const maxWait = Math.max(
                        minWait,
                        eventConfig.maxWaveInterval - wavesSinceLastActivation
                    )

                    const waveOffset = Math.floor(Math.random() * (maxWait - minWait + 1)) + minWait
                    scheduledWave = currentWave + waveOffset
                }

                newState.scheduledEvents.push({
                    type: eventConfig.type,
                    scheduledWave,
                    config: eventConfig
                })

                consola.log(
                    `📅 Scheduled ${eventConfig.name} for wave ${scheduledWave} (current: ${currentWave}, last activation: ${lastActivationWave || 'never'})`
                )
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
