<template>
    <div class="titleScreen">
        <div class="mainDescription" ref="mainDescription">
            <h1>SoundBall.</h1>
            <p>Simple and pritty music visualization</p>
        </div>
        <div class="audioButton" ref="audioButton">
            <button @click="onPlay()" v-if="!isHidden">Play</button>
            <button @click="onPause()" v-if="isHidden">Pause</button>
        </div>
    </div>
</template>


<script>

import SoundReactor from "../classes/SoundReactor";

export default {
    name: "TitleScreen", 
    data() {
        return {
            isHidden: false
        }
    },
    methods: {
        onPlay() {
            SoundReactor.init(); 
            SoundReactor.play();
            this.$refs.mainDescription.getElementsByTagName('h1')[0].classList.add('hide');
            this.$refs.mainDescription.getElementsByTagName('p')[0].classList.add('hide');
            this.isHidden = true;
        },
        onPause() {
            SoundReactor.pause();
            this.$refs.mainDescription.getElementsByTagName('h1')[0].classList.remove('hide');
            this.$refs.mainDescription.getElementsByTagName('p')[0].classList.remove('hide');
            this.isHidden = false;
        }
    }, 
    mounted() {
        // if (Hls.isSupported()) {
        //     var video = document.getElementById('video');
        //     var hls = new Hls();
            
        //     hls.loadSource('http://localhost:8000/live/lol/playlist.m3u8');
        //     // bind them together
        //     hls.attachMedia(video);
        //     hls.on(Hls.Events.MEDIA_ATTACHED, function () {
        //     console.log('video and hls.js are now bound together !');
        //     hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        //         console.log(
        //         'manifest loaded, found ' + data.levels.length + ' quality level'
        //         );
        //     });
        //     });
        // }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .titleScreen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 900;

        .mainDescription {
            color: #fff;
            position: absolute;
            top: 100px;
            left: 100px;

            h1 {
                font-size: 3rem;
                transition: all 1s ease-in-out;
            }

            p {
                transition: all 1s ease-in-out;
                transition-delay: 0.3s;
            }

            .hide {
                transform: translateX(-100vw);
            }
        }

        .audioButton {
            position: absolute;
            bottom: 50px;
            right: 50px;

            button {
                cursor: pointer;
                background: none;
                outline: noen;
                border-radius: 100px;
                border: 3px solid  #f63fff;
                padding: 10px 30px;
                color: #fff;
                font-weight: bold;
                transition: all .5s ease;
                &:hover {
                    background: #f63fff;
                }
            }
        }
    }
    
</style>
