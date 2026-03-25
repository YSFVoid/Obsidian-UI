import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type InteractionReplyOptions,
} from 'discord.js';
import type {
  Renderer,
  RenderPayload,
  ScreenOutput,
  ThemeTokens,
  UIEmbed,
  UIActionRow,
  UIAction,
  UIModal,
} from '@obsidian-ui/core';

export class LegacyRenderer implements Renderer {
  render(output: ScreenOutput, theme: ThemeTokens): RenderPayload {
    const embeds = output.embeds.map(e => this.buildEmbed(e, theme));
    const components = output.actionRows.map(row => this.buildActionRow(row));

    return {
      data: { embeds, components, ephemeral: output.ephemeral ?? false } satisfies InteractionReplyOptions,
      ephemeral: output.ephemeral,
    };
  }

  buildModal(modal: UIModal): ModalBuilder {
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

  private buildEmbed(schema: UIEmbed, theme: ThemeTokens): EmbedBuilder {
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
      embed.setAuthor({ name: schema.author.name, iconURL: schema.author.iconUrl });
    }
    if (schema.timestamp) embed.setTimestamp();
    if (schema.fields) {
      for (const field of schema.fields) {
        embed.addFields({ name: field.name, value: field.value, inline: field.inline });
      }
    }

    return embed;
  }

  private buildActionRow(row: UIActionRow): ActionRowBuilder<any> {
    const builder = new ActionRowBuilder<any>();

    for (const action of row.actions) {
      if (action.type === 'button') {
        builder.addComponents(this.buildButton(action));
      } else if (action.type === 'select') {
        builder.addComponents(this.buildSelect(action));
      }
    }

    return builder;
  }

  private buildButton(action: UIAction & { type: 'button' }): ButtonBuilder {
    const button = new ButtonBuilder()
      .setCustomId(action.id)
      .setLabel(action.label)
      .setStyle(mapButtonStyle(action.style ?? 'primary'));

    if (action.emoji) button.setEmoji(action.emoji);
    if (action.disabled) button.setDisabled(true);

    return button;
  }

  private buildSelect(action: UIAction & { type: 'select' }): StringSelectMenuBuilder {
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
