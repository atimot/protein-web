import { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { ImageUpload } from "./ImageUpload";

const meta = {
  title: "ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onImagesChange: fn(),
  },
} satisfies Meta<typeof ImageUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxImages: 4,
  },
};
