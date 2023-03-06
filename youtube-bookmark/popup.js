import { getCurrentTab, EVENTS } from "./utils.js";

const addNewBookmark = (bookmarkElement, bookmark) => {
    const bookmarkTitleElement = document.createElement('div');
    const newBookmarkElement = document.createElement('div');
    const controlElement = document.createElement('div');


    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = 'bookmark-title';

    controlElement.className = 'bookmark-controls';

    newBookmarkElement.id = 'bookmark-' + bookmark.time;
    newBookmarkElement.className = 'bookmark';
    newBookmarkElement.setAttribute('timestamp', bookmark.time);

    setBookmarkAttributes('play', onPlay, controlElement);
    setBookmarkAttributes('delete', onDelete, controlElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlElement);
    bookmarkElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currenVideoBookmarks=[]) => {
    const bookmarkElement = document.getElementById('bookmarks');
    bookmarkElement.innerHTML = '';

    if(currenVideoBookmarks.length) {
        for(let i = 0; i < currenVideoBookmarks.length; i++) {
            const bookmark = currenVideoBookmarks[i];
            addNewBookmark(bookmarkElement, bookmark);
        }
    } else {
        bookmarkElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp');
    const currentTab = await getCurrentTab();

    chrome.tabs.sendMessage(currentTab.id, {
        type: EVENTS.PLAY,
        value: bookmarkTime
    });
};

const onDelete = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute('timestamp');
    const currentTab = await getCurrentTab();
    const bookmarkElementToDelete = document.getElementById('bookmark-' + bookmarkTime);

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(currentTab.id, {
        type: EVENTS.DELETE,
        value: bookmarkTime
    }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement('img');
    controlElement.src = 'assets/' + src + '.png';
    controlElement.title = src;
    controlElement.addEventListener('click', eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    const currentTab = await getCurrentTab();

    const queryParameters = currentTab.url.split('?')[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get('v');

    if(currentTab.url.includes('youtube.com/watch') && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currenVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];
            viewBookmarks(currenVideoBookmarks);
        
        })
    } else {
        const container = document.getElementsByClassName('container')[0];
        container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});