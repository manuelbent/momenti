import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const imageSource = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="tan"/></svg>'

const content: MomentContent = {
    slug: 'supper-a1b2',
    fonts: [],
    stylesheet: `
        #root { color: #16352d; background: #fffdf8; font-family: sans-serif; padding: 2rem; }
        #opening { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        #title { font-size: clamp(2rem, 6cqw, 5rem); line-height: 1.05; max-width: 12ch; }
        #title::before { content: "An invitation"; display: block; font-size: 1rem; }
        #photo { height: 12rem; }
        #photo img { object-position: 25% 50%; }
        #rsvp { padding: 2rem 0; }
        #rsvp input { border: 1px solid; }
        #rsvp button { background: #16352d; color: white; padding: .5rem 1rem; }
        #rsvp button:hover { background: rgb(70, 90, 80); }
        #rsvp button:focus-visible { outline: 3px solid orange; }
        #layout-default { gap: 1rem; }
        #outside, body { color: rgb(255, 0, 0); }
        @container moment (max-width: 40rem) {
            #opening { grid-template-columns: 1fr; }
            #layout-default { flex-direction: column; }
        }
    `,
    root: {
        id: 'root', type: 'box',
        children: [
            {
                id: 'opening', type: 'box', variant: 'hero',
                children: [
                    { id: 'title', type: 'text', tag: 'h1', html: 'Supper at dusk' },
                    {
                        id: 'photo', type: 'image', alt: 'Warm evening light',
                        src: imageSource,
                    },
                ],
            },
            {
                id: 'layout-default', type: 'box', layout: 'row',
                children: [
                    { id: 'when', type: 'text', html: 'At dusk' },
                    { id: 'where', type: 'text', html: 'In the garden' },
                ],
            },
            {
                id: 'rsvp', type: 'form', buttonLabel: 'Join us',
                fields: [{ type: 'input', name: 'name', label: 'Your name' }],
            },
        ],
    },
}

function makeMoment(pageContent = content) {
    return {
        id: 1, user_id: null, slug: pageContent.slug, prompt: 'A supper in the garden',
        is_published: true, content: pageContent, created_at: '2026-01-01', updated_at: null,
    }
}

async function prepare(page: Page, pageContent = content) {
    const moment = makeMoment(pageContent)
    await page.addInitScript(data => {
        localStorage.setItem('momenti__preview', JSON.stringify(data))
        localStorage.setItem('momenti__invite_key', 'browser-fixture')
    }, moment)
    await page.route(url => url.pathname.startsWith('/api/'), route => {
        const url = new URL(route.request().url())
        return route.fulfill({
            json: url.pathname.endsWith('/moments') ? [moment]
                : url.pathname.endsWith('/changes') ? [] : moment,
        })
    })
}

for (const surface of [
    { name: 'studio preview', url: 'http://127.0.0.1:4173/#/preview' },
    { name: 'published viewer', url: 'http://127.0.0.1:4174' },
]) {
    test(`${surface.name}: responsive composition, crop and pseudo-elements`, async ({ page }) => {
        await prepare(page)
        await page.setViewportSize({ width: 1200, height: 900 })
        await page.goto(surface.url)
        await expect(page.locator('#opening')).toHaveCSS('grid-template-columns', '736px 368px')
        await expect(page.locator('#layout-default')).toHaveCSS('display', 'flex')
        await expect(page.locator('#photo img')).toHaveCSS('object-position', '25% 50%')
        expect(await page.locator('#title').evaluate(el => getComputedStyle(el, '::before').content))
            .toBe('"An invitation"')

        await page.setViewportSize({ width: 390, height: 844 })
        await expect(page.locator('#opening')).toHaveCSS('grid-template-columns', '326px')
        await expect(page.locator('#layout-default')).toHaveCSS('flex-direction', 'column')
        const dimensions = await page.locator('[data-moment-page]').evaluate(el => ({
            width: el.clientWidth, scrollWidth: el.scrollWidth,
        }))
        expect(dimensions.scrollWidth).toBe(dimensions.width)
        await page.getByLabel('Your name').fill('Guest')
        await expect(page.getByLabel('Your name')).toHaveValue('Guest')
    })

    test(`${surface.name}: CSS cannot style outside the page or break out of style text`, async ({ page }) => {
        await prepare(page, {
            ...content,
            stylesheet: content.stylesheet + '#title::after { content: "</style><script>window.injected=true</script>"; }',
        })
        await page.goto(surface.url)
        await expect(page.locator('#title')).toHaveCSS('color', 'rgb(22, 53, 45)')
        const result = await page.evaluate(() => {
            const outside = document.createElement('p')
            outside.id = 'outside'
            outside.textContent = 'Studio UI'
            document.body.append(outside)
            return {
                outsideColor: getComputedStyle(outside).color,
                injected: Object.hasOwn(window, 'injected'),
            }
        })
        expect(result.outsideColor).not.toBe('rgb(255, 0, 0)')
        expect(result.injected).toBe(false)
    })

    test(`${surface.name}: legacy inline pages remain unwrapped`, async ({ page }) => {
        const { stylesheet, ...legacy } = content
        await prepare(page, {
            ...legacy,
            root: { ...legacy.root, css: 'color: rgb(20, 40, 60)' },
        })
        await page.goto(surface.url)
        await expect(page.locator('#title')).toHaveCSS('color', 'rgb(20, 40, 60)')
        await expect(page.locator('[data-moment-page]')).toHaveCount(0)
    })

    test(`${surface.name}: unsupported styles show an explicit error`, async ({ page }) => {
        await prepare(page, { ...content, stylesheet: '@import "https://example.com/untrusted.css";' })
        await page.goto(surface.url)
        await expect(page.getByRole('alert')).toContainText('styles could not be displayed')
        await expect(page.locator('#title')).toHaveCount(0)
    })
}

test('editor uses frame width, supports text editing, and saves the stylesheet', async ({ page }) => {
    await prepare(page)
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('http://127.0.0.1:4173/#/studio')
    await expect(page.locator('#opening')).toHaveCSS('display', 'grid')
    const columns = await page.locator('#opening').evaluate(el =>
        getComputedStyle(el).gridTemplateColumns.split(' ').map(Number.parseFloat),
    )
    expect(columns).toHaveLength(2)
    expect(columns[0]).toBeCloseTo(789.333, 1)
    expect(columns[1]).toBeCloseTo(394.667, 1)
    await page.locator('button[title="Desktop"]').nth(1).click()
    await expect.poll(() => page.locator('#opening').evaluate(el =>
        getComputedStyle(el).gridTemplateColumns.split(' ').length,
    )).toBe(1)
    expect(await page.locator('#opening').evaluate(el =>
        parseFloat(getComputedStyle(el).gridTemplateColumns),
    )).toBeCloseTo(326, 1)

    await page.locator('#title').click()
    await page.locator('#title').fill('An evening together')
    await page.getByLabel('Your name').click()

    const saved = page.waitForRequest(request => request.method() === 'PUT'
        && request.url().includes('/moments/1'))
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    const request = await saved
    const body = request.postDataJSON()
    expect(body.content.stylesheet).toBe(content.stylesheet)
    expect(body.content.root.children[0].children[0].html).toBe('An evening together')
})

test('published form submission remains functional with page styles', async ({ page }) => {
    await prepare(page)
    await page.goto('http://127.0.0.1:4174')
    await page.getByLabel('Your name').fill('Guest')
    const submitted = page.waitForRequest(request => request.url().endsWith('/submissions'))
    await page.getByRole('button', { name: 'Join us' }).click()
    expect((await submitted).postDataJSON()).toEqual({ form_id: 'rsvp', data: { name: 'Guest' } })
})

test('streaming preview applies the stylesheet at its desktop canvas width', async ({ page }) => {
    await prepare(page)
    await page.route(url => url.pathname === '/api/capture/resume', route => route.fulfill({
        contentType: 'text/event-stream',
        body: `event: chunk\ndata: ${JSON.stringify({ chunk: JSON.stringify(content) })}\n\n`,
    }))
    await page.setViewportSize({ width: 500, height: 900 })
    await page.goto('http://127.0.0.1:4173')
    const opening = page.locator('.preview-shell #opening')
    await expect(opening).toHaveCSS('display', 'grid')
    expect(await opening.evaluate(el =>
        getComputedStyle(el).gridTemplateColumns.split(' ').length,
    )).toBe(2)
    await expect(page.locator('.preview-shell #title')).toHaveCSS('color', 'rgb(22, 53, 45)')
})

test('gallery lightbox stays in the viewport of a long styled page', async ({ page }) => {
    await prepare(page, {
        ...content,
        root: {
            ...content.root,
            children: [
                ...(content.root.children ?? []),
                { id: 'spacer', type: 'box', css: 'height: 1800px' },
                {
                    id: 'gallery', type: 'carousel',
                    children: [{ id: 'slide', type: 'image', src: imageSource, alt: 'Evening' }],
                },
            ],
        },
    })
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('http://127.0.0.1:4174')
    await page.locator('#gallery button').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, width: 1200, height: 900 })
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
})
