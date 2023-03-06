(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = '';
    let currenVideoBookmarks = [];

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const {type, value, videoId} = message;

        if(type === 'NEW') {
            currentVideo = videoId;
            newVideoLoaded();
        } else if(type === 'PLAY') {
            youtubePlayer.currentTime = value;
        } else if(type === 'DELETE') {
            currenVideoBookmarks = currenVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({[currentVideo]: JSON.stringify(currenVideoBookmarks)});

            response(currenVideoBookmarks);
        }

        sendResponse('done')
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]): [])
            })
        });
    };

    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName('bookmark-btn')[0];
        currenVideoBookmarks = await fetchBookmarks()

        if(!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement('img');

            bookmarkBtn.src = chrome.runtime.getURL('assets/bookmark.png');
            bookmarkBtn.className = 'ytp-button ' + 'bookmark-btn';
            bookmarkBtn.title = 'Click to bookmark current timestamp';

            youtubeLeftControls = document.getElementsByClassName('ytp-left-controls')[0];
            youtubePlayer = document.getElementsByClassName('video-stream')[0];

            youtubeLeftControls.appendChild(bookmarkBtn);
            bookmarkBtn.addEventListener('click', addNewBookmarkEventHandler)
        }
    };

    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: 'Bookmark at ' + getTime(currentTime)
        };

        currenVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currenVideoBookmarks,newBookmark].sort((a,b) => a.time - b.time))
        })
    };

    newVideoLoaded();
})()

const getTime = t => {
    var date = new Date(0);
    date.setSeconds(t);
    console.log(date.toISOString());
    return date.toISOString().substring(11,19);
}