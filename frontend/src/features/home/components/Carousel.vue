<template>
    <div class="carousel">
        <slot :currentSlide="currentSlide" />

        <div class="navigate">
            <div class="toggle-page left">
                <i @click="prevSlide" class="fa-solid fa-chevron-left"></i>
            </div>
            <div class="toggle-page right">
                <i @click="nextSlide" class="fa-solid fa-chevron-right"></i>
            </div>
        </div>

        <div class="pagination">
            <span @click="goToSlide(index)" v-for="(slide, index) in getSlideCount" :key="index" :class="{ active : index + 1 === currentSlide }">
            </span>
        </div>
    </div>
</template>

<script>
import {ref, onMounted} from "vue";

export default {
    setup() {
        const currentSlide = ref(1);
        const getSlideCount = ref(null);
        const autoPlayEnabled = ref(true);
        const timeoutDuration = ref(5000);

        //next slide on carousel toggle
        const nextSlide = () => {
            if (currentSlide.value === getSlideCount.value) {
                currentSlide.value = 1;
                return;
            }
            currentSlide.value += 1;
        };

        const prevSlide = () => {
            if (currentSlide.value === 1) {
                currentSlide.value = getSlideCount.value;
                return;
            }
            currentSlide.value -= 1;
        };

        const goToSlide = (index) => {
            currentSlide.value = index + 1;
        }

        const autoPlay = () => {
            setInterval(() => {
                nextSlide()
            }, timeoutDuration.value);
        };

        if (autoPlayEnabled.value) {
            autoPlay();
        }

        onMounted(() => {
            getSlideCount.value = document.querySelectorAll('.slide').length;
        });

        return {currentSlide, nextSlide, prevSlide, getSlideCount, goToSlide}
    },
}
</script>

<style lang="css">
.navigate {
    padding: 0 16px;
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.navigate .toggle-page {
    display: flex;
    flex: 1;
}

.navigate .right {
    justify-content: flex-end;
}

.navigate i {
    cursor: pointer;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #000;
    color: #fff;
    opacity: 30%
}

.navigate i:hover {
    opacity: 100%;
}

.pagination {
    position: absolute;
    bottom: 24px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

.pagination span {
    cursor: pointer;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #fff;
    opacity: 30%;
}

.pagination span.active{
    width: 13px;
    height: 13px;
    opacity: 70%;
}

.pagination span:hover {
    width: 13px;
    height: 13px;
}
</style>
