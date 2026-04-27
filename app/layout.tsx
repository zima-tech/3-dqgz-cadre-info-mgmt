import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '党员、干部信息智能管理',
  description: '党群工作部党员、干部信息核验、清洗、完整性检查与动态提醒系统'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1358db',
                borderRadius: 12,
                colorBgLayout: '#eef3f8'
              }
            }}
          >
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
