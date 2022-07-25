<template>
    <div class="loadingScreen" ref="loadingScreen">
        <h3>Loading</h3>
        <div class="progresBar">
            <div class="progresFill" v-bind:style="{ width: progress + '%' }">
            </div>
        </div>
        <small>{{ url }}</small>
        
    </div>
</template>


<script> 
import LoadingController from '../classes/LoadingController';

export default {
    name: "LoadingScreen",
    data() {
        return {
            progress: 0,
            url: '',
        };
    },
    mounted() {
        LoadingController.onProgress = this.onProgress;
        LoadingController.onLoad = this.onLoad;
    },
    methods: {
        onProgress(url, loaded, total) {
            this.progress = (loaded / total) * 100;
            this.url = url
        },
        onLoad() {
            this.$refs.loadingScreen.classList.add("finished");
        }
    }
    
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .loadingScreen {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #151515;
        z-index: 1000;
        color: white;
        font-size: 2em;
        transition: opacity 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &.finished {
            opacity: 0;
            pointer-events: none;
        }

        small {
            color: #555;
        }

        .progresBar {
            position: relative;
            width: 300px;
            height: 30px;
            border: 2px solid #222;
            display: block;
            margin-bottom: 15px;

            .progresFill {
                position: absolute;
                left: 0;
                top: 0;
                width: 0%;
                height: 100%;
                background-color: #f63fff;
                transition: width 0.5s ease;
            }
        }
    }
</style>
