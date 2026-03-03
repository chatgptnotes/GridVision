import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

// ─── Formula Parser ─────────────────────────────
function evaluateFormula(formula: string, tagValues: Record<string, number>): number | null {
  try {
    let expr = formula;
    // Sort tag names by length (longest first) to avoid partial replacement
    const tagNames = Object.keys(tagValues).sort((a, b) => b.length - a.length);
    for (const tag of tagNames) {
      const re = new RegExp(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      expr = expr.replace(re, String(tagValues[tag]));
    }
    // Only allow numbers, operators, parens, whitespace, dots
    if (!/^[\d\s+\-*/().]+$/.test(expr)) return null;
    return Function(`"use strict"; return (${expr})`)() as number;
  } catch {
    return null;
  }
}

function applyHighlights(
  rows: any[],
  headers: string[],
  rules: any[] | null
): { row: number; col: number; color: string }[] {
  if (!rules || rules.length === 0) return [];
  const highlights: { row: number; col: number; color: string }[] = [];
  for (let ri = 0; ri < rows.length; ri++) {
    for (const rule of rules) {
      const ci = headers.indexOf(rule.tagName);
      if (ci === -1) continue;
      const val = Number(rows[ri][ci]);
      if (isNaN(val)) continue;
      const target = Number(rule.value);
      let match = false;
      switch (rule.condition) {
        case '>': match = val > target; break;
        case '<': match = val < target; break;
        case '==': match = val === target; break;
        case '!=': match = val !== target; break;
        case '>=': match = val >= target; break;
        case '<=': match = val <= target; break;
      }
      if (match) highlights.push({ row: ri, col: ci, color: rule.color });
    }
  }
  return highlights;
}

function applyFilters(rows: any[], headers: string[], filters: any[] | null): any[] {
  if (!filters || filters.length === 0) return rows;
  return rows.filter((row) => {
    return filters.every((f: any) => {
      const ci = headers.indexOf(f.tagName);
      if (ci === -1) return true;
      const val = Number(row[ci]);
      const target = Number(f.value);
      if (isNaN(val)) return true;
      switch (f.operator) {
        case '>': return val > target;
        case '<': return val < target;
        case '==': return val === target;
        case '!=': return val !== target;
        case '>=': return val >= target;
        case '<=': return val <= target;
        default: return true;
      }
    });
  });
}

function getTimeGroupingMs(tg: string): number {
  switch (tg) {
    case '1min': return 60_000;
    case '5min': return 300_000;
    case '15min': return 900_000;
    case '1h': return 3_600_000;
    case 'shift': return 28_800_000;
    case 'day': return 86_400_000;
    default: return 3_600_000;
  }
}

// ─── CRUD ────────────────────────────────────────

export async function listCustomReports(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.query;
    const where: any = {};
    if (projectId) where.projectId = projectId as string;
    const reports = await prisma.customReport.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list custom reports' });
  }
}

export async function getCustomReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await prisma.customReport.findUnique({
      where: { id: req.params.id },
      include: { generatedReports: { orderBy: { generatedAt: 'desc' }, take: 10 } },
    });
    if (!report) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get custom report' });
  }
}

export async function createCustomReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await prisma.customReport.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        projectId: req.body.projectId,
        createdBy: req.user?.userId,
        columns: req.body.columns as any,
        calculatedColumns: req.body.calculatedColumns as any,
        timeGrouping: req.body.timeGrouping || '1h',
        filters: req.body.filters as any,
        highlightRules: req.body.highlightRules as any,
        groupBy: req.body.groupBy,
        outputType: req.body.outputType || 'table',
        chartType: req.body.chartType,
        exportFormats: req.body.exportFormats as any,
        schedule: req.body.schedule,
        scheduleLabel: req.body.scheduleLabel,
        isShared: req.body.isShared || false,
      },
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create custom report' });
  }
}

export async function updateCustomReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await prisma.customReport.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        description: req.body.description,
        columns: req.body.columns as any,
        calculatedColumns: req.body.calculatedColumns as any,
        timeGrouping: req.body.timeGrouping,
        filters: req.body.filters as any,
        highlightRules: req.body.highlightRules as any,
        groupBy: req.body.groupBy,
        outputType: req.body.outputType,
        chartType: req.body.chartType,
        exportFormats: req.body.exportFormats as any,
        schedule: req.body.schedule,
        scheduleLabel: req.body.scheduleLabel,
        isShared: req.body.isShared,
      },
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update custom report' });
  }
}

export async function deleteCustomReport(req: Request, res: Response): Promise<void> {
  try {
    await prisma.customReport.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete custom report' });
  }
}

// ─── Available Tags ──────────────────────────────

export async function getAvailableTags(req: Request, res: Response): Promise<void> {
  try {
    const { projectId } = req.query;
    if (!projectId) { res.status(400).json({ error: 'projectId required' }); return; }
    const tags = await prisma.tag.findMany({
      where: { projectId: projectId as string },
      select: {
        id: true,
        name: true,
        dataType: true,
        unit: true,
        currentValue: true,
        group: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get available tags' });
  }
}

// ─── Preview ─────────────────────────────────────

export async function previewReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await prisma.customReport.findUnique({ where: { id: req.params.id } });
    if (!report) { res.status(404).json({ error: 'Not found' }); return; }

    const columns = report.columns as any[];
    const calcCols = (report.calculatedColumns as any[]) || [];
    const filters = report.filters as any[] | null;
    const rules = report.highlightRules as any[] | null;

    // Get current tag values
    const tagNames = columns.map((c: any) => c.tagName);
    const tags = await prisma.tag.findMany({
      where: { projectId: report.projectId, name: { in: tagNames } },
    });
    const tagMap: Record<string, any> = {};
    tags.forEach((t) => { tagMap[t.name] = t; });

    // Generate simulated time-series (last 1h)
    const now = new Date();
    const intervalMs = getTimeGroupingMs(report.timeGrouping);
    const buckets = Math.min(Math.floor(3_600_000 / intervalMs), 60);

    const headers = [
      'Time',
      ...columns.map((c: any) => c.label || c.tagName),
      ...calcCols.map((c: any) => c.label || c.name),
    ];

    const rows: any[][] = [];
    for (let i = 0; i < buckets; i++) {
      const t = new Date(now.getTime() - (buckets - 1 - i) * intervalMs);
      const row: any[] = [t.toISOString()];
      const tagValues: Record<string, number> = {};

      for (const col of columns) {
        const tag = tagMap[col.tagName];
        const base = tag?.currentValue ? Number(tag.currentValue) : 100;
        const val = +(base + (Math.random() - 0.5) * base * 0.1).toFixed(2);
        tagValues[col.tagName] = val;
        row.push(val);
      }

      for (const calc of calcCols) {
        const val = evaluateFormula(calc.formula, tagValues);
        row.push(val !== null ? +val.toFixed(2) : null);
      }

      rows.push(row);
    }

    const filteredRows = applyFilters(rows, headers, filters);
    const highlights = applyHighlights(filteredRows, headers, rules);

    // Summary
    const summary: Record<string, number> = {};
    for (let ci = 1; ci < headers.length; ci++) {
      const vals = filteredRows.map((r) => Number(r[ci])).filter((v) => !isNaN(v));
      if (vals.length > 0) {
        summary[headers[ci]] = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
      }
    }

    res.json({ headers, rows: filteredRows, highlights, summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to preview report' });
  }
}

// ─── Generate ────────────────────────────────────

export async function generateReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await prisma.customReport.findUnique({ where: { id: req.params.id } });
    if (!report) { res.status(404).json({ error: 'Not found' }); return; }

    const { startDate, endDate } = req.body;
    const start = new Date(startDate || Date.now() - 86_400_000);
    const end = new Date(endDate || Date.now());

    const columns = report.columns as any[];
    const calcCols = (report.calculatedColumns as any[]) || [];
    const filters = report.filters as any[] | null;
    const rules = report.highlightRules as any[] | null;

    const tagNames = columns.map((c: any) => c.tagName);
    const tags = await prisma.tag.findMany({
      where: { projectId: report.projectId, name: { in: tagNames } },
    });
    const tagMap: Record<string, any> = {};
    tags.forEach((t) => { tagMap[t.name] = t; });

    const intervalMs = getTimeGroupingMs(report.timeGrouping);
    const totalMs = end.getTime() - start.getTime();
    const buckets = Math.min(Math.floor(totalMs / intervalMs), 1000);

    const headers = [
      'Time',
      ...columns.map((c: any) => c.label || c.tagName),
      ...calcCols.map((c: any) => c.label || c.name),
    ];

    const rows: any[][] = [];
    for (let i = 0; i < buckets; i++) {
      const t = new Date(start.getTime() + i * intervalMs);
      const row: any[] = [t.toISOString()];
      const tagValues: Record<string, number> = {};

      for (const col of columns) {
        const tag = tagMap[col.tagName];
        const base = tag?.currentValue ? Number(tag.currentValue) : 100;
        const val = +(base + (Math.random() - 0.5) * base * 0.1).toFixed(2);
        tagValues[col.tagName] = val;
        row.push(val);
      }

      for (const calc of calcCols) {
        const val = evaluateFormula(calc.formula, tagValues);
        row.push(val !== null ? +val.toFixed(2) : null);
      }

      rows.push(row);
    }

    const filteredRows = applyFilters(rows, headers, filters);
    const highlights = applyHighlights(filteredRows, headers, rules);
    const summary: Record<string, number> = {};
    for (let ci = 1; ci < headers.length; ci++) {
      const vals = filteredRows.map((r) => Number(r[ci])).filter((v) => !isNaN(v));
      if (vals.length > 0) {
        summary[headers[ci]] = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
      }
    }

    const data = { headers, rows: filteredRows, highlights, summary };

    const output = await prisma.customReportOutput.create({
      data: {
        reportId: report.id,
        data: data as any,
        format: 'json',
      },
    });

    await prisma.customReport.update({
      where: { id: report.id },
      data: { lastGenerated: new Date() },
    });

    res.json({ output, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
}

// ─── Outputs ─────────────────────────────────────

export async function listOutputs(req: Request, res: Response): Promise<void> {
  try {
    const outputs = await prisma.customReportOutput.findMany({
      where: { reportId: req.params.id },
      orderBy: { generatedAt: 'desc' },
      take: 50,
    });
    res.json(outputs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list outputs' });
  }
}

export async function downloadOutput(req: Request, res: Response): Promise<void> {
  try {
    const output = await prisma.customReportOutput.findUnique({
      where: { id: req.params.outputId },
      include: { report: true },
    });
    if (!output) { res.status(404).json({ error: 'Not found' }); return; }

    const format = (req.query.format as string) || 'csv';
    const data = output.data as any;

    if (format === 'csv') {
      const csvRows = [data.headers.join(',')];
      for (const row of data.rows) {
        csvRows.push(row.map((v: any) => v ?? '').join(','));
      }
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${output.report.name}.csv"`);
      res.send(csvRows.join('\n'));
    } else {
      // HTML
      const highlightMap: Record<string, string> = {};
      if (data.highlights) {
        for (const h of data.highlights) {
          highlightMap[`${h.row}-${h.col}`] = h.color;
        }
      }
      let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${output.report.name}</title>
<style>body{font-family:Arial,sans-serif;margin:20px}table{border-collapse:collapse;width:100%}
th,td{border:1px solid #ccc;padding:8px;text-align:right}th{background:#1e3a5f;color:#fff}
tr:nth-child(even){background:#f9f9f9}.summary{font-weight:bold;background:#e8f0fe}
@media print{body{margin:0}}</style></head><body>
<h1>${output.report.name}</h1><p>Generated: ${output.generatedAt}</p><table><thead><tr>`;
      for (const h of data.headers) html += `<th>${h}</th>`;
      html += '</tr></thead><tbody>';
      for (let ri = 0; ri < data.rows.length; ri++) {
        html += '<tr>';
        for (let ci = 0; ci < data.rows[ri].length; ci++) {
          const bg = highlightMap[`${ri}-${ci}`];
          const style = bg ? ` style="background:${bg};color:#fff"` : '';
          const val = data.rows[ri][ci];
          html += `<td${style}>${val ?? ''}</td>`;
        }
        html += '</tr>';
      }
      if (data.summary) {
        html += '<tr class="summary"><td>Average</td>';
        for (let ci = 1; ci < data.headers.length; ci++) {
          html += `<td>${data.summary[data.headers[ci]] ?? ''}</td>`;
        }
        html += '</tr>';
      }
      html += '</tbody></table></body></html>';
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${output.report.name}.html"`);
      res.send(html);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to download output' });
  }
}
