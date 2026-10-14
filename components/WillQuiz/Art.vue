<template>
  <div class="quiz-art" :class="`scene-${scene}`" aria-hidden="true">
    <template v-if="scene === 'partner'">
      <div class="arch blue tilt-left"><img src="/quiz/mother.webp" alt="" /></div>
      <div class="arch butter tilt-right"><img src="/quiz/father.webp" alt="" /></div>
      <FeltHeart class="badge" />
    </template>

    <template v-else-if="scene === 'children'">
      <div class="arch butter tilt-left"><img src="/quiz/son.webp" alt="" /></div>
      <div class="arch blue tilt-right"><img src="/quiz/daughter.webp" alt="" /></div>
    </template>

    <div v-else-if="scene === 'pets'" class="arch butter">
      <svg viewBox="0 0 160 200" class="felt-scene">
        <defs>
          <filter id="felt" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="4" result="fuzzNoise" />
            <feDisplacementMap in="SourceGraphic" in2="fuzzNoise" scale="5" result="fuzzy" />
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="3" seed="9" result="grain" />
            <feColorMatrix in="grain" type="saturate" values="0" result="greyGrain" />
            <feComposite in="fuzzy" in2="greyGrain" operator="arithmetic" k2="1" k3="0.32" k4="-0.16" result="textured" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="soft" />
            <feOffset in="soft" dx="-3" dy="-5" result="lift" />
            <feComposite in="SourceAlpha" in2="lift" operator="out" result="shade" />
            <feFlood flood-color="#172d46" flood-opacity="0.28" />
            <feComposite in2="shade" operator="in" result="innerShadow" />
            <feMerge result="body">
              <feMergeNode in="textured" />
              <feMergeNode in="innerShadow" />
            </feMerge>
            <feComposite in="body" in2="fuzzy" operator="in" />
          </filter>
        </defs>
        <ellipse cx="80" cy="186" rx="62" ry="7" fill="rgb(23 45 70 / 12%)" />
        <g filter="url(#felt)">
          <path d="M118 176c30 0 34-34 14-44" fill="none" stroke="#d99a22" stroke-width="13" stroke-linecap="round" />
          <path d="M40 182c-6-42 12-74 40-74s46 32 40 74Z" fill="#e2a52b" />
          <path d="M60 182c0-30 8-48 20-48s20 18 20 48Z" fill="#f3ecdc" />
          <path d="M44 86 42 46l26 22ZM116 86l2-40-26 22Z" fill="#e2a52b" />
          <path d="M50 74 49 56l12 10ZM110 74l1-18-12 10Z" fill="#c9834f" />
          <ellipse cx="80" cy="88" rx="40" ry="34" fill="#e2a52b" />
          <ellipse cx="80" cy="102" rx="20" ry="14" fill="#f3ecdc" />
          <circle cx="132" cy="176" r="14" fill="#2446c2" />
        </g>
        <g fill="#172d46">
          <ellipse cx="65" cy="86" rx="4.5" ry="5.5" />
          <ellipse cx="95" cy="86" rx="4.5" ry="5.5" />
          <path d="M76 97h8l-4 5Z" fill="#b35a4b" />
        </g>
        <circle cx="66.5" cy="84" r="1.4" fill="#fff" />
        <circle cx="96.5" cy="84" r="1.4" fill="#fff" />
        <path d="M80 102c-2 4-7 4-8 1M80 102c2 4 7 4 8 1M58 100l-20-3M58 105l-19 3M102 100l20-3M102 105l19 3" fill="none" stroke="#172d46" stroke-width="1.4" stroke-linecap="round" />
        <path d="M124 170c6 2 12 8 14 16M122 180c8-6 18-6 22-2" fill="none" stroke="#9fb2f0" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </div>

    <div v-else-if="scene === 'home'" class="arch wide blue"><img src="/quiz/father-daughter.webp" alt="" /></div>

    <div v-else-if="scene === 'matters'" class="arch butter"><img src="/quiz/mother.webp" alt="" /></div>

    <div v-else-if="scene === 'contact'" class="arch blue"><img src="/quiz/son.webp" alt="" /></div>

    <img v-else class="family" src="/quiz/family.webp" alt="" />
  </div>
</template>

<script setup lang="ts">
import type { Illustration } from '~~/shared/willQuiz'

defineProps<{ scene: Illustration }>()

const FeltHeart = () => h('svg', { viewBox: '0 0 40 36' }, [
  h('path', {
    d: 'M20 34C8 25 1 18 2 10 3 4 8 1 13 2c3 .6 5.5 2.6 7 5 1.5-2.4 4-4.4 7-5 5-1 10 2 11 8 1 8-6 15-18 24Z',
    fill: '#2446c2',
    stroke: '#f8f7f3',
    'stroke-width': 2.5
  })
])
</script>

<style scoped>
.quiz-art {
  --arch-height: 168px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: calc(var(--arch-height) + 8px);
  margin: 0 auto 22px;
}

.arch {
  position: relative;
  width: calc(var(--arch-height) * 0.78);
  height: var(--arch-height);
  overflow: hidden;
  border: 3px solid rgb(255 255 255 / 85%);
  border-radius: 999px 999px 24px 24px;
  box-shadow: 0 0 0 0.5px rgb(23 45 70 / 8%), 0 14px 30px -10px rgb(23 45 70 / 30%);
}

.arch.wide {
  width: calc(var(--arch-height) * 1.18);
}

.arch.blue {
  background: linear-gradient(180deg, #dfe6fa, #c8d4f6);
}

.arch.butter {
  background: linear-gradient(180deg, #f9eccb, #f2dc9f);
}

.arch img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center top;
}

.arch + .arch {
  margin-left: -14px;
}

.tilt-left {
  transform: rotate(-4deg);
}

.tilt-right {
  transform: rotate(4deg) translateY(6px);
}

.felt-scene {
  width: 100%;
  height: 100%;
  display: block;
}

.badge {
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 38px;
  transform: translateX(-50%) rotate(-8deg);
  filter: drop-shadow(0 3px 4px rgb(23 45 70 / 22%));
}

.family {
  width: auto;
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.scene-summary,
.scene-done {
  --arch-height: 150px;
}

@media (max-width: 520px) {
  .quiz-art {
    --arch-height: 128px;
    margin-bottom: 16px;
  }

  .scene-summary,
  .scene-done {
    --arch-height: 116px;
  }
}

@media (max-height: 640px) {
  .quiz-art {
    --arch-height: 104px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .arch,
  .badge,
  .family {
    animation: settle 420ms cubic-bezier(.2, .8, .3, 1.2) both;
  }

  .arch + .arch {
    animation-delay: 70ms;
  }

  .badge {
    animation-delay: 160ms;
  }
}

@keyframes settle {
  from { opacity: 0; translate: 0 10px; scale: .96; }
  to { opacity: 1; translate: 0 0; scale: 1; }
}
</style>
