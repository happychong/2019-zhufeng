<template>
    <ul>
        <li v-for="item of arr" :key="item">
            <!-- 这里的slot标签的属性像外传递到写v-slot的位置 -->
            <!--  $slots.default() - vue3写法 -->
            <slot v-if="$slots.default && $slots.default()" :item="item" x="0"></slot>
            <template v-else>000</template>
            <!-- 作用域插槽 slot 可以将组建的内容共享、复用 -->
        </li>
    </ul>
</template>

<script>
    export default {
        props: ['arr']
    }
</script>