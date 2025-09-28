// src/modules/logger.ts
export function logBlockId(element: HTMLElement) {
    const blockId = element.getAttribute('data-node-id');
    console.log(`当前块的 ID 是: ${blockId}`);
}
