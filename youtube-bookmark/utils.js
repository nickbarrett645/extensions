export async function getCurrentTab() {
    let queryOptions = {active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

export const EVENTS = {
    NEW: 'NEW',
    PLAY: 'PLAY',
    DELETE: 'DELETE'
}