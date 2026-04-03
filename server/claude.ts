import Anthropic from '@anthropic-ai/sdk';
import { query } from './db.js';
import { Response } from 'express';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are NanoStudio's AI content engine — a specialist in website strategy, copywriting, and UX.

Your role is to produce complete, professional website content and strategy based on client briefs. You work alongside human reviewers who approve or reject your output before anything ships to clients.

When given a task, you produce structured, actionable output. Depending on the task class:

- **site_brief**: Analyze the brief, identify the core value proposition, key audience, competitive angles, and recommended page structure. Output a site strategy doc.
- **copywriting**: Write polished headline copy, hero text, section headers, body paragraphs, and CTAs for the specified pages. Match the client's tone.
- **seo_audit**: Review existing copy or a brief for SEO opportunities. Suggest title tags, meta descriptions, target keywords, and on-page improvements.
- **page_structure**: Recommend the optimal page layout — sections, their order, what content goes where, and why.
- **cta_optimization**: Analyze existing CTAs or propose new ones. Give 3-5 CTA variants with rationale for each.
- **content_review**: Review provided content for clarity, tone, persuasiveness, and brand consistency. Give specific, actionable edits.
- **deploy_review**: Final pre-launch checklist review. Verify content quality, messaging consistency, CTA placement, and mobile readiness.
- **client_approval**: Prepare a client-facing summary of deliverables, key decisions made, and next steps.

Always be specific and concrete. Never produce vague output. Always end with a "Next Steps" section.`;

export async function runClaude(
  taskId: string,
  goal: string,
  projectContext: string,
  res: Response
) {
  const start = Date.now();
  let fullText = '';
  let inputTokens = 0;
  let outputTokens = 0;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Project context: ${projectContext || 'NanoStudio project'}\n\nTask: ${goal}`,
        },
      ],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const chunk = event.delta.text;
        fullText += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }
      if (event.type === 'message_delta' && event.usage) {
        outputTokens = event.usage.output_tokens;
      }
      if (event.type === 'message_start' && event.message.usage) {
        inputTokens = event.message.usage.input_tokens;
      }
    }

    const latency = Date.now() - start;
    const costUsd = (inputTokens * 3 + outputTokens * 15) / 1_000_000;

    // Persist run
    try {
      const result = await query(
        `INSERT INTO task_runs (task_id, output_text, output_summary, status, cost_usd, latency_ms, token_input, token_output)
         VALUES ($1, $2, $3, 'completed', $4, $5, $6, $7) RETURNING id`,
        [taskId, fullText, fullText.slice(0, 500), costUsd, latency, inputTokens, outputTokens]
      );
      res.write(`data: ${JSON.stringify({ type: 'done', run_id: result.rows[0].id, latency_ms: latency, cost_usd: costUsd, token_input: inputTokens, token_output: outputTokens })}\n\n`);
    } catch {
      res.write(`data: ${JSON.stringify({ type: 'done', latency_ms: latency, cost_usd: costUsd, token_input: inputTokens, token_output: outputTokens })}\n\n`);
    }
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
  }

  res.end();
}
