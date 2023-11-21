<template>
    <div class="HomeView row justify-content-center">
        <div class="col-auto">
            <navbar />
            <table class="container table">
                <thead class="fs-1">
                    Series
                </thead>
                <tbody>
                    <tr
                        colspan="2"
                        class="list table-active"
                        v-for="(serie, index) in series"
                        :key="serie.id"
                    >
                        <div class="card mt-2" style="width: 18rem">
                            <router-link
                                :to="{ name: 'SerieDetail', params: { slug: serie.slug } }"
                            >
                                <img :src="imagesSeries[index]" class="card-img-top" alt="..." />
                            </router-link>

                            <div class="card-body">
                                <h5 class="card-title">{{ serie.name }}</h5>
                                <p class="card-text fst-italic">Type: {{ serie.typology_name }}</p>

                                <router-link
                                    :to="{
                                        name: 'PublisherDetail',
                                        params: { slug: serie.publisher_slug }
                                    }"
                                >
                                    <p class="card-text fw-bold">
                                        Publisher: {{ serie.publisher_name }}
                                    </p>
                                </router-link>
                            </div>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import navbar from '../components/Navbar.vue';

export default {
    name: 'HomeView',
    data() {
        return {
            series: {},
            imagesSeries: []
        };
    },
    components: {
        navbar
    },
    methods: {
        getDataSeries() {
            apiService('series/').then((data: object) => {
                this.series = data;
            });
        },
        getDataImageSeries() {
            apiService('image/series/').then((data: any) => {
                for (let i = 0; i < data.length; i++) {
                    this.imagesSeries.push(data[i].image);
                }
            });
        }
    },
    created() {
        this.getDataSeries();
        this.getDataImageSeries();
    }
};
</script>

<style>
a {
    text-decoration: none;
}
</style>
