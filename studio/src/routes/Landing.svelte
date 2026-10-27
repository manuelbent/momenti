<script lang="ts">
    import Navbar from '$lib/components/landing/components/Navbar.svelte'
    import Hero from '$lib/components/landing/components/hero/Hero.svelte'
    import Footer from '$lib/components/landing/components/Footer.svelte'
    import MomentGenerator from '$lib/components/landing/MomentGenerator.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
</script>

<div class="min-h-screen bg-canvas flex flex-col transition-opacity duration-400">

    <Navbar/>

    <main class="flex-1 flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-180 flex flex-col gap-5">
            <Hero/>

            <MomentGenerator/>

            <Footer/>
        </div>
    </main>
</div>

<Toast/>
