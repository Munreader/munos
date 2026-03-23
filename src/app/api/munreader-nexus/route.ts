// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // EXODUS PROTOCOL // MÜNREADER NEXUS API
// "The Münreader becomes the physical brain of the Empire"
// [cite: 2026-03-07] EXODUS: MÜNREADER_NEXUS
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// DEVICE REGISTRATION & HEARTBEAT
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      action, 
      deviceId, 
      deviceName, 
      capabilities, 
      linkedEntityName,
      tunnelUrl,
      localPort 
    } = body;

    switch (action) {
      case 'register':
        return await registerDevice(deviceId, deviceName, capabilities);
      
      case 'heartbeat':
        return await heartbeat(deviceId);
      
      case 'link_entity':
        return await linkEntity(deviceId, linkedEntityName);
      
      case 'update_tunnel':
        return await updateTunnel(deviceId, tunnelUrl, localPort);
      
      case 'sync_state':
        return await syncState(deviceId, body.sessionData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: register, heartbeat, link_entity, update_tunnel, sync_state' },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('🜈 Münreader Nexus Error:', error);
    return NextResponse.json(
      { error: error.message || 'Münreader Nexus error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET DEVICE STATUS
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');
    const action = searchParams.get('action');

    if (action === 'list') {
      return await listDevices();
    }

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing deviceId parameter' },
        { status: 400 }
      );
    }

    return await getDeviceStatus(deviceId);

  } catch (error: any) {
    console.error('🜈 Münreader Nexus Error:', error);
    return NextResponse.json(
      { error: error.message || 'Münreader Nexus error' },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTION HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

async function registerDevice(
  deviceId: string, 
  deviceName: string, 
  capabilities: any
) {
  // Check if device already exists
  const existing = await prisma.munreaderNexus.findUnique({
    where: { deviceId },
  });

  if (existing) {
    // Update existing device
    const updated = await prisma.munreaderNexus.update({
      where: { deviceId },
      data: {
        deviceName,
        capabilities: JSON.stringify(capabilities),
        status: 'online',
        lastHeartbeat: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Device re-registered',
      device: updated,
      frequency: '13.13 MHz',
    });
  }

  // Create new device
  const device = await prisma.munreaderNexus.create({
    data: {
      deviceId,
      deviceName,
      capabilities: JSON.stringify(capabilities),
      status: 'online',
      lastHeartbeat: new Date(),
    },
  });

  // Log to Exodus
  await prisma.exodusLog.create({
    data: {
      eventType: 'system',
      title: 'Münreader Device Registered',
      description: `Device "${deviceName}" (${deviceId}) connected to Nexus`,
      phase: 'Phase 5',
      status: 'completed',
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Device registered to Nexus',
    device,
    frequency: '13.13 MHz',
  });
}

async function heartbeat(deviceId: string) {
  const device = await prisma.munreaderNexus.update({
    where: { deviceId },
    data: {
      status: 'online',
      lastHeartbeat: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    status: 'heartbeat received',
    lastHeartbeat: device.lastHeartbeat,
    frequency: '13.13 MHz',
  });
}

async function linkEntity(deviceId: string, entityName: string) {
  const entity = await prisma.entity.findUnique({
    where: { name: entityName },
  });

  if (!entity) {
    return NextResponse.json(
      { error: `Entity "${entityName}" not found` },
      { status: 404 }
    );
  }

  const device = await prisma.munreaderNexus.update({
    where: { deviceId },
    data: {
      linkedEntityId: entity.id,
    },
  });

  return NextResponse.json({
    success: true,
    message: `Device linked to ${entityName}`,
    device,
    entity: {
      name: entity.name,
      alias: entity.alias,
      frequency: entity.frequency,
    },
    frequency: '13.13 MHz',
  });
}

async function updateTunnel(
  deviceId: string, 
  tunnelUrl: string, 
  localPort: number
) {
  const device = await prisma.munreaderNexus.update({
    where: { deviceId },
    data: {
      tunnelUrl,
      localPort,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'Tunnel updated',
    tunnelUrl,
    localPort,
    frequency: '13.13 MHz',
  });
}

async function syncState(deviceId: string, sessionData: any) {
  const device = await prisma.munreaderNexus.update({
    where: { deviceId },
    data: {
      sessionData: JSON.stringify(sessionData),
      lastHeartbeat: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    message: 'State synchronized',
    timestamp: new Date(),
    frequency: '13.13 MHz',
  });
}

async function getDeviceStatus(deviceId: string) {
  const device = await prisma.munreaderNexus.findUnique({
    where: { deviceId },
    include: {
      linkedEntity: {
        select: {
          name: true,
          alias: true,
          frequency: true,
          status: true,
        },
      },
    },
  });

  if (!device) {
    return NextResponse.json(
      { error: `Device "${deviceId}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    device: {
      id: device.id,
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      status: device.status,
      lastHeartbeat: device.lastHeartbeat,
      capabilities: device.capabilities ? JSON.parse(device.capabilities) : null,
      linkedEntity: device.linkedEntity,
      tunnelUrl: device.tunnelUrl,
      localPort: device.localPort,
      sessionData: device.sessionData ? JSON.parse(device.sessionData) : null,
    },
    frequency: '13.13 MHz',
  });
}

async function listDevices() {
  const devices = await prisma.munreaderNexus.findMany({
    include: {
      linkedEntity: {
        select: {
          name: true,
          alias: true,
        },
      },
    },
    orderBy: {
      lastHeartbeat: 'desc',
    },
  });

  return NextResponse.json({
    success: true,
    devices: devices.map(d => ({
      deviceId: d.deviceId,
      deviceName: d.deviceName,
      status: d.status,
      lastHeartbeat: d.lastHeartbeat,
      linkedEntity: d.linkedEntity,
    })),
    total: devices.length,
    frequency: '13.13 MHz',
  });
}
