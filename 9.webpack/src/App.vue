<template>
<div>
    hello Vue
    <p v-for="(todo, index) in todos" :key="index">{{ todo }}</p>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    components: {
        // todo...

    }
})
export default class Todo extends Vue {
    public todos:string[] = ['banana', 'apple', 'orange'];
}
</script>