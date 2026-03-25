export type ResponseMode = 'reply' | 'update' | 'followup' | 'ephemeral' | 'public';

export type InteractionSource = 'slash_command' | 'button' | 'select_menu' | 'modal_submit';

export type StateScope = 'user' | 'message' | 'channel' | 'guild';

export interface ThemeTokens {
  name: string;
  colors: {
    primary: number;
    secondary: number;
    success: number;
    danger: number;
    warning: number;
    info: number;
    muted: number;
    background: number;
  };
  branding: {
    footer?: string;
    iconUrl?: string;
  };
}

export interface UIField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface UIEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: UIField[];
  footer?: string;
  thumbnail?: string;
  image?: string;
  author?: { name: string; iconUrl?: string };
  timestamp?: boolean;
}

export interface UIActionButton {
  type: 'button';
  id: string;
  label: string;
  style?: 'primary' | 'secondary' | 'success' | 'danger';
  emoji?: string;
  disabled?: boolean;
}

export interface UIActionSelect {
  type: 'select';
  id: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  options: UISelectOption[];
  disabled?: boolean;
}

export interface UISelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string;
  default?: boolean;
}

export type UIAction = UIActionButton | UIActionSelect;

export interface UIActionRow {
  actions: UIAction[];
}

export interface UIModal {
  id: string;
  title: string;
  fields: UIModalField[];
}

export interface UIModalField {
  id: string;
  label: string;
  style?: 'short' | 'paragraph';
  placeholder?: string;
  required?: boolean;
  value?: string;
  minLength?: number;
  maxLength?: number;
}

export interface ScreenOutput {
  embeds: UIEmbed[];
  actionRows: UIActionRow[];
  modal?: UIModal;
  ephemeral?: boolean;
}

export interface ActionContext {
  actionId: string;
  source: InteractionSource;
  userId: string;
  guildId: string | null;
  channelId: string;
  messageId?: string;
  values?: string[];
  modalValues?: Record<string, string>;
  state: SessionAccessor;
  openScreen: (screenId: string, params?: Record<string, unknown>) => Promise<void>;
  refreshScreen: () => Promise<void>;
  closeScreen: () => Promise<void>;
  showModal: (modal: UIModal) => Promise<void>;
  respond: (output: ScreenOutput, mode?: ResponseMode) => Promise<void>;
  raw: unknown;
}

export interface SessionAccessor {
  get<T = unknown>(key: string): T | undefined;
  set<T = unknown>(key: string, value: T): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

export interface ScreenDefinition {
  id: string;
  render: (ctx: ActionContext) => ScreenOutput | Promise<ScreenOutput>;
  actions?: Record<string, (ctx: ActionContext) => void | Promise<void>>;
  onMount?: (ctx: ActionContext) => void | Promise<void>;
  onRefresh?: (ctx: ActionContext) => void | Promise<void>;
  onUnmount?: (ctx: ActionContext) => void | Promise<void>;
}

export interface ScreenConfig {
  id: string;
  render: (ctx: ActionContext) => ScreenOutput | Promise<ScreenOutput>;
  actions?: Record<string, (ctx: ActionContext) => void | Promise<void>>;
  onMount?: (ctx: ActionContext) => void | Promise<void>;
  onRefresh?: (ctx: ActionContext) => void | Promise<void>;
  onUnmount?: (ctx: ActionContext) => void | Promise<void>;
}

export interface AppConfig {
  theme?: ThemeTokens;
  screens: ScreenDefinition[];
  sessionTTL?: number;
}

export interface ObsidianApp {
  config: AppConfig;
  screens: Map<string, ScreenDefinition>;
  getScreen: (id: string) => ScreenDefinition | undefined;
  theme: ThemeTokens;
}

export interface RendererContract {
  renderScreen: (output: ScreenOutput, theme: ThemeTokens) => unknown;
}
