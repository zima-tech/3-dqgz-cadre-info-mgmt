import { BellOutlined, CheckCircleOutlined, DatabaseOutlined, SafetyOutlined, TeamOutlined, WarningOutlined } from '@ant-design/icons';
import { Space, Tag } from 'antd';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/ui/login-form';
import { LoginTrail } from '@/components/ui/login-trail';
import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="login-screen">
      <LoginTrail />
      <div className="login-card">
        <div className="login-cover">
          <div className="login-cover-topline">
            <Tag color="blue">党群工作部</Tag>
            <span>Cadre Data Governance</span>
          </div>
          <h1>党员、干部信息智能管理</h1>
          <p>面向党员和干部信息台账治理，覆盖导入核验、重复清洗、完整性检查、变动提醒与管理留痕。</p>
          <div className="login-metric-grid">
            <div><strong>80</strong><span>条台账快照上限</span></div>
            <div><strong>NLP</strong><span>同音异字与异常识别</span></div>
            <div><strong>闭环</strong><span>核验、提醒、复核留痕</span></div>
          </div>
          <div className="login-capability-list">
            {[
              [<DatabaseOutlined key="verify" />, '信息自动核验', '导入批次与存量台账自动比对，标记身份证、组织、联系方式等差异项。'],
              [<SafetyOutlined key="clean" />, '重复数据清理', '识别姓名同音不同字、证件号异常、组织关系重复等高风险问题。'],
              [<BellOutlined key="remind" />, '动态更新提醒', '围绕信息缺失、状态变动和待复核事项生成提醒清单。']
            ].map(([icon, title, description]) => (
              <div className="login-capability" key={String(title)}>
                <span>{icon}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
                <CheckCircleOutlined />
              </div>
            ))}
          </div>
          <Space className="login-cover-footer" size="large">
            <Space><TeamOutlined /> 人员台账</Space>
            <Space><WarningOutlined /> 差异预警</Space>
          </Space>
        </div>
        <div className="login-form-panel">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
