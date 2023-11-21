<template>
    <div class="navabar">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <select
                id="selectType"
                name="selectType"
                class="form-select-sm mb-2 ms-2 select-style badge text-bg"
                aria-label="NULL"
                @change="search()"
                v-model="statusFilter"
            >
                <option v-for="type in types" :key="type.id" :value="type.id">
                    {{ type.name }}
                </option>
            </select>
            <div class="d-flex ps-2" role="search">
                <input
                    id="searchBar"
                    class="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                />
                <button class="btn btn-outline-success" @click="search()">Search</button>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
import { apiService } from '../utils/APIService';
import { search } from '@/utils/search';

export default {
    name: 'NavBar',
    data() {
        return {
            types: [{ id: '0', name: 'null' }],
            statusFilter: 0
        };
    },
    methods: {
        getTypes() {
            apiService('types/').then((data: object) => {
                for (let i = 0; i < data.length; i++) {
                    this.types.push(data[i]);
                }
            });
        },
        search() {
            search(
                document.getElementById('searchBar').value.toLowerCase(),
                this.types[this.statusFilter].name.toLowerCase()
            );
        }
    },
    created() {
        this.getTypes();
    }
};
</script>

<style>
.navabar {
    list-style-type: none;
}

.select-style {
    font-family: 'Times New Roman', Times, serif;
    color: black;
}
</style>
