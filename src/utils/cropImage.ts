// src/utils/cropImage.ts
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous') // evita problemas de CORS no canvas
        image.src = url
    })

export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    flip = { horizontal: false, vertical: false }
): Promise<File | null> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    // Define o tamanho final do canvas baseado no corte desejado
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Pinta o recorte na posição x=0, y=0 do destino, pegando as coordenadas da fonte
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    // As a blob
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                // reject(new Error('Canvas is empty'));
                resolve(null)
                return
            }

            // Criando um pseudo-File com nome aleatório para envio no formData suportar nome nativo
            const file = new File([blob], `cropped_${Date.now()}.jpg`, { type: 'image/jpeg' })
            resolve(file)
        }, 'image/jpeg')
    })
}
