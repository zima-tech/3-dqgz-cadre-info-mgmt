import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/services';

export async function POST(request: Request) {
  const payload = await request.json();

  const reminder = await prisma.updateReminder.update({
    where: { id: payload.id },
    data: {
      status: payload.status,
      nextAction: payload.nextAction
    }
  });

  await writeAuditLog({
    module: '动态提醒',
    action: '更新提醒状态',
    objectType: '提醒任务',
    objectId: reminder.id,
    summary: `${reminder.reminderType}已更新为${reminder.status}。`
  });

  return NextResponse.json({ success: true });
}
