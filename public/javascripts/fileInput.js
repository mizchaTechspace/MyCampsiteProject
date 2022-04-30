function previewImgs(event) {
    const images = document.querySelector('#image');
    const number = images.files.length;
    for (let i = 0; i < number; i++) {
        const urls = URL.createObjectURL(event.target.files[i]);
        document.querySelector('#inputFile').innerHTML += '<img src=' + urls + '">';
    }
}