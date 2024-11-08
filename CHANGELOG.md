# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.12.23] - 2024-03-XX

### Fixed
- 修复了摘要生成功能错误调用分析API的问题
- 修复了 fallbackService 中的服务选择逻辑
- 正确导入和使用 generateBookSummaryBackup 函数

### Changed
- 优化了服务调用逻辑，确保摘要和分析功能使用正确的API
- 完善了错误处理机制

## [0.11.21] - 2024-03-XX

### Added
- Added fallback service functionality for API calls
- Implemented automatic service switching when primary service fails
- Created new fallbackService.ts to handle service redundancy

### Changed
- Modified handleGenerateSummary and handleGenerateAnalysis to use fallback service
- Updated error handling to attempt fallback before showing error to user

### Improved
- Enhanced system reliability through service redundancy
- Better error handling and recovery mechanisms

## [0.8.17] - 2023-05-30

### Added
- New daily claim feature for usage points
- Added configuration for daily claim limits and amounts
- Added new buttons for claiming daily usage points
- Updated user interface to display remaining claims

### Changed
- Modified user data structure to include last claim date and remaining claims
- Updated database service to handle new claim-related operations
- Enhanced user service with new functions for claim operations

### Fixed
- Improved error handling for claim operations

## [0.7.16] - 2023-05-29

### Fixed
- Updated KIMI API endpoint to the correct URL in kimiService.ts
- Adjusted request payload format for KIMI API in kimiService.ts
- Improved error handling to capture and log more detailed error information

## [0.7.15] - 2023-05-28

### Fixed
- Corrected KIMI API endpoint and request format in kimiService.ts
- Improved error handling in kimiService.ts

### Changed
- Reverted changes to window.alert and window.prompt in App.tsx and AdminPanel.tsx

## [0.7.14] - 2023-05-28

### Added
- New "Book Analysis" feature using KIMI LLM
- Support for KIMI LLM API key in environment variables

### Changed
- Renamed button labels:
  - "Chinese Version" to "Summary (Chinese)"
  - "English Version" to "Summary (English)"
  - Added "Analysis (Chinese)" and "Analysis (English)" buttons

## [0.7.13] - 2023-05-27

### Changed
- Reverted Vite configuration changes to resolve deployment issues
- Updated version number to reflect latest changes
- Removed window. prefix from alert and prompt calls in App.tsx and AdminPanel.tsx

### Fixed
- Addressed deployment issues by simplifying Vite configuration

[... previous changelog entries ...]