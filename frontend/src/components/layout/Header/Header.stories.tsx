import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta = {
  title: "Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "追加のCSSクラス名",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: "custom-header",
  },
};

// ダークモードでのストーリー
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: "dark" },
  },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

// モバイルビューでのストーリー
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

// タブレットビューでのストーリー
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
