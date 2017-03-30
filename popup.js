document.addEventListener('DOMContentLoaded', () => {
    setup();
});


function setup() {
    const button = document.getElementById('download');
    button.addEventListener('click', handleClick);
}

function handleClick(e) {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        let url = new URL(tabs[0].url);
        if(url.hostname !== 'marketplace.visualstudio.com') return alert('you not on marketplace tho');
        const params = url.searchParams.get('itemName').split('.');
        const package = {author: params[0], extName: params[1]};
        url = createDownloadUrl(package);
        getBlob(url)
            .then(blob => {
                let file = new File([blob], package.extName + '.vsix');
                writeToDisk(file);
            });

    });
}


function createDownloadUrl({author, extName}) {
  return `https://${author}.gallery.vsassets.io/_apis/public/gallery/publisher/${author}/extension/${extName}/latest/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;
}


function getBlob(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(res => res.blob())
        .then(blob => {
            resolve(blob);
        });
    });
}

function writeToDisk(file) {
    let dumb = document.createElement('a');
    dumb.download = file.name;
    dumb.href = URL.createObjectURL(file);
    dumb.click();
}