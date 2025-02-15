// Monitors the gallery and sends a browser notification when the leading image is new.

let lastHeadImg = null;
let notificationButton = null;
const regExpTempImage = /(?<=\/|\\)tmp[\w\d]{8}\.png$/gm;

onUiUpdate(function(){
    if(notificationButton == null){
        notificationButton = gradioApp().getElementById('request_notifications')
        if (notificationButton != null) notificationButton.addEventListener('click', (evt) => Notification.requestPermission(), true);
    }
    const galleryPreviews = gradioApp().querySelectorAll('div[id^="tab_"][style*="display: block"] div[id$="_results"] .thumbnail-item > img');
    if (galleryPreviews == null) return;
    const headImg = galleryPreviews[0]?.src;
    if (headImg == null || headImg == lastHeadImg) return;
    if (headImg.search(regExpTempImage) != -1) return;
    lastHeadImg = headImg;
    // play notification sound if available
    gradioApp().querySelector('#audio_notification audio')?.play();
    if (document.hasFocus()) return;
    // Multiple copies of the images are in the DOM when one is selected. Dedup with a Set to get the real number generated.
    const imgs = new Set(Array.from(galleryPreviews).map(img => img.src));
    const notification = new Notification(
        'Stable Diffusion', {
            body: `Generated ${imgs.size > 1 ? imgs.size - opts.return_grid : 1} image${imgs.size > 1 ? 's' : ''}`,
            icon: headImg,
            image: headImg }
    );
    notification.onclick = function(_) {
        parent.focus();
        this.close();
    };
});
