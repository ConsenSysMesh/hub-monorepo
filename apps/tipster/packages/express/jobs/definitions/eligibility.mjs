import JobHandlers from '@tipster/express/jobs/handlers.mjs';
export const eligibilityDefinitions = (agenda) => {
    agenda.define("update-eligibility-and-allowance", JobHandlers.updateAllEligibilityAndAllowance);
    agenda.define("update-one-eligibility-and-allowance", JobHandlers.updateOneEligibilityAndAllowance);
};
