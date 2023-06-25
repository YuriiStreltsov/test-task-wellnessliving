export function removeClassesFromNotTargetElement(
    allElements: NodeListOf<HTMLElement>,
    target: HTMLElement,
    classesToRemove: string[]
) {
    allElements.forEach((element) => {
        if (target === element) {
            return;
        }
        element.classList.remove(...classesToRemove);
    });
}

export function toggleArrowClass(element: HTMLElement) {
    if (element.classList.contains('arrow-down')) {
        element.classList.remove('arrow-down');
        element.classList.add('arrow-up');
    } else if (element.classList.contains('arrow-up')) {
        element.classList.remove('arrow-up');
        element.classList.add('arrow-down');
    } else {
        element.classList.toggle('arrow-down');
    }
}
