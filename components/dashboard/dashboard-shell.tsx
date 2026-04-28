'use client';

import { AuditOutlined, BellOutlined, CheckSquareOutlined, DashboardOutlined, DiffOutlined, LogoutOutlined, SettingOutlined, TableOutlined, TeamOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const items: NonNullable<MenuProps['items']> = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '工作概览' },
  { key: '/profiles', icon: <TableOutlined />, label: '人员台账' },
  { key: '/verification', icon: <CheckSquareOutlined />, label: '自动核验' },
  { key: '/deduplication', icon: <DiffOutlined />, label: '重复清洗' },
  { key: '/completeness', icon: <TeamOutlined />, label: '完整性检查' },
  { key: '/reminders', icon: <BellOutlined />, label: '动态提醒' },
  { type: 'divider' },
  { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
  { key: '/audit-logs', icon: <AuditOutlined />, label: '日志审计' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' }
];

const adminOnlyKeys = new Set(['/users', '/audit-logs', '/settings']);

export function DashboardShell({
  children,
  title,
  description,
  currentUser
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  currentUser: {
    username: string;
    name: string;
    role: string;
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { message } = App.useApp();

  const visibleItems =
    currentUser.role === '管理员'
      ? items
      : items.filter((item) => {
          if (!item) {
            return false;
          }

          if ('type' in item && item.type === 'divider') {
            return false;
          }

          return !('key' in item) || !adminOnlyKeys.has(String(item.key));
        });

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    message.success('已退出当前系统。');
    router.push('/login');
    router.refresh();
  }

  return (
    <Layout className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <Tag color="blue" style={{ marginBottom: 12 }}>
            党群工作部
          </Tag>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            党员、干部信息智能管理
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.72)', marginTop: 12, marginBottom: 0 }}>
            围绕党员、干部信息治理形成“核验、清洗、补全、提醒、留痕”一体化业务台。
          </Typography.Paragraph>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname || '/dashboard']}
          items={visibleItems}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
          onClick={({ key }) => router.push(key)}
        />
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {title}
            </Typography.Title>
            <Typography.Text className="muted">{description}</Typography.Text>
          </div>
          <Space>
            <Tag color="processing">{currentUser.role}</Tag>
            <Tag>{currentUser.username}</Tag>
            <Avatar style={{ backgroundColor: '#1358db' }}>{currentUser.name.slice(0, 1)}</Avatar>
            <Button icon={<LogoutOutlined />} onClick={logout} loading={loggingOut}>
              退出登录
            </Button>
          </Space>
        </header>
        <main className="dashboard-main">{children}</main>
      </section>
    </Layout>
  );
}
