import { z } from "zod";
import { eligibilityEnums } from "@farcaster/rings-next/constants";

const schema = z
  .object({
    channelUrl: z.string().min(1, { message: 'Channel URL is required' }).startsWith('https://warpcast.com/~/channel/', { message: 'Please enter valid channel URL e.g. https://warpcast.com/~/channel/tipster'}),
    botName: z.string().min(1, { message: 'Bot name is required' }),
    triggerWord: z.string().min(1, { message: 'Trigger word is required' }),
    eligibilityExplanation: z.string().min(1, { message: 'Eligibility description is required' }),
    eligibilityType: z.enum([eligibilityEnums.AllowList, eligibilityEnums.HatsGated]),
    adminEligibilityType: z.enum([eligibilityEnums.AllowList, eligibilityEnums.HatsGated]),
    eligibleUsers: z.array(z.object({
      id: z.number().min(1, { message: 'ID is required' }),
    })),
    eligibleHatWearer: z.object({
      chainId: z.number(),
      hatId: z.string(),
    }),
    adminEligibleUsers: z.array(z.object({
      id: z.number().min(1, { message: 'ID is required' }),
    })),
    adminEligibleHatWearer: z.object({
      chainId: z.number(),
      hatId: z.string(),
    }),
    dailyAllowance: z.number().min(1, { message: 'Daily Allowance is required' }),
  })
  // conditionally render errors for eligibility
  .superRefine((values, ctx) => {
    // eligibility criteria
    if (values.eligibilityType === eligibilityEnums.HatsGated) {
      if (!values.eligibleHatWearer?.chainId) {
        ctx.addIssue({
          message: 'Chain ID is required.',
          code: z.ZodIssueCode.custom,
          path: ['eligibleHatWearer.chainId'],
        });
      }

      if (!values.eligibleHatWearer?.hatId) {
        ctx.addIssue({
          message: 'Hat ID is required.',
          code: z.ZodIssueCode.custom,
          path: ['eligibleHatWearer.hatId'],
        });
      }
    }

    // admin eligibility criteria
    if (values.adminEligibilityType === eligibilityEnums.HatsGated) {
      if (!values.adminEligibleHatWearer?.chainId) {
        ctx.addIssue({
          message: 'Chain ID is required.',
          code: z.ZodIssueCode.custom,
          path: ['adminEligibleHatWearer.chainId'],
        });
      }

      if (!values.adminEligibleHatWearer?.hatId) {
        ctx.addIssue({
          message: 'Hat ID is required.',
          code: z.ZodIssueCode.custom,
          path: ['adminEligibleHatWearer.hatId'],
        });
      }
    }
  });

export default schema;