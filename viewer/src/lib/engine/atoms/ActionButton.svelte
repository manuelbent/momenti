<script lang="ts">
    let { data, overrides }: { data: { text: string; link: string }; overrides?: StylingOverrides } = $props()

    const alignmentMap = { left: 'text-left', center: 'text-center', right: 'text-right' }
    const shadowMap = { none: '', soft: 'shadow-md', 'heavy-glow': 'shadow-[0_0_20px_var(--color-primary)]' }
</script>

<div class="w-full {overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left'}">
    <a
            href={data.link}
            style={overrides?.customTextColor ? `color: ${overrides.customTextColor}` : ''}
            class="inline-block px-6 py-3 font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
			bg-(--color-primary) text-white rounded-(--borderRadiusGlobal)
			{(overrides?.shadowDepth && shadowMap[overrides.shadowDepth]) || shadowMap.soft}"
    >
        {data.text}
    </a>
</div>
