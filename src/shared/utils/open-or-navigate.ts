export const isPwa = () => window.matchMedia('(display-mode: standalone)').matches

export const openOrNavigate = (url: string, navigate: (url: string) => void) => {
    if (isPwa()) {
        navigate(url)
    } else {
        window.open(url, '_blank')
    }
}
