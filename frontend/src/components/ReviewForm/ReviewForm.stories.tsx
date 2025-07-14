import { Meta, StoryObj } from "@storybook/react";

import { ReviewForm } from "./ReviewForm";

const meta: Meta<typeof ReviewForm> = {
  title: "ReviewForm",
  component: ReviewForm,
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
  args: {
    onSubmit: () => {},
    isSubmitting: false,
  },
};
