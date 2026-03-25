import {
  type Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type InteractionReplyOptions,
  type InteractionUpdateOptions,
} from 'discord.js';
import type { ScreenOutput, UIEmbed, UIActionRow, UIAction, UIModal, ResponseMode, ThemeTokens } from '@obsidian-ui/core';

export function buildResponse(
  output: ScreenOutput,
  theme: ThemeTokens,
): InteractionReplyOptions {
  const embeds = output.embeds.map(e => buildEmbed(e, theme));
  const components = output.actionRows.map(row => buildActionRow(row));

  return {
    embeds,
    components,
    ephemeral: output.ephemeral ?? false,
  };
}

function buildEmbed(schema: UIEmbed, theme: ThemeTokens): EmbedBuilder {
  const embed = new EmbedBuilder();

  if (schema.title) embed.setTitle(schema.title);
  if (schema.description) embed.setDescription(schema.description);
  embed.setColor(schema.color ?? theme.colors.primary);
  if (schema.footer) {
    embed.setFooter({ text: schema.footer });
  } else if (theme.branding.footer) {
    embed.setFooter({ text: theme.branding.footer });
  }
  if (schema.thumbnail) embed.setThumbnail(schema.thumbnail);
  if (schema.image) embed.setImage(schema.image);
  if (schema.author) {
    embed.setAuthor({
      name: schema.author.name,
      iconURL: schema.author.iconUrl,
    });
  }
  if (schema.timestamp) embed.setTimestamp();
  if (schema.fields) {
    for (const field of schema.fields) {
      embed.addFields({ name: field.name, value: field.value, inline: field.inline });
    }
  }

  return embed;
}

function buildActionRow(row: UIActionRow): ActionRowBuilder<any> {
  const builder = new ActionRowBuilder<any>();

  for (const action of row.actions) {
    if (action.type === 'button') {
      builder.addComponents(buildButton(action));
    } else if (action.type === 'select') {
      builder.addComponents(buildSelect(action));
    }
  }

  return builder;
}

function buildButton(action: UIAction & { type: 'button' }): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(action.id)
    .setLabel(action.label)
    .setStyle(mapButtonStyle(action.style ?? 'primary'));

  if (action.emoji) button.setEmoji(action.emoji);
  if (action.disabled) button.setDisabled(true);

  return button;
}

function buildSelect(action: UIAction & { type: 'select' }): StringSelectMenuBuilder {
  const select = new StringSelectMenuBuilder()
    .setCustomId(action.id)
    .addOptions(
      action.options.map(opt => ({
        label: opt.label,
        value: opt.value,
        description: opt.description,
        emoji: opt.emoji ? { name: opt.emoji } : undefined,
        default: opt.default,
      })),
    );

  if (action.placeholder) select.setPlaceholder(action.placeholder);
  if (action.minValues !== undefined) select.setMinValues(action.minValues);
  if (action.maxValues !== undefined) select.setMaxValues(action.maxValues);
  if (action.disabled) select.setDisabled(true);

  return select;
}

export function buildModal(modal: UIModal): ModalBuilder {
  const builder = new ModalBuilder()
    .setCustomId(modal.id)
    .setTitle(modal.title);

  for (const field of modal.fields) {
    const input = new TextInputBuilder()
      .setCustomId(field.id)
      .setLabel(field.label)
      .setStyle(field.style === 'paragraph' ? TextInputStyle.Paragraph : TextInputStyle.Short);

    if (field.placeholder) input.setPlaceholder(field.placeholder);
    if (field.required !== undefined) input.setRequired(field.required);
    if (field.value) input.setValue(field.value);
    if (field.minLength !== undefined) input.setMinLength(field.minLength);
    if (field.maxLength !== undefined) input.setMaxLength(field.maxLength);

    builder.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
  }

  return builder;
}

function mapButtonStyle(style: string): ButtonStyle {
  switch (style) {
    case 'primary': return ButtonStyle.Primary;
    case 'secondary': return ButtonStyle.Secondary;
    case 'success': return ButtonStyle.Success;
    case 'danger': return ButtonStyle.Danger;
    default: return ButtonStyle.Primary;
  }
}

export async function sendResponse(
  interaction: Interaction,
  output: ScreenOutput,
  theme: ThemeTokens,
  mode: ResponseMode = 'reply',
): Promise<void> {
  const payload = buildResponse(output, theme);

  if (mode === 'reply' && (interaction as any).reply) {
    await (interaction as any).reply(payload);
  } else if (mode === 'update' && (interaction as any).update) {
    await (interaction as any).update(payload as InteractionUpdateOptions);
  } else if (mode === 'followup' && (interaction as any).followUp) {
    await (interaction as any).followUp(payload);
  } else if (mode === 'ephemeral' && (interaction as any).reply) {
    await (interaction as any).reply({ ...payload, ephemeral: true });
  } else if (mode === 'public' && (interaction as any).reply) {
    await (interaction as any).reply({ ...payload, ephemeral: false });
  }
}
