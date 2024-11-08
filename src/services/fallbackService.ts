import config, { ApiProvider } from '../config';
import { generateBookSummary } from './geminiService';
import { generateBookAnalysis } from './kimiService';
import { generateBookSummaryBackup } from './backupGeminiService';

export async function generateWithFallback(
    bookName: string,
    language: 'zh' | 'en',
    type: 'summary' | 'analysis'
): Promise<string> {
    const serviceConfig = config.apiServices[type];
    const primaryProvider = serviceConfig.preferredProvider;
    
    try {
        // 根据类型选择正确的服务
        if (type === 'summary') {
            if (primaryProvider === 'gemini') {
                return await generateBookSummary(bookName, language);
            } else {
                // 使用 Kimi API 生成摘要
                return await generateBookSummaryBackup(bookName, language);
            }
        } else { // analysis
            if (primaryProvider === 'gemini') {
                return await generateBookSummary(bookName, language);
            } else {
                return await generateBookAnalysis(bookName, language);
            }
        }
    } catch (error) {
        console.error(`Primary service (${primaryProvider}) failed:`, error);
        throw error;
    }
}