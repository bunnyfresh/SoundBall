<template>
    <ThreeScene />
    <LoadingScreen />
    <TitleScreen />
</template>

<script>
import ThreeScene from "./components/ThreeScene.vue";
import TitleScreen from "./components/TitleScreen.vue";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
    name: "App",
    components: {
        ThreeScene,
        LoadingScreen,
        TitleScreen
    },
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,700;1,200;1,300;1,400;1,700&display=swap'); 

body {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
}
</style>
