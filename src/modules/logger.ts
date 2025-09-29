/**
 * @file logger.ts
 * @description 这是一个独立的日志模块，提供可复用的日志功能。
 * 它的唯一职责就是向开发者控制台打印出块的ID。
 */

/**
 * 在控制台打印出指定DOM元素的块ID。
 * @param element - 一个HTML元素，通常是自定义块的'this'。
 */
export function logBlockId(element: HTMLElement) {
    const blockId = element.dataset.nodeId;
    if (blockId) {
        console.log(`[自定义块日志] 块ID是: ${blockId}`);
    } else {
        console.warn("[自定义块日志] 未能在此元素上找到块ID。");
    }
}

