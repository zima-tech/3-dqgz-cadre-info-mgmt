import { BellOutlined, CheckCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag } from 'antd';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/ui/login-form';
import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-cover">
          <Tag color="blue" style={{ marginBottom: 18 }}>
            党群工作部
          </Tag>
          <h1 style={{ color: '#fff', marginTop: 0, marginBottom: 18, fontSize: 40, lineHeight: 1.2 }}>
            党员、干部信息智能管理
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.8 }}>
            面向党员和干部信息台账治理场景，覆盖自动核验、重复清洗、完整性检查和动态更新提醒的业务化工作台。
          </p>
          <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
            {[
              ['自动核验', '对接导入批次与存量台账，自动比对差异字段并形成核验清单。'],
              ['重复清洗', '识别姓名同音、身份证异常、组织关系重复等高风险重复数据。'],
              ['动态提醒', '围绕岗位变动、联系方式缺失、党籍状态变化等事项触发更新提醒。']
            ].map(([title, description]) => (
              <Col span={24} key={title}>
                <Card
                  style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' }}
                  bodyStyle={{ padding: 18 }}
                >
                  <Space align="start">
                    <CheckCircleOutlined style={{ color: '#d6ebff', marginTop: 3 }} />
                    <div>
                      <h3 style={{ color: '#fff', marginTop: 0, marginBottom: 8 }}>{title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.76)', marginBottom: 0, lineHeight: 1.7 }}>{description}</p>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          <Space size="large" style={{ marginTop: 32, color: 'rgba(255,255,255,0.82)' }}>
            <Space><SafetyOutlined /> 数据核验</Space>
            <Space><BellOutlined /> 智能提醒</Space>
          </Space>
        </div>
        <div className="login-form-panel">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
