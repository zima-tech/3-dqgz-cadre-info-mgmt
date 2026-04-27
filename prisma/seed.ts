import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.cadreConversation.deleteMany();
  await prisma.updateReminder.deleteMany();
  await prisma.dataQualityIssue.deleteMany();
  await prisma.importDiff.deleteMany();
  await prisma.importBatch.deleteMany();
  await prisma.cadreProfile.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123',
      name: '系统管理员',
      department: '党群工作部',
      role: '管理员',
      status: '启用'
    }
  });

  await prisma.systemSetting.createMany({
    data: [
      {
        groupName: '核验规则',
        key: 'cadre.verify.primaryKeys',
        value: '姓名+身份证号+组织关系',
        type: 'string',
        description: '导入批次自动核验的主比对字段'
      },
      {
        groupName: '完整性规则',
        key: 'cadre.completeness.requiredFields',
        value: '姓名,身份证号,组织关系,职务,学历,联系方式,党籍状态',
        type: 'string',
        description: '干部信息必填字段范围'
      },
      {
        groupName: '提醒策略',
        key: 'cadre.reminder.escalationDays',
        value: '3',
        type: 'number',
        description: '提醒事项逾期升级阈值（天）'
      },
      {
        groupName: 'AI 服务',
        key: 'ai.localFallback',
        value: '启用',
        type: 'string',
        description: '当外部模型不可用时启用本地核验建议与提醒建议'
      }
    ]
  });

  const profileSeeds: Array<{
    name: string;
    gender: string;
    ethnicity: string;
    birthDate: string | null;
    politicalStatus: string;
    partyJoinDate: string | null;
    workStartDate: string | null;
    idNumber: string;
    mobile: string;
    organization: string;
    duty: string;
    positionLevel: string;
    education: string;
    cadreStatus: string;
    sourceVersion: string;
    updatedBy: string;
  }> = [
    { name: '张建国', gender: '男', ethnicity: '汉族', birthDate: '1984-05-12', politicalStatus: '中共党员', partyJoinDate: '2008-06-18', workStartDate: '2006-07-01', idNumber: '310101198405120011', mobile: '13810010011', organization: '党群工作部', duty: '部长', positionLevel: '中层正职', education: '研究生', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '李晓静', gender: '女', ethnicity: '汉族', birthDate: '1988-09-21', politicalStatus: '中共党员', partyJoinDate: '2011-07-01', workStartDate: '2010-08-15', idNumber: '310101198809210022', mobile: '13810010022', organization: '党群工作部', duty: '组织干事', positionLevel: '主管', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '王立新', gender: '男', ethnicity: '回族', birthDate: '1979-03-06', politicalStatus: '中共党员', partyJoinDate: '2003-05-16', workStartDate: '2001-07-10', idNumber: '310101197903060033', mobile: '13810010033', organization: '工程建设部', duty: '副部长', positionLevel: '中层副职', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '周敏', gender: '女', ethnicity: '汉族', birthDate: '1990-12-01', politicalStatus: '中共党员', partyJoinDate: '2013-06-28', workStartDate: '2012-07-20', idNumber: '310101199012010044', mobile: '13810010044', organization: '后勤分公司', duty: '综合主管', positionLevel: '主管', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '陈志远', gender: '男', ethnicity: '汉族', birthDate: '1986-08-09', politicalStatus: '群众', partyJoinDate: null, workStartDate: '2008-07-01', idNumber: '310101198608090055', mobile: '', organization: '办公室', duty: '综合文字岗', positionLevel: '一般员工', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '赵宁', gender: '女', ethnicity: '满族', birthDate: '1992-02-14', politicalStatus: '中共预备党员', partyJoinDate: '2025-11-12', workStartDate: '2016-07-01', idNumber: '310101199202140066', mobile: '13810010066', organization: '工程建设部', duty: '项目综合岗', positionLevel: '一般员工', education: '', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '孙海涛', gender: '男', ethnicity: '汉族', birthDate: '1983-11-22', politicalStatus: '中共党员', partyJoinDate: '2009-07-01', workStartDate: '2005-09-01', idNumber: '310101198311220077', mobile: '13810010077', organization: '资产运营部', duty: '招商主管', positionLevel: '主管', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '刘芳', gender: '女', ethnicity: '汉族', birthDate: '1987-07-30', politicalStatus: '中共党员', partyJoinDate: '2010-06-25', workStartDate: '2009-07-01', idNumber: '310101198707300088', mobile: '13810010088', organization: '纪检审计部', duty: '纪检专员', positionLevel: '主管', education: '研究生', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '吴志强', gender: '男', ethnicity: '汉族', birthDate: '1978-01-18', politicalStatus: '中共党员', partyJoinDate: '2001-06-16', workStartDate: '1999-07-01', idNumber: '310101197801180099', mobile: '13810010099', organization: '后勤分公司', duty: '党支部书记', positionLevel: '中层正职', education: '本科', cadreStatus: '挂职', sourceVersion: 'v2026.04', updatedBy: '组织管理员' },
    { name: '郑雪', gender: '女', ethnicity: '土家族', birthDate: '1994-10-05', politicalStatus: '群众', partyJoinDate: null, workStartDate: '2018-07-01', idNumber: '310101199410050010', mobile: '13810010010', organization: '办公室', duty: '行政支持岗', positionLevel: '一般员工', education: '本科', cadreStatus: '在岗', sourceVersion: 'v2026.04', updatedBy: '组织管理员' }
  ];

  const profiles = await Promise.all(
    profileSeeds.map((item) =>
      prisma.cadreProfile.create({
        data: {
          name: item.name,
          gender: item.gender,
          ethnicity: item.ethnicity,
          birthDate: item.birthDate ? new Date(item.birthDate) : null,
          politicalStatus: item.politicalStatus,
          partyJoinDate: item.partyJoinDate ? new Date(item.partyJoinDate) : null,
          workStartDate: item.workStartDate ? new Date(item.workStartDate) : null,
          idNumber: item.idNumber,
          mobile: item.mobile,
          organization: item.organization,
          duty: item.duty,
          positionLevel: item.positionLevel,
          education: item.education,
          cadreStatus: item.cadreStatus,
          sourceVersion: item.sourceVersion,
          updatedBy: item.updatedBy
        }
      })
    )
  );

  const batchSeeds: Array<{
    batchName: string;
    sourceDept: string;
    importTime: string;
    importedCount: number;
    verifiedCount: number;
    diffCount: number;
    status: string;
    summary: string;
  }> = [
    { batchName: '2026年4月干部台账导入', sourceDept: '党群工作部', importTime: '2026-04-24T09:30:00', importedCount: 42, verifiedCount: 31, diffCount: 11, status: '待复核', summary: '已完成首轮字段比对，存在任职、联系方式、学历等差异项。' },
    { batchName: '工程建设部干部信息补录', sourceDept: '工程建设部', importTime: '2026-04-22T15:10:00', importedCount: 16, verifiedCount: 13, diffCount: 3, status: '处理中', summary: '工程建设部补录数据已与存量库比对，发现岗位名称不统一问题。' },
    { batchName: '后勤分公司党员信息更新', sourceDept: '后勤分公司', importTime: '2026-04-20T10:00:00', importedCount: 28, verifiedCount: 28, diffCount: 0, status: '已完成', summary: '党员发展状态和联系方式已同步完成。' }
  ];

  const batches = await Promise.all(
    batchSeeds.map((item) =>
      prisma.importBatch.create({
        data: {
          batchName: item.batchName,
          sourceDept: item.sourceDept,
          importTime: new Date(item.importTime),
          importedCount: item.importedCount,
          verifiedCount: item.verifiedCount,
          diffCount: item.diffCount,
          status: item.status,
          summary: item.summary
        }
      })
    )
  );

  await prisma.importDiff.createMany({
    data: [
      {
        batchId: batches[0].id,
        cadreName: '王立新',
        fieldName: '职务',
        oldValue: '副部长',
        newValue: '副部长（主持工作）',
        diffType: '岗位差异',
        reviewStatus: '待确认',
        suggestion: '建议核对最新任命文件后更新主记录。'
      },
      {
        batchId: batches[0].id,
        cadreName: '陈志远',
        fieldName: '联系方式',
        oldValue: '',
        newValue: '13810019999',
        diffType: '缺失补录',
        reviewStatus: '待确认',
        suggestion: '建议电话回访确认后写入正式台账。'
      },
      {
        batchId: batches[0].id,
        cadreName: '赵宁',
        fieldName: '学历',
        oldValue: '',
        newValue: '硕士研究生',
        diffType: '字段补全',
        reviewStatus: '处理中',
        suggestion: '建议补充学历证明后更新。'
      },
      {
        batchId: batches[1].id,
        cadreName: '周敏',
        fieldName: '组织关系',
        oldValue: '后勤分公司',
        newValue: '后勤分公司党委',
        diffType: '组织口径差异',
        reviewStatus: '待确认',
        suggestion: '建议统一组织名称口径并同步至全量主数据。'
      },
      {
        batchId: batches[1].id,
        cadreName: '吴志强',
        fieldName: '干部状态',
        oldValue: '在岗',
        newValue: '挂职',
        diffType: '状态变动',
        reviewStatus: '已确认',
        suggestion: '已按组织任命材料更新。'
      }
    ]
  });

  await prisma.dataQualityIssue.createMany({
    data: [
      {
        cadreId: profiles[4].id,
        issueCategory: '完整性检查',
        issueType: '联系方式缺失',
        severity: '高',
        fieldName: 'mobile',
        currentValue: '空值',
        suggestion: '尽快补录本人手机号并回填更新时间。',
        status: '待处理',
        sourceStage: '必填项扫描',
        resolution: ''
      },
      {
        cadreId: profiles[5].id,
        issueCategory: '完整性检查',
        issueType: '学历缺失',
        severity: '中',
        fieldName: 'education',
        currentValue: '空值',
        suggestion: '补充学历层次和毕业院校佐证。',
        status: '待处理',
        sourceStage: '字段完整性校验',
        resolution: ''
      },
      {
        cadreId: profiles[1].id,
        issueCategory: '重复清洗',
        issueType: '姓名同音疑似重复',
        severity: '中',
        fieldName: 'name',
        currentValue: '李晓静 / 李小静',
        suggestion: '结合身份证号和组织关系人工确认是否为同一人。',
        status: '待研判',
        sourceStage: 'NLP 同音识别',
        resolution: ''
      },
      {
        cadreId: profiles[2].id,
        issueCategory: '自动核验',
        issueType: '岗位名称差异',
        severity: '中',
        fieldName: 'duty',
        currentValue: '副部长 / 副部长（主持工作）',
        suggestion: '根据最新任命文件统一岗位名称。',
        status: '待复核',
        sourceStage: '导入比对',
        resolution: ''
      },
      {
        cadreId: profiles[8].id,
        issueCategory: '动态提醒',
        issueType: '干部状态变化待确认',
        severity: '高',
        fieldName: 'cadreStatus',
        currentValue: '挂职',
        suggestion: '确认挂职期限和组织关系去向后更新。',
        status: '待提醒',
        sourceStage: '状态变动监测',
        resolution: ''
      },
      {
        cadreId: profiles[3].id,
        issueCategory: '重复清洗',
        issueType: '组织关系表述重复',
        severity: '低',
        fieldName: 'organization',
        currentValue: '后勤分公司 / 后勤分公司党委',
        suggestion: '保留标准组织名称并清理别名。',
        status: '处理中',
        sourceStage: '文本归一化',
        resolution: '已纳入口径统一清单。'
      }
    ]
  });

  await prisma.updateReminder.createMany({
    data: [
      {
        cadreId: profiles[4].id,
        reminderType: '补录提醒',
        triggerEvent: '联系方式为空',
        reminderLevel: '高',
        dueDate: new Date('2026-04-28T18:00:00'),
        status: '待发送',
        summary: '陈志远联系方式缺失，需在本周内补录。',
        nextAction: '通知办公室管理员联系本人补录。'
      },
      {
        cadreId: profiles[5].id,
        reminderType: '材料补充',
        triggerEvent: '学历信息缺失',
        reminderLevel: '中',
        dueDate: new Date('2026-04-30T18:00:00'),
        status: '处理中',
        summary: '赵宁学历字段未维护完整，待补充佐证材料。',
        nextAction: '联系工程建设部补充学历证明。'
      },
      {
        cadreId: profiles[8].id,
        reminderType: '状态更新',
        triggerEvent: '挂职状态到期前提醒',
        reminderLevel: '高',
        dueDate: new Date('2026-04-29T12:00:00'),
        status: '待发送',
        summary: '吴志强挂职状态需确认是否续挂或回原单位。',
        nextAction: '向后勤分公司核实最新任命情况。'
      },
      {
        cadreId: profiles[0].id,
        reminderType: '台账复核',
        triggerEvent: '月度全量复核',
        reminderLevel: '低',
        dueDate: new Date('2026-05-05T18:00:00'),
        status: '已排期',
        summary: '党群工作部干部主数据进入月度复核窗口。',
        nextAction: '按部门分发复核任务单。'
      }
    ]
  });

  await prisma.cadreConversation.createMany({
    data: [
      {
        scene: '工作概览',
        role: 'assistant',
        stage: '概览分析',
        content: '当前主数据以完整性缺失和状态更新提醒为主，建议本周优先闭环高等级提醒事项。'
      },
      {
        scene: '自动核验',
        role: 'assistant',
        stage: '核验建议',
        content: '自动核验建议先处理岗位、组织关系和联系方式三类差异项，便于尽快收敛导入批次。'
      },
      {
        scene: '重复清洗',
        role: 'assistant',
        stage: '清洗建议',
        content: '同音姓名疑似重复不宜直接合并，建议先核对身份证号和历史任职记录。'
      },
      {
        scene: '完整性检查',
        role: 'assistant',
        stage: '补全建议',
        content: '联系方式、学历和党籍状态是当前缺失集中区，建议形成分部门补录清单。'
      },
      {
        scene: '动态提醒',
        role: 'assistant',
        stage: '提醒建议',
        content: '提醒事项应按高、中、低分级推送，并对逾期未处理记录自动升级。'
      }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      {
        module: '登录',
        action: '登录成功',
        objectType: '用户',
        operator: 'admin',
        result: '成功',
        summary: '管理员登录党员、干部信息智能管理系统。'
      },
      {
        module: '自动核验',
        action: '导入批次比对',
        objectType: '导入批次',
        operator: 'admin',
        result: '成功',
        summary: '已完成 2026年4月干部台账导入 批次的首轮字段核验。'
      },
      {
        module: '完整性检查',
        action: '生成缺失清单',
        objectType: '数据质量问题',
        operator: 'admin',
        result: '成功',
        summary: '已生成党员、干部信息缺失字段清单并写入治理台账。'
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
