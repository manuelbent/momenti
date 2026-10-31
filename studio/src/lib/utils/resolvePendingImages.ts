import { uploadImage } from '$lib/api/images'
import { pendingImages } from '$lib/stores/pendingImages'
import { updateNode } from '$lib/stores/momentContent'

/**
 * Walks the node tree, finds any image node whose src is a local blob URL,
 * uploads the corresponding File to R2, updates the moment store with the
 * permanent URL, and cleans up the pending entry.
 *
 * Returns a deep copy of the content with all blob URLs replaced so it is
 * safe to pass directly to updateMoment().
 */
export const resolvePendingImages = async (content: MomentContent, momentId: number): Promise<MomentContent> => {
    const resolveNode = async (node: MomentNode): Promise<MomentNode> => {
        let resolved = { ...node }

        if (node.type === 'image' && node.src?.startsWith('blob:')) {
            const file = pendingImages.get(node.src)
            if (!file) {
                throw new Error('The selected image is no longer available. Please select it again.')
            }

            const url = await uploadImage({ momentId, nodeId: node.id, file })
            // update the live store so the preview stays in sync
            updateNode(node.id, { src: url })
            URL.revokeObjectURL(node.src)
            pendingImages.remove(node.src)
            resolved = { ...resolved, src: url }
        }

        if (node.children?.length) {
            resolved = { ...resolved, children: await Promise.all(node.children.map(resolveNode)) }
        }

        return resolved
    }

    return {
        ...content,
        root: await resolveNode(content.root),
    }
}
