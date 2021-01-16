export const $game: {
  setWindowTitle(): void
  setMessage(message: string): void
  writeMessage(message: string): void
  clearMessage(): void
  setOptions(options: {
    text: string
    onClick: () => any
  }[]): void
  addOption(option: {
    text: string
    onClick: () => any
  }): void
  clearOptions(): void
  gotoScene(sceneName): void
  reloadScene(): void
  playSound(payload: {
    src: string
    volume?: number
    loop?: boolean
    speed?: boolean
    reset?: boolean
  } | string): void
  stopSound(src): void
  stopAllSounds(): void
  playBgm(payload: {
    src: string
    volume?: number
    speed?: number
    loop?: boolean
    reset?: boolean
  } | string): void
  stopBgm(): void
  initData(data: any): void
  setTextColor(color: string): void
  setBgColor(color: string): void
  setImage(payload: {
    src: string
    percent?: number
    pos?: string
  } | string): void
  clearImage(): void
  hasSave: boolean
  saveGame(): void
  startAutoSave(): void
  stopAutoSave(): void
  clearSave(): void
  loadSave(): void
  resetGame(): void
}
