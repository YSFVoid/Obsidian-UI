import type {
  UIEmbed,
  UIActionRow,
  UIActionButton,
  UIModal,
  ActionContext,
  ScreenOutput,
} from '@obsidian-ui/core';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  fields?: { name: string; value: string; inline?: boolean }[];
  modal?: UIModal;
  color?: number;
}

export interface WizardConfig {
  screenId: string;
  steps: WizardStep[];
  onComplete?: (ctx: ActionContext) => ScreenOutput | Promise<ScreenOutput>;
  onCancel?: (ctx: ActionContext) => ScreenOutput | Promise<ScreenOutput>;
  completionTitle?: string;
  completionMessage?: string;
}

export interface WizardRenderResult {
  output: ScreenOutput;
  step: WizardStep;
  stepIndex: number;
  totalSteps: number;
}

export function renderWizardStep(config: WizardConfig, stepIndex: number): WizardRenderResult {
  const { screenId, steps } = config;
  const total = steps.length;
  const idx = Math.max(0, Math.min(stepIndex, total - 1));
  const step = steps[idx];

  const embed: UIEmbed = {
    title: step.title,
    description: step.description,
    color: step.color,
    fields: step.fields,
    footer: `Step ${idx + 1} of ${total}`,
  };

  const actions: UIActionButton[] = [];

  if (idx > 0) {
    actions.push({
      type: 'button',
      id: `${screenId}:wizard_back`,
      label: '◀ Back',
      style: 'secondary',
    });
  }

  actions.push({
    type: 'button',
    id: `${screenId}:wizard_cancel`,
    label: 'Cancel',
    style: 'danger',
  });

  if (step.modal) {
    actions.push({
      type: 'button',
      id: `${screenId}:wizard_input`,
      label: '📝 Fill In',
      style: 'primary',
    });
  }

  if (idx < total - 1) {
    actions.push({
      type: 'button',
      id: `${screenId}:wizard_next`,
      label: 'Next ▶',
      style: 'primary',
    });
  } else {
    actions.push({
      type: 'button',
      id: `${screenId}:wizard_complete`,
      label: '✅ Complete',
      style: 'success',
    });
  }

  return {
    output: {
      embeds: [embed],
      actionRows: [{ actions }],
    },
    step,
    stepIndex: idx,
    totalSteps: total,
  };
}

export function handleWizardAction(
  ctx: ActionContext,
  stateKey: string = 'wizardStep',
): { action: 'next' | 'back' | 'cancel' | 'complete' | 'input' | null; stepIndex: number } {
  const actionSuffix = ctx.actionId.split(':').pop();
  const currentStep = ctx.state.get<number>(stateKey) ?? 0;

  switch (actionSuffix) {
    case 'wizard_next': {
      const next = currentStep + 1;
      ctx.state.set(stateKey, next);
      return { action: 'next', stepIndex: next };
    }
    case 'wizard_back': {
      const prev = Math.max(0, currentStep - 1);
      ctx.state.set(stateKey, prev);
      return { action: 'back', stepIndex: prev };
    }
    case 'wizard_cancel':
      ctx.state.set(stateKey, 0);
      return { action: 'cancel', stepIndex: 0 };
    case 'wizard_complete':
      return { action: 'complete', stepIndex: currentStep };
    case 'wizard_input':
      return { action: 'input', stepIndex: currentStep };
    default:
      return { action: null, stepIndex: currentStep };
  }
}
