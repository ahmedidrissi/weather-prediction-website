const preloader = document.querySelector('.preloader');

const camera = document.querySelector('.camera');
const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const webcam = new Webcam(webcamElement, 'user', canvasElement);

var model;

function openCamera() {
    camera.classList.remove('camera-off');

    webcam.start()
    .then(result =>{
        console.log("webcam started");
    })
    .catch(err => {
        console.log(err);
    });
};

function flipCamera() {
    webcam.flip();
    webcam.start()
    .then(result =>{
        console.log("webcam started");
    })
    .catch(err => {
        console.log(err);
    });
}

function takePicture() {
    let picture = webcam.snap();
    document.querySelector('#preview').src = picture;
    webcam.stop();
    camera.classList.add('camera-off');
    result.innerHTML = "Loading ...";
    window.setTimeout(predictWeather, 1000);
}

const classes = {
        0: 'dew',
        1: 'fogsmog',
        2: 'frost',
        3: 'glaze',
        4: 'hail',
        5: 'lightning',
        6: 'rain',
        7: 'rainbow',
        8: 'rime',
        9: 'sandstorm',
        10: 'snow'
    };

function loadFile(event) {
    var image = document.getElementById('preview');
    image.src = URL.createObjectURL(event.target.files[0]);
    result.innerHTML = "Loading ...";
    window.setTimeout(predictWeather, 500);
};

function predictWeather() {
    var result = document.getElementById('result');
    var pred = model.predict(preprocess()).dataSync();
    var index = pred.indexOf(Math.max(...pred));
    result.innerHTML = "Output : " + classes[index];
};

function preprocess()
{
    var img = document.getElementById('preview');
    //convert the image data to a tensor 
    let tensor = tf.browser.fromPixels(img);
    //resize to 256 X 256
    const resized = tf.image.resizeBilinear(tensor, [256, 256]).toFloat();
    // Normalize the image 
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    //We add a dimension to get a batch shape 
    const batched = normalized.expandDims(0);

    return batched
};

window.addEventListener('load', async function() {
    model = await tf.loadLayersModel('./assets/model/model.json');
    preloader.classList.add('preloader-deactivate');
});