const screens: Record<string, HTMLElement> = Object.fromEntries(
    Array.from(document.getElementsByClassName('screen'))
        .map<[string, HTMLElement]>((screen: HTMLElement): [string, HTMLElement] => 
            [screen.id, screen]
        )
);

export function switchToScreen(id: string) {
    if(screens[id] === undefined) {
        throw new Error('Cannot find screen');
    }

    screens[id].classList.remove('hidden');

    Object.values(screens)
        .filter((screen: HTMLElement): boolean => screen.id !== id)
        .forEach((screen: HTMLElement) => screen.classList.add('hidden'));
}
