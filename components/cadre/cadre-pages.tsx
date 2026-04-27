'use client';

import { Bubble, Conversations, Sender } from '@ant-design/x';
import { App, Button, Card, Col, List, Progress, Row, Space, Statistic, Table, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type ValueDate = string | Date | null;

type Profile = {
  id: string;
  name: string;
  gender: string;
  ethnicity: string;
  birthDate: ValueDate;
  politicalStatus: string;
  partyJoinDate: ValueDate;
  workStartDate: ValueDate;
  idNumber: string;
  mobile: string;
  organization: string;
  duty: string;
  positionLevel: string;
  education: string;
  cadreStatus: string;
  sourceVersion: string;
  updatedBy: string;
};

type ImportBatch = {
  id: string;
  batchName: string;
  sourceDept: string;
  importTime: ValueDate;
  importedCount: number;
  verifiedCount: number;
  diffCount: number;
  status: string;
  summary: string;
};

type ImportDiff = {
  id: string;
  cadreName: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  diffType: string;
  reviewStatus: string;
  suggestion: string;
  createdAt: ValueDate;
  batch?: { batchName: string } | null;
};

type Issue = {
  id: string;
  issueCategory: string;
  issueType: string;
  severity: string;
  fieldName: string | null;
  currentValue: string;
  suggestion: string;
  status: string;
  sourceStage: string;
  resolution: string;
  createdAt: ValueDate;
  cadre?: {
    id: string;
    name: string;
    organization: string;
    duty: string;
  } | null;
};

type Reminder = {
  id: string;
  reminderType: string;
  triggerEvent: string;
  reminderLevel: string;
  dueDate: ValueDate;
  status: string;
  summary: string;
  nextAction: string;
  cadre?: {
    id: string;
    name: string;
    organization: string;
    duty: string;
  } | null;
};

type Conversation = {
  id: string;
  scene: string;
  role: string;
  stage: string;
  content: string;
};

type AuditLog = {
  id: string;
  module: string;
  action: string;
  summary: string;
};

type Snapshot = {
  profiles: Profile[];
  importBatches: ImportBatch[];
  importDiffs: ImportDiff[];
  issues: Issue[];
  reminders: Reminder[];
  conversations: Conversation[];
  logs: AuditLog[];
};

function SectionHero({
  title,
  description,
  stats
}: {
  title: string;
  description: string;
  stats: Array<{ title: string; value: number | string; suffix?: string }>;
}) {
  return (
    <div className="page-stack">
      <div className="page-hero">
        <Typography.Title level={3} style={{ marginTop: 0 }}>
          {title}
        </Typography.Title>
        <Typography.Paragraph className="muted">{description}</Typography.Paragraph>
        <div className="summary-grid">
          {stats.map((item) => (
            <Card key={item.title} className="panel-card">
              <Statistic title={item.title} value={item.value} suffix={item.suffix} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function levelColor(level: string) {
  if (level === '高') return 'red';
  if (level === '中') return 'orange';
  return 'blue';
}

function statusColor(status: string) {
  if (status.includes('已')) return 'success';
  if (status.includes('待')) return 'warning';
  return 'processing';
}

function AIPanel({
  title,
  scene,
  conversations,
  placeholder
}: {
  title: string;
  scene: string;
  conversations: Conversation[];
  placeholder: string;
}) {
  const { message } = App.useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(conversations);

  const groupedItems = useMemo(
    () => [
      {
        key: scene,
        label: title,
        group: '当前场景'
      }
    ],
    [scene, title]
  );

  async function submitPrompt(value: string) {
    if (!value.trim()) return;

    setLoading(true);
    const response = await fetch('/api/cadre/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene, prompt: value })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      message.error(result.message || '会话生成失败。');
      return;
    }

    setItems(result.conversations);
    setInput('');
  }

  return (
    <Card className="panel-card" title={title} extra={<Tag color="processing">Ant Design X</Tag>}>
      <div className="panel-body" style={{ display: 'grid', gap: 16 }}>
        <Conversations items={groupedItems} activeKey={scene} />
        <Bubble.List
          items={items.map((item) => ({
            key: item.id,
            role: item.role === 'user' ? 'user' : 'assistant',
            content: `${item.stage ? `【${item.stage}】` : ''}${item.content}`
          }))}
          roles={{
            assistant: { placement: 'start' },
            user: { placement: 'end' }
          }}
          autoScroll
          style={{ maxHeight: 260, overflowY: 'auto' }}
        />
        <Sender value={input} onChange={setInput} onSubmit={submitPrompt} loading={loading} placeholder={placeholder} />
      </div>
    </Card>
  );
}

function IssueActionCard({ issue }: { issue: Issue }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(status: string, resolution: string) {
    setLoading(true);
    const response = await fetch('/api/cadre/issues/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: issue.id, status, resolution })
    });
    setLoading(false);

    if (!response.ok) {
      message.error('问题状态更新失败。');
      return;
    }

    message.success('问题状态已更新。');
    router.refresh();
  }

  return (
    <Space>
      <Button size="small" loading={loading} onClick={() => update('处理中', issue.resolution || '已进入人工复核。')}>
        转处理中
      </Button>
      <Button size="small" type="primary" loading={loading} onClick={() => update('已完成', issue.resolution || '已完成处理并留痕。')}>
        标记完成
      </Button>
    </Space>
  );
}

function ReminderActionCard({ reminder }: { reminder: Reminder }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(status: string, nextAction: string) {
    setLoading(true);
    const response = await fetch('/api/cadre/reminders/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: reminder.id, status, nextAction })
    });
    setLoading(false);

    if (!response.ok) {
      message.error('提醒状态更新失败。');
      return;
    }

    message.success('提醒状态已更新。');
    router.refresh();
  }

  return (
    <Space>
      <Button size="small" loading={loading} onClick={() => update('处理中', reminder.nextAction || '已通知相关单位处理。')}>
        转处理中
      </Button>
      <Button size="small" type="primary" loading={loading} onClick={() => update('已完成', reminder.nextAction || '已完成反馈确认。')}>
        标记完成
      </Button>
    </Space>
  );
}

export function DashboardPage({ snapshot }: { snapshot: Snapshot }) {
  const pendingIssues = snapshot.issues.filter((item) => !item.status.includes('已'));
  const pendingReminders = snapshot.reminders.filter((item) => !item.status.includes('已'));
  const latestBatch = snapshot.importBatches[0];
  const organizationCount = new Set(snapshot.profiles.map((item) => item.organization)).size;

  return (
    <div className="page-stack">
      <SectionHero
        title="工作概览"
        description="集中展示党员、干部主数据规模、导入核验进度、数据质量问题和动态提醒待办。"
        stats={[
          { title: '干部台账', value: snapshot.profiles.length, suffix: '人' },
          { title: '覆盖组织', value: organizationCount, suffix: '个' },
          { title: '待处理问题', value: pendingIssues.length, suffix: '项' },
          { title: '待办提醒', value: pendingReminders.length, suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <div className="page-stack">
            <Card className="panel-card" title="当前治理重点">
              <List
                dataSource={pendingIssues.slice(0, 6)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${item.cadre?.name || '公共台账'}｜${item.issueType}`}
                      description={`${item.issueCategory}｜${item.suggestion}`}
                    />
                    <Tag color={levelColor(item.severity)}>{item.severity}</Tag>
                  </List.Item>
                )}
              />
            </Card>
            <Card className="panel-card" title="最近导入批次">
              <div className="panel-body">
                <Typography.Paragraph style={{ marginBottom: 10 }}>
                  {latestBatch?.batchName || '暂无批次'}：{latestBatch?.summary || '暂无导入说明'}
                </Typography.Paragraph>
                <Progress percent={latestBatch ? Math.round((latestBatch.verifiedCount / Math.max(latestBatch.importedCount, 1)) * 100) : 0} />
                <Space wrap style={{ marginTop: 16 }}>
                  <Tag color="blue">导入 {latestBatch?.importedCount || 0} 人</Tag>
                  <Tag color="green">已核验 {latestBatch?.verifiedCount || 0} 人</Tag>
                  <Tag color="orange">差异 {latestBatch?.diffCount || 0} 项</Tag>
                </Space>
              </div>
            </Card>
          </div>
        </Col>
        <Col xs={24} xl={8}>
          <div className="page-stack">
            <AIPanel
              title="治理助手"
              scene="工作概览"
              conversations={snapshot.conversations.filter((item) => item.scene === '工作概览')}
              placeholder="追问差异收敛策略、补录计划或提醒分级方案"
            />
            <Card className="panel-card" title="近期留痕">
              <Timeline items={snapshot.logs.map((item) => ({ children: `${item.module}｜${item.action}｜${item.summary}` }))} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function ProfilesPage({ profiles }: { profiles: Profile[] }) {
  const organizationCount = new Set(profiles.map((item) => item.organization)).size;
  const partyMemberCount = profiles.filter((item) => item.politicalStatus.includes('党员')).length;

  return (
    <div className="page-stack">
      <SectionHero
        title="人员台账"
        description="统一查看党员、干部基础信息、组织关系、任职情况、联系方式和数据版本。"
        stats={[
          { title: '台账人数', value: profiles.length, suffix: '人' },
          { title: '党员人数', value: partyMemberCount, suffix: '人' },
          { title: '组织数量', value: organizationCount, suffix: '个' },
          { title: '缺联系方式', value: profiles.filter((item) => !item.mobile).length, suffix: '人' }
        ]}
      />
      <Card className="panel-card" title="主数据明细">
        <Table
          rowKey="id"
          dataSource={profiles}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
          columns={[
            { title: '姓名', dataIndex: 'name', fixed: 'left', width: 100 },
            { title: '组织', dataIndex: 'organization', width: 160 },
            { title: '职务', dataIndex: 'duty', width: 160 },
            { title: '职级', dataIndex: 'positionLevel', width: 120 },
            { title: '政治面貌', dataIndex: 'politicalStatus', width: 120 },
            { title: '学历', dataIndex: 'education', width: 100, render: (value: string) => value || <Tag color="orange">待补充</Tag> },
            { title: '联系方式', dataIndex: 'mobile', width: 140, render: (value: string) => value || <Tag color="red">缺失</Tag> },
            { title: '身份证号', dataIndex: 'idNumber', width: 190 },
            { title: '状态', dataIndex: 'cadreStatus', width: 100, render: (value: string) => <Tag color={value === '在岗' ? 'green' : 'blue'}>{value}</Tag> },
            { title: '版本', dataIndex: 'sourceVersion', width: 100 },
            { title: '维护人', dataIndex: 'updatedBy', width: 120 }
          ]}
        />
      </Card>
    </div>
  );
}

export function VerificationPage({ snapshot }: { snapshot: Snapshot }) {
  const verificationIssues = snapshot.issues.filter((item) => item.issueCategory === '自动核验');

  return (
    <div className="page-stack">
      <SectionHero
        title="自动核验"
        description="查看导入批次、字段差异和核验建议，支撑新增信息与存量台账自动比对。"
        stats={[
          { title: '导入批次', value: snapshot.importBatches.length, suffix: '个' },
          { title: '差异字段', value: snapshot.importDiffs.length, suffix: '项' },
          { title: '待复核问题', value: verificationIssues.filter((item) => item.status !== '已完成').length, suffix: '项' },
          { title: '最新批次', value: snapshot.importBatches[0]?.sourceDept || '-' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={15}>
          <div className="page-stack">
            <Card className="panel-card" title="导入批次">
              <Table
                rowKey="id"
                dataSource={snapshot.importBatches}
                pagination={false}
                columns={[
                  { title: '批次名称', dataIndex: 'batchName' },
                  { title: '来源单位', dataIndex: 'sourceDept' },
                  { title: '导入时间', dataIndex: 'importTime', render: (value: ValueDate) => dayjs(value).format('YYYY-MM-DD HH:mm') },
                  { title: '导入人数', dataIndex: 'importedCount' },
                  { title: '已核验', dataIndex: 'verifiedCount' },
                  { title: '差异项', dataIndex: 'diffCount' },
                  { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> }
                ]}
              />
            </Card>
            <Card className="panel-card" title="字段差异清单">
              <Table
                rowKey="id"
                dataSource={snapshot.importDiffs}
                pagination={{ pageSize: 8 }}
                columns={[
                  { title: '人员', dataIndex: 'cadreName' },
                  { title: '批次', render: (_: unknown, item: ImportDiff) => item.batch?.batchName || '-' },
                  { title: '字段', dataIndex: 'fieldName' },
                  { title: '旧值', dataIndex: 'oldValue' },
                  { title: '新值', dataIndex: 'newValue' },
                  { title: '差异类型', dataIndex: 'diffType' },
                  { title: '处理状态', dataIndex: 'reviewStatus', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> }
                ]}
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} xl={9}>
          <div className="page-stack">
            <AIPanel
              title="核验建议助手"
              scene="自动核验"
              conversations={snapshot.conversations.filter((item) => item.scene === '自动核验')}
              placeholder="追问批次比对规则、差异处置顺序或口径统一方式"
            />
            <Card className="panel-card" title="重点核验问题">
              <List
                dataSource={verificationIssues}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={`${item.cadre?.name || '-'}｜${item.issueType}`} description={item.suggestion} />
                    <Tag color={levelColor(item.severity)}>{item.severity}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function DeduplicationPage({ snapshot }: { snapshot: Snapshot }) {
  const duplicateIssues = snapshot.issues.filter((item) => item.issueCategory === '重复清洗');

  return (
    <div className="page-stack">
      <SectionHero
        title="重复清洗"
        description="识别疑似重复人员、组织口径冲突和同音姓名问题，并支持人工复核留痕。"
        stats={[
          { title: '疑似重复', value: duplicateIssues.length, suffix: '项' },
          { title: '待研判', value: duplicateIssues.filter((item) => item.status.includes('待')).length, suffix: '项' },
          { title: '处理中', value: duplicateIssues.filter((item) => item.status.includes('处理')).length, suffix: '项' },
          { title: '高风险', value: duplicateIssues.filter((item) => item.severity === '高').length, suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="重复清洗清单">
            <Table
              rowKey="id"
              dataSource={duplicateIssues}
              pagination={{ pageSize: 8 }}
              columns={[
                { title: '人员', render: (_: unknown, item: Issue) => item.cadre?.name || '公共问题' },
                { title: '组织', render: (_: unknown, item: Issue) => item.cadre?.organization || '-' },
                { title: '问题类型', dataIndex: 'issueType' },
                { title: '当前值', dataIndex: 'currentValue' },
                { title: '来源阶段', dataIndex: 'sourceStage' },
                { title: '等级', dataIndex: 'severity', render: (value: string) => <Tag color={levelColor(value)}>{value}</Tag> },
                { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> },
                { title: '操作', render: (_: unknown, item: Issue) => <IssueActionCard issue={item} /> }
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <div className="page-stack">
            <AIPanel
              title="清洗策略助手"
              scene="重复清洗"
              conversations={snapshot.conversations.filter((item) => item.scene === '重复清洗')}
              placeholder="追问同音姓名合并规则、主记录保留原则或人工复核顺序"
            />
            <Card className="panel-card" title="处理建议">
              <List
                dataSource={duplicateIssues}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.issueType} description={item.suggestion} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function CompletenessPage({ snapshot }: { snapshot: Snapshot }) {
  const completenessIssues = snapshot.issues.filter((item) => item.issueCategory === '完整性检查');
  const missingByField = completenessIssues.reduce<Record<string, number>>((acc, item) => {
    const key = item.fieldName || '其他';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-stack">
      <SectionHero
        title="完整性检查"
        description="按必填字段规则扫描党员、干部主数据，输出缺失项清单与补录建议。"
        stats={[
          { title: '缺失问题', value: completenessIssues.length, suffix: '项' },
          { title: '高等级缺失', value: completenessIssues.filter((item) => item.severity === '高').length, suffix: '项' },
          { title: '字段类型', value: Object.keys(missingByField).length, suffix: '类' },
          { title: '缺失最多字段', value: Object.entries(missingByField).sort((a, b) => b[1] - a[1])[0]?.[0] || '-' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={15}>
          <Card className="panel-card" title="缺失字段清单">
            <Table
              rowKey="id"
              dataSource={completenessIssues}
              pagination={{ pageSize: 8 }}
              columns={[
                { title: '人员', render: (_: unknown, item: Issue) => item.cadre?.name || '公共问题' },
                { title: '组织', render: (_: unknown, item: Issue) => item.cadre?.organization || '-' },
                { title: '字段', dataIndex: 'fieldName' },
                { title: '问题类型', dataIndex: 'issueType' },
                { title: '当前值', dataIndex: 'currentValue' },
                { title: '建议', dataIndex: 'suggestion' },
                { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> },
                { title: '操作', render: (_: unknown, item: Issue) => <IssueActionCard issue={item} /> }
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <div className="page-stack">
            <AIPanel
              title="补录助手"
              scene="完整性检查"
              conversations={snapshot.conversations.filter((item) => item.scene === '完整性检查')}
              placeholder="追问补录优先级、字段清单分发方案或缺失闭环方法"
            />
            <Card className="panel-card" title="字段缺失分布">
              <List
                dataSource={Object.entries(missingByField)}
                renderItem={([field, count]) => (
                  <List.Item>
                    <List.Item.Meta title={field} description={`缺失 ${count} 项`} />
                    <Progress percent={Math.min(100, count * 20)} showInfo={false} style={{ width: 120 }} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function RemindersPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="动态提醒"
        description="围绕岗位变动、状态变化、材料补录和周期复核自动生成提醒任务并跟踪处理进度。"
        stats={[
          { title: '提醒任务', value: snapshot.reminders.length, suffix: '项' },
          { title: '待发送', value: snapshot.reminders.filter((item) => item.status === '待发送').length, suffix: '项' },
          { title: '处理中', value: snapshot.reminders.filter((item) => item.status === '处理中').length, suffix: '项' },
          { title: '高等级', value: snapshot.reminders.filter((item) => item.reminderLevel === '高').length, suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={15}>
          <div className="page-stack">
            <Card className="panel-card" title="提醒任务清单">
              <Table
                rowKey="id"
                dataSource={snapshot.reminders}
                pagination={{ pageSize: 8 }}
                columns={[
                  { title: '人员', render: (_: unknown, item: Reminder) => item.cadre?.name || '公共提醒' },
                  { title: '提醒类型', dataIndex: 'reminderType' },
                  { title: '触发事件', dataIndex: 'triggerEvent' },
                  { title: '到期时间', dataIndex: 'dueDate', render: (value: ValueDate) => dayjs(value).format('MM-DD HH:mm') },
                  { title: '等级', dataIndex: 'reminderLevel', render: (value: string) => <Tag color={levelColor(value)}>{value}</Tag> },
                  { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> },
                  { title: '操作', render: (_: unknown, item: Reminder) => <ReminderActionCard reminder={item} /> }
                ]}
              />
            </Card>
            <Card className="panel-card" title="提醒时间线">
              <Timeline
                items={snapshot.reminders.map((item) => ({
                  color: item.reminderLevel === '高' ? 'red' : item.reminderLevel === '中' ? 'blue' : 'gray',
                  children: `${dayjs(item.dueDate).format('MM-DD HH:mm')}｜${item.summary}`
                }))}
              />
            </Card>
          </div>
        </Col>
        <Col xs={24} xl={9}>
          <div className="page-stack">
            <AIPanel
              title="提醒编排助手"
              scene="动态提醒"
              conversations={snapshot.conversations.filter((item) => item.scene === '动态提醒')}
              placeholder="追问提醒升级规则、催办节奏或月度复核安排"
            />
            <Card className="panel-card" title="下一步动作">
              <List
                dataSource={snapshot.reminders}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta title={item.summary} description={item.nextAction} />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
