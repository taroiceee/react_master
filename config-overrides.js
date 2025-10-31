// 项目根目录/config-overrides.js
const { override, adjustStyleLoaders } = require('customize-cra');

module.exports = override(
    adjustStyleLoaders((loaders) => {
        // 关键：先判断 loaders.sass 是否存在，避免 undefined 错误
        if (loaders.sass) {
            // 合并原有 options，添加警告屏蔽配置
            loaders.sass.options = {
                ...(loaders.sass.options || {}), // 保留原有配置（如果有）
                warningSuppression: true, // 屏蔽所有 Sass 警告
            };
        }
        // 同理，判断 loaders.scss（处理 .scss 文件）
        if (loaders.scss) {
            loaders.scss.options = {
                ...(loaders.scss.options || {}),
                warningSuppression: true,
            };
        }
        return loaders; // 必须返回修改后的 loaders
    })
);