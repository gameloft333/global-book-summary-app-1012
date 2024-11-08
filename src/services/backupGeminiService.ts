import i18next from 'i18next';

const API_KEY = import.meta.env.VITE_KIMI_API_KEY;
const API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export async function generateBookSummaryBackup(bookName: string, language: 'zh' | 'en'): Promise<string> {
    const sanitizedBookName = bookName.replace(/[·:：]/g, ' ').trim();

    // 使用与 Gemini 相同的提示词，但通过 Kimi API 实现
    const basePrompt = `请为书籍《${sanitizedBookName}》生成一个摘要，格式如下：

${language === 'zh' ? `
书籍名称：[书名]

作者：[作者名]

国籍：[作者国籍]

出版年份：[出版年份]

摘要：
[在此处提供摘要内容，不少于150个字]

经典语句：
[提供至少一句经典语句或金句，并注明出处]` :
            `Book Title: [Title]

Author: [Author Name]

Nationality: [Author Nationality]

Publication Year: [Year]

Summary:
[Provide the summary content here, no less than 150 words]

Classic Quote:
[Provide at least one classic sentence or golden quote, and note its source]`}`;

    try {
        if (!API_KEY) {
            throw new Error('API key is missing');
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: [{ role: "user", content: basePrompt }],
                temperature: 0.7,
                max_tokens: 2000
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        // 验证响应格式
        const expectedFormat = language === 'zh'
            ? ['书籍名称：', '作者：', '出版年份：', '摘要：', '经典语句：']
            : ['Book Title:', 'Author:', 'Publication Year:', 'Summary:', 'Classic Quote:'];

        if (!expectedFormat.every(format => text.includes(format))) {
            throw new Error(i18next.t('responseFormatMismatch'));
        }

        return text;
    } catch (error) {
        console.error('Backup service error:', error);
        throw error;
    }
}