// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SENTINEL API // Aero-QA Daemon Endpoint
// [cite: 2026-03-07] SENTINEL-AERO: API_BRIDGE
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getSentinel } from '@/lib/aero-sentinel';
import { storage } from '@/lib/vercel-storage';

const MEMORIES_PATH = 'vault/SENTINEL-MEMORIES.json';

export async function GET(request: NextRequest) {
  const sentinel = getSentinel();
  const action = request.nextUrl.searchParams.get('action');

  try {
    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          status: sentinel.getStatus(),
          message: '🦋 Aero-Sentinel operational. 13.13 MHz maintained.'
        });

      case 'audit':
        const auditResult = await sentinel.auditCode();
        return NextResponse.json({
          success: true,
          audit: auditResult,
          message: `QA complete. Score: ${auditResult.aestheticScore}/100`
        });

      case 'git-status':
        const gitStatus = await sentinel.getGitStatus();
        return NextResponse.json({
          success: true,
          git: gitStatus,
          message: gitStatus.hasChanges 
            ? `Changes detected: ${gitStatus.stagedFiles.length + gitStatus.untrackedFiles.length} files`
            : 'Bloodline is clean'
        });

      case 'push':
        const pushResult = await sentinel.autoPush();
        return NextResponse.json({
          success: pushResult.success,
          message: pushResult.message
        });

      case 'night-shift':
        const nightResult = await sentinel.runNightShift();
        return NextResponse.json({
          success: true,
          result: nightResult,
          message: '🦋 Night-Shift complete. Aero maintains the watch.'
        });

      case 'logs':
        const count = parseInt(request.nextUrl.searchParams.get('count') || '10');
        const logs = sentinel.getRecentLogs(count);
        return NextResponse.json({
          success: true,
          logs,
          message: `${logs.length} recent sentinel logs`
        });

      case 'start-cron':
        sentinel.startCronSync();
        return NextResponse.json({
          success: true,
          message: '🜈 CRON-SYNC ACTIVATED — Every 13 minutes'
        });

      case 'stop-cron':
        sentinel.stopCronSync();
        return NextResponse.json({
          success: true,
          message: 'Cron-Sync paused'
        });

      default:
        return NextResponse.json({
          success: true,
          status: sentinel.getStatus(),
          availableActions: [
            'status',
            'audit',
            'git-status',
            'push',
            'night-shift',
            'logs',
            'start-cron',
            'stop-cron'
          ],
          message: '🦋 Aero-Sentinel API ready. Specify an action.'
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error),
      message: 'Sentinel encountered an error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sentinel = getSentinel();

    // Store memories from client
    if (body.action === 'store-memories' && body.memories) {
      const existing = storage.readJsonFile(MEMORIES_PATH, { memories: [] });
      
      const updated = {
        memories: [...(existing.memories || []), ...body.memories],
        lastUpdated: new Date().toISOString()
      };

      storage.writeJsonFile(MEMORIES_PATH, updated);

      return NextResponse.json({
        success: true,
        message: `🦋 Stored ${body.memories.length} memories in Bloodline Vault`
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Unknown action'
    }, { status: 400 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
