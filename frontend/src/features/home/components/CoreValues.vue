<template>
    <div class="coreValues">
        <h1 class="coreValues-title">Core Values</h1>
        <div class="coreValue-contents">
            <div class="coreValue">
                <img src="../../../assets/AboutUs/democratic.png" alt="Democratic"/>
                <h2 class="subheading">Democratic</h2>
                <p class="coreValue-body">Every voice matters. We encourage participation and ensure decisions represent
                    the communityâ€™s collective interest. </p>
            </div>
            <div class="coreValue">
                <img src="../../../assets/AboutUs/future-thinking.png" alt="Innovative"/>
                <h2 class="subheading">Innovative</h2>
                <p class="coreValue-body">We embrace creativity and technology to stay ahead and continuously improve
                    our community. </p>
            </div>
            <div class="coreValue">
                <img src="../../../assets/AboutUs/determined.png" alt="Determined"/>
                <h2 class="subheading">Determined</h2>
                <p class="coreValue-body">We persevere through challenges, staying committed to our mission and working
                    tirelessly for success. </p>
            </div>
            <div class="coreValue">
                <img src="../../../assets/AboutUs/welcoming.png" alt="Welcoming"/>
                <h2 class="subheading">Welcoming</h2>
                <p class="coreValue-body">Our doors are open to everyone, fostering an environment of respect, warmth,
                    and empathy. </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
.coreValues {
    padding: 90px 130px;
}

.coreValues-title {
    font-size: 40px;
    color: #EBBD6D;
    margin: 0;
    font-weight: bold;
    font-family: 'Inter', sans-serif;
    margin-bottom: 30px;
}

.coreValues img {
    width: 5vw;
    padding: 10px;
    border-radius: 50%;
    margin-bottom: 20px;
}

.coreValue-contents {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-between;
}

.coreValue {
    background-color: #fff;
    width: 40%;
    padding: 20px 0px;
    display: flex;
    flex-direction: column;
}

.subheading {
    font-size: 24px;
    margin-bottom: 10px;
}

.coreValue-body {
    font-size: 20px;
    line-height: 1.5;
}
</style>
