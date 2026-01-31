
"use server";

export async function translateText(text: string, targetLang: string) {
    if (!text) return "";

    try {
        // Using the free/unofficial Google Translate endpoint for demonstration.
        // For production, this should be replaced with a proper Google Cloud Translate API call using an API Key.
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);

        if (!response.ok) return "";

        const data = await response.json();
        // The structure is typically [[["translated_text", "source_text", ...], ...], ...]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return "";
    } catch (error) {
        console.error("Translation error:", error);
        return "";
    }
}
