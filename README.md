# 党员、干部信息智能管理

基于 `Next.js App Router + Prisma + SQLite + Ant Design + Ant Design X` 的党群工作部业务应用，围绕党员、干部信息治理提供登录鉴权、台账管理、自动核验、重复清洗、完整性检查、动态提醒、用户管理、日志审计和系统设置能力。

## 启动方式

```bash
npm install
npm run db:init
npm run dev
```

演示账号：`admin / admin123`

## 内置模块

- `工作概览`：查看台账总量、差异项、质量问题和提醒任务总览
- `人员台账`：查看党员、干部主数据和组织分布
- `自动核验`：查看导入批次、字段差异和核验建议
- `重复清洗`：处理同音姓名、组织口径不一致等疑似重复问题
- `完整性检查`：查看必填项缺失、字段补全建议和缺失清单
- `动态提醒`：按状态变化、缺失补录、复核窗口推送提醒任务
- `用户管理 / 日志审计 / 系统设置`：统一治理基础能力

## 验证命令

```bash
npm run db:init
npm run typecheck
npm run lint
npm run build
npm run verify
```
