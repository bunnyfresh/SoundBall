import RAF from '../utils/RAF'
import FlvJs from 'flv.js'
import axios from 'axios'
import Hls from 'hls.js'

class SoundReactor {

    constructor(audioUrl) {
        this.ctx
        this.audio
        this.audioSource
        this.analyser
        this.fdata
        this.url = audioUrl;
        this.isPlaying = false

        this.bind()
    }

    init() {
        
        // axios.get(this.url, {
        //     responseType: 'arraybuffer',
        //     crossdomain: true,
        //     headers: {
        //         'Content-Type': 'application/x-mpegURL'
        //     },
        //     onUploadProgress() {
        //         console.log(1)
        //     },
        //     onDownloadProgress(response) {
        //         console.log(response)
        //     }
        //   }).then(d => { 

        //     const blob = new Blob(new Uint8Array(d.data), {
        //         type: 'application/x-mpegURL'
        //     });

        //     const url = URL.createObjectURL(blob);

        //     console.log(d.data, url)

            
            this.ctx = new AudioContext();
            this.audio = new Audio(this.url);
        //     // console.log(this.audio)
            this.audioSource = this.ctx.createMediaElementSource(this.audio);
            this.analyser = this.ctx.createAnalyser();
            this.analyser.smoothingTimeConstant = 0.8

        //     // this.flv_load(this.url)

            this.audioSource.connect(this.analyser);
            this.audioSource.connect(this.ctx.destination);
            this.fdata = new Uint8Array(this.analyser.frequencyBinCount);
             
            this.play()
        // });

        // this.ctx = new AudioContext();
        // this.audio = new Audio(this.audio);
        // this.audio = document.getElementById('test');

        // console.log(this.audio)
        
        // if (Hls.isSupported()) {
        //     const hlsInit = new Hls()
        //     hlsInit.loadSource(this.url)
        //     console.log(hlsInit) 
        //     hlsInit.attachMedia(this.audio); 
        // }

        // console.log(this.audio)
        // this.audioSource = this.ctx.createMediaElementSource(this.audio);
        // this.analyser = this.ctx.createAnalyser();
        // this.analyser.smoothingTimeConstant = 0.8

        // this.flv_load(this.url)

        // this.audioSource.connect(this.analyser);
        // this.audioSource.connect(this.ctx.destination);
        // this.fdata = new Uint8Array(this.analyser.frequencyBinCount);

        // this.audio.play()
    }

    
    play() { 
        if(this.audio) {
            this.audio.play()
            RAF.subscribe('audioReactorUpdate', this.update)
            this.isPlaying = true
        } 
    }

    pause() {
        this.audio.pause()
        RAF.unsubscribe('audioReactorUpdate')
        this.isPlaying = false
    }

    update() {
        this.analyser.getByteFrequencyData(this.fdata);
    }

    bind() {
        this.update = this.update.bind(this)
        this.init = this.init.bind(this)
    }

}
const _instance = new SoundReactor('../../assets/v2.mp3');
export default _instance;