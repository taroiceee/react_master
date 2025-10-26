import { rest } from 'msw';
import dashboardApiData from './api/chartdata.jsonc';

// 工具函数：替换数据中的动态文本（如 {{startDate}}）
const replaceDynamicText = (data, params) => {
    const str = JSON.stringify(data);
    // 替换所有 {{key}} 为参数值
    return JSON.parse(
        str.replace(/{{(\w+)}}/g, (match, key) => params[key] || '')
    );
};

export const handlers = [
    // 后台看板图表数据接口
    rest.get('/api/dashboard/chart', async (req, res, ctx) => {
        // 1. 获取所有查询参数
        const params = {
            chartType: req.url.searchParams.get('chartType'),
            startDate: req.url.searchParams.get('startDate'),
            endDate: req.url.searchParams.get('endDate'),
            dimension: req.url.searchParams.get('dimension') || 'day',
            userLevel: req.url.searchParams.get('userLevel') || 'all',
            terminal: req.url.searchParams.get('terminal') || 'all'
        };

        // 2. 参数校验（模拟真实后端校验逻辑）
        // 校验必传参数
        if (!params.chartType || !params.startDate || !params.endDate) {
            return res(ctx.status(400), ctx.json(dashboardApiData.error_paramMissing));
        }
        // 校验日期格式（简单正则）
        const dateReg = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateReg.test(params.startDate) || !dateReg.test(params.endDate)) {
            return res(ctx.status(400), ctx.json(dashboardApiData.error_paramFormat));
        }
        // 校验开始日期 <= 结束日期
        if (new Date(params.startDate) > new Date(params.endDate)) {
            return res(
                ctx.status(400),
                ctx.json({
                    code: 400,
                    message: "startDate 不能晚于 endDate",
                    requestId: "req-err-20251025-004"
                })
            );
        }

        // 3. 根据 chartType 匹配对应 Mock 数据
        let mockDataKey;
        switch (params.chartType) {
            case 'pie_role':
                mockDataKey = 'pie_roleDistribution_normal';
                break;
            case 'bar_department':
                mockDataKey = 'bar_departmentOrder_normal';
                break;
            case 'column_active':
                mockDataKey = 'column_activeUser_normal';
                break;
            case 'line_visit':
                mockDataKey = 'line_visitTrend_normal';
                break;
            default:
                // 未知图表类型返回无数据
                mockDataKey = 'error_dataEmpty';
        }

        // 4. 模拟“数据不存在”场景（如时间范围过大）
        const dateDiff = (new Date(params.endDate) - new Date(params.startDate)) / (1000 * 60 * 60 * 24);
        if (dateDiff > 365) { // 超过1年返回无数据
            mockDataKey = 'error_dataEmpty';
        }

        // 5. 替换数据中的动态文本（如 {{startDate}} → 实际参数值）
        const responseData = replaceDynamicText(dashboardApiData[mockDataKey], params);

        // 6. 返回数据（模拟网络延迟）
        return res(
            ctx.delay(300 + Math.random() * 200), // 300-500ms 随机延迟，更真实
            ctx.json(responseData)
        );
    })
];