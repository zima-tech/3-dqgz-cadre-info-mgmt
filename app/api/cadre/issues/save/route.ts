import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/services';

export async function POST(request: Request) {
  const payload = await request.json();

  const issue = await prisma.dataQualityIssue.update({
    where: { id: payload.id },
    data: {
      status: payload.status,
      resolution: payload.resolution || ''
    }
  });

  await writeAuditLog({
    module: issue.issueCategory,
    action: '更新问题状态',
    objectType: '数据质量问题',
    objectId: issue.id,
    summary: `${issue.issueType}状态已更新为${issue.status}。`
  });

  return NextResponse.json({ success: true });
}
