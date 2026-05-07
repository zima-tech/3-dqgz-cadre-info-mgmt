import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function writeAuditLog(params: {
  module: string;
  action: string;
  objectType: string;
  objectId?: string;
  summary: string;
  result?: string;
  operator?: string;
}) {
  const currentUser = params.operator ? null : await getCurrentUser();

  await prisma.auditLog.create({
    data: {
      module: params.module,
      action: params.action,
      objectType: params.objectType,
      objectId: params.objectId,
      operator: params.operator || currentUser?.username || 'system',
      result: params.result || '成功',
      summary: params.summary
    }
  });
}

export async function getCadreSnapshot() {
  const [profiles, importBatches, importDiffs, issues, reminders, conversations, logs] = await Promise.all([
    prisma.cadreProfile.findMany({
      orderBy: [{ organization: 'asc' }, { name: 'asc' }],
      take: 80
    }),
    prisma.importBatch.findMany({
      orderBy: { importTime: 'desc' },
      take: 30
    }),
    prisma.importDiff.findMany({
      orderBy: { createdAt: 'desc' },
      take: 80,
      include: { batch: true }
    }),
    prisma.dataQualityIssue.findMany({
      orderBy: { createdAt: 'desc' },
      take: 80,
      include: {
        cadre: {
          select: {
            id: true,
            name: true,
            organization: true,
            duty: true
          }
        }
      }
    }),
    prisma.updateReminder.findMany({
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
      take: 80,
      include: {
        cadre: {
          select: {
            id: true,
            name: true,
            organization: true,
            duty: true
          }
        }
      }
    }),
    prisma.cadreConversation.findMany({
      orderBy: { createdAt: 'asc' },
      take: 80
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 12
    })
  ]);

  return {
    profiles,
    importBatches,
    importDiffs,
    issues,
    reminders,
    conversations,
    logs
  };
}
