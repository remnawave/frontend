import {
    IconMaximize,
    IconMinus,
    IconMusic,
    IconPlayerPause,
    IconPlayerPlay,
    IconPlayerSkipBack,
    IconPlayerSkipForward,
    IconRefresh,
    IconVolume,
    IconVolumeOff
} from '@tabler/icons-react'
import {
    ActionIcon,
    Affix,
    Alert,
    Box,
    Group,
    Loader,
    Paper,
    Slider,
    Stack,
    Text,
    Title
} from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import consola from 'consola'

interface Track {
    author: string
    title: string
    url: string
}

interface PlaylistData {
    playlist: Track[]
}

const ALBUM_LINKS = {
    JSON_MP3: 'https://cdn.remna.st/TSUNAMI/TSUNAMI.json',
    SPOTIFY: 'https://open.spotify.com/album/5pjWyuryeDo1i7jIPL5PFj'
}

export const MusicPlayer = () => {
    const [tracks, setTracks] = useState<Track[]>([])
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.7)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<null | string>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)

    const loadJsonPlaylist = async (url: string) => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch(url, {
                mode: 'cors',
                headers: {
                    Accept: 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: PlaylistData = await response.json()

            if (!data.playlist || data.playlist.length === 0) {
                throw new Error('No tracks found in the playlist')
            }

            setTracks(data.playlist)
            setCurrentTrackIndex(0)
            setIsLoading(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load playlist')
            setIsLoading(false)
        }
    }

    const handleNext = (autoPlay = false) => {
        if (tracks.length === 0) return
        const nextIndex = (currentTrackIndex + 1) % tracks.length
        setCurrentTrackIndex(nextIndex)
        setIsPlaying(autoPlay)
    }

    useEffect(() => {
        loadJsonPlaylist(ALBUM_LINKS.JSON_MP3)
    }, [])

    const currentTrack = tracks[currentTrackIndex]

    useEffect(() => {
        if (!currentTrack || !audioRef.current) return

        const audio = audioRef.current
        audio.src = currentTrack.url
        audio.volume = isMuted ? 0 : volume

        const updateTime = () => setCurrentTime(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration || 0)
        const handleEnd = () => {
            setIsPlaying(false)
            handleNext(true)
        }

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', handleEnd)

        // eslint-disable-next-line consistent-return
        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', handleEnd)
        }
    }, [currentTrackIndex, tracks])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    useEffect(() => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.play().catch(consola.error)
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying, currentTrackIndex])

    const togglePlayPause = () => {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(consola.error)
        }
        setIsPlaying(!isPlaying)
    }

    const handlePrevious = () => {
        if (tracks.length === 0) return
        const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
        setCurrentTrackIndex(prevIndex)
        setIsPlaying(false)
    }

    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return

        const rect = event.currentTarget.getBoundingClientRect()
        const clickX = event.clientX - rect.left
        const percentage = clickX / rect.width
        const newTime = percentage * duration

        audioRef.current.currentTime = newTime
        setCurrentTime(newTime)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    const openInSpotify = () => {
        window.open(ALBUM_LINKS.SPOTIFY, '_blank', 'noopener,noreferrer')
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const progressValue = duration ? (currentTime / duration) * 100 : 0

    if (isLoading) {
        return (
            <Affix position={{ bottom: 20, right: 20 }}>
                <Paper
                    p="xl"
                    radius="xl"
                    shadow="xl"
                    style={{
                        maxWidth: 400,
                        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
                        border: '1px solid #404040',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <Stack align="center" gap="md">
                        <Loader color="blue" size="md" />
                        <Text c="#a0a0a0" size="sm">
                            Loading TSUNAMI...
                        </Text>
                    </Stack>
                </Paper>
            </Affix>
        )
    }

    if (error || tracks.length === 0) {
        return (
            <Affix position={{ bottom: 20, right: 20 }}>
                <Paper
                    p="xl"
                    radius="xl"
                    shadow="xl"
                    style={{
                        maxWidth: 400,
                        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
                        border: '1px solid #404040'
                    }}
                >
                    <Stack gap="md">
                        <Alert color="red" title="Error">
                            {error || 'No tracks available'}
                        </Alert>
                        <ActionIcon
                            onClick={() => loadJsonPlaylist(ALBUM_LINKS.JSON_MP3)}
                            variant="light"
                        >
                            <IconRefresh size={16} />
                        </ActionIcon>
                    </Stack>
                </Paper>
            </Affix>
        )
    }

    // Minimized view
    if (isMinimized) {
        return (
            <Affix position={{ bottom: 20, right: 20 }}>
                <Paper
                    p="md"
                    radius="xl"
                    shadow="xl"
                    style={{
                        maxWidth: 280,
                        background: 'linear-gradient(145deg, #1a1a1a, #252525)',
                        border: '1px solid #404040',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                    }}
                >
                    <Group align="center" gap="md" justify="space-between">
                        <Box style={{ position: 'relative' }}>
                            {/* Circular Progress Bar */}
                            <svg
                                height="52"
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1
                                }}
                                width="52"
                            >
                                {/* Background Circle */}
                                <circle
                                    cx="26"
                                    cy="26"
                                    fill="none"
                                    r="22"
                                    stroke="#333"
                                    strokeWidth="2"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="26"
                                    cy="26"
                                    fill="none"
                                    r="22"
                                    stroke="url(#gradient)"
                                    strokeDasharray={`${2 * Math.PI * 22}`}
                                    strokeDashoffset={`${2 * Math.PI * 22 * (1 - progressValue / 100)}`}
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    style={{
                                        transform: 'rotate(-90deg)',
                                        transformOrigin: '26px 26px',
                                        transition: 'stroke-dashoffset 0.3s ease'
                                    }}
                                />
                                {/* Gradient Definition */}
                                <defs>
                                    <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                        <stop offset="0%" stopColor="#60A5FA" />
                                        <stop offset="100%" stopColor="#3B82F6" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <ActionIcon
                                gradient={{ from: '#60A5FA', to: '#3B82F6' }}
                                onClick={togglePlayPause}
                                radius="xl"
                                size="lg"
                                style={{
                                    boxShadow: '0 4px 16px rgba(96, 165, 250, 0.4)',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                                variant="gradient"
                            >
                                {isPlaying ? (
                                    <IconPlayerPause size={20} />
                                ) : (
                                    <IconPlayerPlay size={20} style={{ marginLeft: 1 }} />
                                )}
                            </ActionIcon>
                        </Box>

                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <Text c="white" fw={600} size="sm" truncate>
                                {currentTrack?.title || 'Unknown Title'}
                            </Text>
                            <Text c="#a0a0a0" size="xs" truncate>
                                {currentTrack?.author || 'Unknown Artist'}
                            </Text>
                        </Box>

                        <ActionIcon
                            onClick={toggleMinimize}
                            radius="md"
                            size="md"
                            style={{
                                backgroundColor: '#ffffff10',
                                color: '#a0a0a0'
                            }}
                            variant="subtle"
                        >
                            <IconMaximize size={16} />
                        </ActionIcon>
                    </Group>

                    {/* Hidden Audio Element */}
                    <audio preload="metadata" ref={audioRef} />
                </Paper>
            </Affix>
        )
    }

    return (
        <Affix position={{ bottom: 20, right: 20 }}>
            <Paper
                p="xl"
                radius="xl"
                shadow="xl"
                style={{
                    maxWidth: 380,
                    background: 'linear-gradient(145deg, #1a1a1a, #252525)',
                    border: '1px solid #404040',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
                }}
            >
                <Stack gap="lg">
                    {/* Header */}
                    <Group align="flex-start" justify="space-between">
                        <Box style={{ flex: 1 }}>
                            <Group align="center" gap="sm" mb="xs">
                                <IconMusic color="#60A5FA" size={20} />
                                <Text c="#60A5FA" fw={600} size="xs" tt="uppercase">
                                    Now Playing
                                </Text>
                            </Group>
                            <Title c="white" fw={700} mb={4} order={3} size="lg">
                                {currentTrack?.title || 'Unknown Title'}
                            </Title>
                            <Text c="#a0a0a0" fw={500} size="sm">
                                {currentTrack?.author || 'Unknown Artist'}
                            </Text>
                            <Text c="#666" mt={4} size="xs">
                                Track {currentTrackIndex + 1} of {tracks.length}
                            </Text>
                        </Box>
                        <Group gap="xs">
                            <ActionIcon
                                onClick={openInSpotify}
                                radius="md"
                                size="md"
                                variant="transparent"
                            >
                                <svg
                                    aria-label="Spotify"
                                    height="24"
                                    id="spotify"
                                    viewBox="0 0 512 512"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect fill="#3bd75f" height="512" rx="77" width="512" />
                                    <circle cx="256" cy="256" fill="#000" r="192" />
                                    <g fill="none" stroke="#3bd75f" stroke-linecap="round">
                                        <path d="m141 195c75-20 164-15 238 24" stroke-width="36" />
                                        <path d="m152 257c61-17 144-13 203 24" stroke-width="31" />
                                        <path d="m156 315c54-12 116-17 178 20" stroke-width="24" />
                                    </g>
                                </svg>
                            </ActionIcon>
                            <ActionIcon
                                onClick={toggleMinimize}
                                radius="md"
                                size="md"
                                style={{
                                    backgroundColor: '#ffffff10',
                                    color: '#a0a0a0'
                                }}
                                variant="subtle"
                            >
                                <IconMinus size={16} />
                            </ActionIcon>
                        </Group>
                    </Group>

                    {/* Progress Bar */}
                    <Stack gap="sm">
                        <Box
                            onClick={handleProgressClick}
                            style={{
                                height: 8,
                                backgroundColor: '#333',
                                borderRadius: 4,
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                style={{
                                    height: '100%',
                                    width: `${progressValue}%`,
                                    background: 'linear-gradient(90deg, #60A5FA, #3B82F6)',
                                    borderRadius: 4,
                                    transition: 'width 0.1s ease'
                                }}
                            />
                            <Box
                                style={{
                                    position: 'absolute',
                                    right: `${100 - progressValue}%`,
                                    top: '50%',
                                    transform: 'translate(50%, -50%)',
                                    width: 16,
                                    height: 16,
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                                    opacity: progressValue > 0 ? 1 : 0,
                                    transition: 'opacity 0.2s ease'
                                }}
                            />
                        </Box>
                        <Group justify="space-between">
                            <Text c="#a0a0a0" ff="monospace" fw={600} size="xs">
                                {formatTime(currentTime)}
                            </Text>
                            <Text c="#a0a0a0" ff="monospace" fw={600} size="xs">
                                {formatTime(duration)}
                            </Text>
                        </Group>
                    </Stack>

                    {/* Controls */}
                    <Group gap="xl" justify="center">
                        <ActionIcon
                            disabled={tracks.length <= 1}
                            onClick={handlePrevious}
                            radius="xl"
                            size="xl"
                            style={{
                                backgroundColor: '#ffffff10',
                                color: tracks.length <= 1 ? '#666' : '#a0a0a0',
                                transition: 'all 0.2s ease'
                            }}
                            variant="subtle"
                        >
                            <IconPlayerSkipBack size={24} />
                        </ActionIcon>

                        <ActionIcon
                            gradient={{ from: '#60A5FA', to: '#3B82F6' }}
                            onClick={togglePlayPause}
                            radius="xl"
                            size={64}
                            style={{
                                boxShadow: '0 8px 24px rgba(96, 165, 250, 0.4)',
                                transition: 'all 0.2s ease'
                            }}
                            variant="gradient"
                        >
                            {isPlaying ? (
                                <IconPlayerPause size={28} />
                            ) : (
                                <IconPlayerPlay size={28} style={{ marginLeft: 2 }} />
                            )}
                        </ActionIcon>

                        <ActionIcon
                            disabled={tracks.length <= 1}
                            onClick={() => handleNext(true)}
                            radius="xl"
                            size="xl"
                            style={{
                                backgroundColor: '#ffffff10',
                                color: tracks.length <= 1 ? '#666' : '#a0a0a0',
                                transition: 'all 0.2s ease'
                            }}
                            variant="subtle"
                        >
                            <IconPlayerSkipForward size={24} />
                        </ActionIcon>
                    </Group>

                    {/* Volume Control */}
                    <Group gap="sm">
                        <ActionIcon
                            onClick={toggleMute}
                            radius="md"
                            size="md"
                            style={{
                                backgroundColor: isMuted ? '#ef444420' : '#ffffff10',
                                color: isMuted ? '#ef4444' : '#a0a0a0'
                            }}
                            variant="subtle"
                        >
                            {isMuted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
                        </ActionIcon>
                        <Slider
                            color="blue"
                            max={100}
                            min={0}
                            onChange={(value) => {
                                setVolume(value / 100)
                                if (value > 0) setIsMuted(false)
                            }}
                            radius="xl"
                            size="sm"
                            step={1}
                            style={{ flex: 1 }}
                            styles={{
                                track: { backgroundColor: '#333' },
                                bar: { background: 'linear-gradient(90deg, #60A5FA, #3B82F6)' },
                                thumb: { backgroundColor: 'white', border: 'none' }
                            }}
                            value={isMuted ? 0 : volume * 100}
                        />
                        <Text c="#666" ff="monospace" size="xs" ta="right" w={32}>
                            {Math.round(isMuted ? 0 : volume * 100)}%
                        </Text>
                    </Group>
                </Stack>

                {/* Hidden Audio Element */}
                <audio preload="metadata" ref={audioRef} />
            </Paper>
        </Affix>
    )
}
