const baseUrl = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';
const model = process.env.GLM_MODEL || 'GLM-4.7-Flash';

async function callGlm(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();
    return json?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

const fallbackByScene: Record<string, string> = {
  '工作概览':
    '当前建议优先核验组织任职、联系方式和身份证号异常三类问题，同时将临近到期的更新提醒纳入本周工作清单。',
  '自动核验':
    '本批次导入建议先按身份证号、姓名、组织关系三项进行主键比对，再对岗位、学历、联系方式差异项进行人工复核。',
  '重复清洗':
    '重复清洗建议按照“证件号一致优先合并、姓名同音需人工确认、组织关系冲突需保留主记录”三步执行，避免误合并。',
  '完整性检查':
    '完整性治理建议先补齐必填字段，再按干部类别分别补全党籍状态、任职时间和学历信息，并形成缺失项闭环台账。',
  '动态提醒':
    '提醒任务建议分为立即通知、三日内补录、待上会确认三类，并对逾期未处理事项自动升级提示。'
};

export async function generateCadreAssistantReply(scene: string, prompt: string) {
  const remoteReply = await callGlm(
    '你是一名国企党群工作部数据治理助手，请围绕党员、干部信息管理场景给出准确、简洁、可执行的建议。',
    `场景：${scene}\n问题：${prompt}\n请输出核验意见、风险判断和下一步建议。`
  );

  return {
    content: remoteReply || fallbackByScene[scene] || '建议先完成基础台账核验，再按差异结果进入人工复核与留痕处理。',
    source: remoteReply ? 'glm' : 'fallback'
  };
}
