/**
 * Exports boolean true if we are in an IFrame, which usually means we are in Canvas
 */

let inIFrameTest = true;
try {
    inIFrameTest = window.self !== window.top;
} catch (e) {
    // If this fails we are probably in an IFrame.
}

export const IN_IFRAME = inIFrameTest;