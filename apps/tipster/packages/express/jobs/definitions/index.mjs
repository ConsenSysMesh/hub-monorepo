import { eligibilityDefinitions } from "@tipster/express/jobs/definitions/eligibility.mjs";

const definitions = [eligibilityDefinitions];

export const allDefinitions = (agenda) => {
    definitions.forEach((definition) => definition(agenda));
};
