import fs from 'node:fs';

const requiredPaths = [
  'app/layout.tsx',
  'app/login/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/profiles/page.tsx',
  'app/(dashboard)/verification/page.tsx',
  'app/(dashboard)/deduplication/page.tsx',
  'app/(dashboard)/completeness/page.tsx',
  'app/(dashboard)/reminders/page.tsx',
  'app/(dashboard)/users/page.tsx',
  'app/(dashboard)/audit-logs/page.tsx',
  'app/(dashboard)/settings/page.tsx',
  'app/api/cadre/chat/route.ts',
  'app/api/cadre/issues/save/route.ts',
  'app/api/cadre/reminders/save/route.ts',
  'components/cadre/cadre-pages.tsx',
  'prisma/schema.prisma',
  'prisma/seed.ts'
];

const missing = requiredPaths.filter((path) => !fs.existsSync(path));

if (missing.length > 0) {
  console.error('结构校验失败，缺少以下关键文件：');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('结构校验通过。');
