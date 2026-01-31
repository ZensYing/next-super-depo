/**
 * Image compression utility
 * Compresses images that exceed the max size limit
 */

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface CompressOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
}

/**
 * Compress an image file if it exceeds the max size
 * Uses canvas-based compression for browser compatibility
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<File> {
    const {
        maxSizeMB = MAX_SIZE_MB,
        maxWidthOrHeight = 1920,
        quality = 0.8
    } = options;

    const maxBytes = maxSizeMB * 1024 * 1024;

    // If file is already under limit, return as-is
    if (file.size <= maxBytes) {
        console.log(`Image ${file.name} is ${(file.size / 1024 / 1024).toFixed(2)}MB - no compression needed`);
        return file;
    }

    console.log(`Compressing ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> target: ${maxSizeMB}MB`);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Scale down if image is too large
                if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
                    if (width > height) {
                        height = Math.round((height * maxWidthOrHeight) / width);
                        width = maxWidthOrHeight;
                    } else {
                        width = Math.round((width * maxWidthOrHeight) / height);
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Try to compress with decreasing quality until under limit
                let currentQuality = quality;
                const attemptCompress = () => {
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) {
                                reject(new Error('Failed to compress image'));
                                return;
                            }

                            // If still too large and quality > 0.1, try again with lower quality
                            if (blob.size > maxBytes && currentQuality > 0.1) {
                                currentQuality -= 0.1;
                                console.log(`Still too large (${(blob.size / 1024 / 1024).toFixed(2)}MB), retrying with quality ${currentQuality.toFixed(1)}`);
                                attemptCompress();
                                return;
                            }

                            // Create new file with same name but compressed
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });

                            console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        currentQuality
                    );
                };

                attemptCompress();
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
    });
}

/**
 * Validate image file type
 */
export function isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * Get formatted file size string
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
