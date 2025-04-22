import { Meta, StoryObj } from "@storybook/react";

import { ReviewFeed } from "./ReviewFeed";

const meta: Meta<typeof ReviewFeed> = {
  title: "ReviewFeed",
  component: ReviewFeed,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="max-w-[500px] mx-auto">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};