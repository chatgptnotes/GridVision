import { prisma } from '../config/database';
import { realtimeService } from './realtime.service';
import type { ControlRequest, ControlSelectResponse, ControlResult, InterlockCheck, SBOState } from '@gridvision/shared';
import { SBO_TIMEOUT_SECONDS } from '@gridvision/shared';

const pendingCommands = new Map<string, { timeout: NodeJS.Timeout; userId: string }>();

export class ControlService {
  async select(request: ControlRequest, userId: string): Promise<ControlSelectResponse> {
    const equipment = await prisma.equipment.findUnique({
      where: { id: request.equipmentId },
      include: {
        dataPoints: true,
        bay: { include: { voltageLevel: { include: { substation: true } } } },
      },
    });

    if (!equipment) throw new Error('Equipment not found');

    // Check interlocks
    const interlockResults = await this.checkInterlocks(request.equipmentId, request.commandType);
    const allPassed = interlockResults.every((i) => i.passed);

    if (!allPassed) {
      throw new Error(`Interlock failed: ${interlockResults.filter((i) => !i.passed).map((i) => i.description).join(', ')}`);
    }

    // Get current state
    const statusTag = `${equipment.tag}_STATUS`;
    const currentValue = realtimeService.getCurrentValue(statusTag);
    const currentState = currentValue ? (currentValue.value ? 'CLOSED' : 'OPEN') : 'UNKNOWN';

    // Create command record
    const command = await prisma.controlCommand.create({
      data: {
        equipmentId: request.equipmentId,
        userId,
        commandType: request.commandType,
        sboState: 'SELECT_CONFIRMED',
      },
    });

    // Set timeout to auto-cancel
    const timeout = setTimeout(async () => {
      await this.cancelCommand(command.id, 'TIMEOUT');
    }, SBO_TIMEOUT_SECONDS * 1000);

    pendingCommands.set(command.id, { timeout, userId });

    return {
      commandId: command.id,
      equipmentTag: equipment.tag,
      currentState,
      proposedAction: request.commandType,
      interlockStatus: interlockResults,
      timeoutSeconds: SBO_TIMEOUT_SECONDS,
    };
  }

  async execute(commandId: string, userId: string): Promise<ControlResult> {
    const pending = pendingCommands.get(commandId);
    if (!pending) throw new Error('Command not found or expired');
    if (pending.userId !== userId) throw new Error('Command belongs to different user');

    clearTimeout(pending.timeout);
    pendingCommands.delete(commandId);

    const command = await prisma.controlCommand.findUnique({
      where: { id: commandId },
      include: { equipment: true },
    });

    if (!command || command.sboState !== 'SELECT_CONFIRMED') {
      throw new Error('Invalid command state');
    }

    // Update to EXECUTE_SENT
    await prisma.controlCommand.update({
      where: { id: commandId },
      data: { sboState: 'EXECUTE_SENT' },
    });

    try {
      // Simulate sending command to protocol adapter
      // In real implementation, this would go through the protocol adapter
      const newState = command.commandType === 'CLOSE' || command.commandType === 'RAISE';

      // Update the digital state
      const statusDp = await prisma.dataPoint.findFirst({
        where: {
          equipmentId: command.equipmentId,
          tag: { endsWith: '_STATUS' },
        },
      });

      if (statusDp) {
        await realtimeService.publishDigitalState(statusDp.tag, statusDp.id, newState);
      }

      await prisma.controlCommand.update({
        where: { id: commandId },
        data: {
          sboState: 'EXECUTE_SUCCESS',
          completedAt: new Date(),
          resultMessage: `${command.commandType} executed successfully`,
        },
      });

      return {
        commandId,
        success: true,
        message: `${command.equipment.tag} ${command.commandType} executed successfully`,
        newState: newState ? 'CLOSED' : 'OPEN',
        timestamp: new Date(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      await prisma.controlCommand.update({
        where: { id: commandId },
        data: {
          sboState: 'EXECUTE_FAILED',
          completedAt: new Date(),
          resultMessage: message,
        },
      });

      return {
        commandId,
        success: false,
        message: `${command.commandType} failed: ${message}`,
        timestamp: new Date(),
      };
    }
  }

  async cancel(commandId: string, userId: string): Promise<void> {
    const pending = pendingCommands.get(commandId);
    if (!pending) throw new Error('Command not found or expired');
    if (pending.userId !== userId) throw new Error('Command belongs to different user');

    clearTimeout(pending.timeout);
    pendingCommands.delete(commandId);

    await this.cancelCommand(commandId, 'CANCELLED');
  }

  private async cancelCommand(commandId: string, state: SBOState): Promise<void> {
    pendingCommands.delete(commandId);
    await prisma.controlCommand.update({
      where: { id: commandId },
      data: { sboState: state, completedAt: new Date(), resultMessage: `Command ${state.toLowerCase()}` },
    });
  }

  private async checkInterlocks(equipmentId: string, _commandType: string): Promise<InterlockCheck[]> {
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        bay: {
          include: {
            equipment: {
              include: { dataPoints: true },
            },
          },
        },
      },
    });

    if (!equipment) return [{ rule: 'equipment_exists', passed: false, description: 'Equipment not found' }];

    const checks: InterlockCheck[] = [];

    // Check: Cannot open isolator when CB is closed
    if (equipment.type === 'ISOLATOR') {
      const bayCB = equipment.bay.equipment.find((e) => e.type === 'CIRCUIT_BREAKER');
      if (bayCB) {
        const cbStatusTag = `${bayCB.tag}_STATUS`;
        const cbValue = realtimeService.getCurrentValue(cbStatusTag);
        const cbClosed = cbValue ? Boolean(cbValue.value) : false;
        checks.push({
          rule: 'cb_must_be_open_for_isolator',
          passed: !cbClosed,
          description: cbClosed ? 'Cannot operate isolator while CB is closed' : 'CB is open - safe to operate isolator',
        });
      }
    }

    // Check: Cannot close CB if earth switch is closed
    if (equipment.type === 'CIRCUIT_BREAKER') {
      const earthSwitch = equipment.bay.equipment.find((e) => e.type === 'EARTH_SWITCH');
      if (earthSwitch) {
        const esStatusTag = `${earthSwitch.tag}_STATUS`;
        const esValue = realtimeService.getCurrentValue(esStatusTag);
        const esClosed = esValue ? Boolean(esValue.value) : false;
        checks.push({
          rule: 'earth_switch_must_be_open_for_cb',
          passed: !esClosed,
          description: esClosed ? 'Cannot close CB while earth switch is closed' : 'Earth switch is open - safe to close CB',
        });
      }
    }

    if (checks.length === 0) {
      checks.push({ rule: 'no_interlocks', passed: true, description: 'No interlock rules configured' });
    }

    return checks;
  }
}

export const controlService = new ControlService();
