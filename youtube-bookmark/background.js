const EVENTS = {
    NEW: 'NEW',
    PLAY: 'PLAY',
    DELETE: 'DELETE'
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

    if(tab.url && tab.url.includes('youtube.com/watch')) {
        const queryParameters = tab.url.split('?')[1];
        const urlParameters = new URLSearchParams(queryParameters);
        
        const response = await chrome.tabs.sendMessage(tabId, {
            type: EVENTS.NEW,
            videoId: urlParameters.get('v')
        }); 
    }
});